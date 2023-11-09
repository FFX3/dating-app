import React, { useState, createContext, useContext, useRef, useMemo, useReducer, useEffect, ReactNode } from "react"
import { get_profile_image_url, supabase } from "../../utils/supabase";
import { useAuth } from "../../auth/authContext";
import { Database } from "../../../database.types";
import { usePortal } from "@gorhom/portal";
import { FullWindowOverlay } from "react-native-screens";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";
import { RealtimePostgresUpdatePayload } from "@supabase/supabase-js";
import { Portal } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

const SCREEN_HEIGHT = Dimensions.get('window').height - 50
const SCREEN_WIDTH = Dimensions.get('window').width

export type PublicProfile = {
    id: string;
    name: string;
    bio: string;
    sex: string;
    gallery: string[];
}

type DatabasePendingMatch = Database['public']['Views']['pending_matches']['Row']
type DatabaseMatch = Database['public']['Tables']['matches']['Row']

type MatcherQueueState = {
    index: number
    order: string[]
    profiles: { [key:string]:PublicProfile }
}
type MatcherQueueAction = {
    type: 'set' | 'like' | 'pass',
    payload?: {
        profiles?: PublicProfile[],
    }
};

type MatcherQueueReducer = 
    (arg0: MatcherQueueState, arg1: MatcherQueueAction)=>MatcherQueueState

const matcherContext = createContext(null)

export function useMatcher(){
    return useContext(matcherContext)
}

const matcherStateContext = createContext(null)

export function useMatcherState(){
    return useContext(matcherStateContext)
}

function matcherQueueReducer(state: MatcherQueueState, action: MatcherQueueAction): MatcherQueueState{
    const { type } = action
    if(type == 'set'
        && action.payload.profiles){
        const profiles = action.payload.profiles.reduce((carry, profile)=>{
            carry[profile.id.toString()] = profile
            return carry
        },{})
 
        state = {
            index: 0,
            profiles,
            order: Object.keys(profiles)
        }
    }

    if(type == 'like'){
        return { 
            ...state,
            index: state.index + 1
        }
    }

    if(type == 'pass'){
        return { 
            ...state,
            index: state.index + 1
        }
    }

    return state
}

export function NewMatchPopup({ close, match_id }){
    const duration = 4000
    const animatedOpacity = useRef(new Animated.Value(1)).current

    function startFadeOut(){
        Animated.timing(animatedOpacity, {
            toValue: 0,
            delay: duration/2,
            duration: duration/2,
            useNativeDriver: true,
        }).start();

        return setTimeout(close, duration)
    }

    useEffect(()=>{
        const timeout = startFadeOut()
        return ()=>{ clearTimeout(timeout) }
    },[])

    return( 
        <SafeAreaProvider>
            <Animated.View style={{
                height: SCREEN_HEIGHT,
                width: SCREEN_WIDTH,
                backgroundColor: 'green',
                opacity: animatedOpacity,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Text>match_id: { match_id }</Text>
            </Animated.View>
        </SafeAreaProvider>
    )
}

export function MatcherContextStateProvider({ children }){
    const { user } = useAuth()

    const [matcherQueue, dispatchMatcheQueue] = useReducer<MatcherQueueReducer>(matcherQueueReducer, {
        index: 0,
        order: [],
        profiles: {},
    })

    const [newMatchId, setNewMatchId] = useState<string>(null)

    useEffect(()=>{
        if(!user?.id){ return }
        fillQueue()
        subsribeToMatchStream()
    },[user?.id])

    async function fillQueue(){
        const { data, error } = await supabase
            .from('pending_matches')
            .select()
            .returns<DatabasePendingMatch[]>()
            

        if(error) console.error(error)

        const newQueue = []
        for (var i=0; i<data.length; i++){
            const row = data[i]
            const gallery = []

            const { image_ids } = row
            if(image_ids){
                for (var i=0; i<image_ids.length; i++){
                    gallery
                        .push(await get_profile_image_url(image_ids[i], row.profile_id))
                }
            }
            newQueue.push({
                id: row.profile_id,
                name: row.name,
                sex: row.sex,
                bio: row.bio,
                gallery: gallery,
            })
        }

        dispatchMatcheQueue({
            type: 'set',
            payload: { profiles: newQueue }
        })
    }

    function subsribeToMatchStream(){
        supabase.channel('new-matches')
            .on('postgres_changes',
                {
                  event: 'UPDATE',
                  schema: 'public',
                  table: 'matches',
                },
                (payload: RealtimePostgresUpdatePayload<DatabaseMatch>) => {
                    console.log('from subscription')
                    const { id: match_id, members, liked: new_liked } = payload.new
                    const { liked: old_liked } = payload.old

                    if(new_liked == null) { 
                        console.log('new_liked is null')
                        return 
                    }

                    if(!(old_liked == null || old_liked.length != new_liked.length)){ 
                        console.log('old an new is same')
                        return 
                    }
                    
                    if(new_liked.length != members.length){ 
                        console.log('not a match')
                        return 
                    }

                    new_liked.sort()
                    members.sort()

                    if(!new_liked.every((item, index)=>item==members[index])){ 
                        console.log('foreign member')
                        return 
                    }

                    setNewMatchId(match_id)
                }
            ).subscribe()
    }
    
    const value = {
        dispatchMatcheQueue,
        matcherQueue,
        newMatchId,
    }

    return <matcherStateContext.Provider value={value}>
        <Portal>
            {newMatchId && <NewMatchPopup 
                close={()=>setNewMatchId(null)}
                match_id={newMatchId}
            />}
        </Portal>
        { children }
    </matcherStateContext.Provider>
}

function MatcherContextInterfaceProvider({ children }){
    const  matcher = useMatcherState()
    function like() {
        const profile = selectQueue()[0]
        matcher.dispatchMatcheQueue({ type: 'like' })
        supabase.rpc('like', {
            _profile_id: profile.id
        }).then(({ error })=>{
            if(error){
                console.error(error)
            }
        })
    }

    function pass(){
        const profile = selectQueue()[0]
        matcher.dispatchMatcheQueue({ type: 'pass' })
        supabase.rpc('pass', {
            _profile_id: profile.id
        }).then(({ error })=>{
            if(error){
                console.error(error)
            }
        })
    }

    function selectQueue(){
        const { index, profiles, order } = matcher.matcherQueue
        const remaining_ids = order.slice(index)
        const remaining = remaining_ids.map((id)=>{
            return {...profiles[id]}
        })

        return remaining
    }

    const value = {
        like,
        pass,
        selectQueue,
        newMatchId: matcher.newMatchId,
    }

    return <matcherContext.Provider value={value}>
        { children }
    </matcherContext.Provider>
}

export function MatcherContextProvider({ children }){
    return <MatcherContextStateProvider>
        <MatcherContextInterfaceProvider>
            { children }
        </MatcherContextInterfaceProvider>
    </MatcherContextStateProvider>
}
