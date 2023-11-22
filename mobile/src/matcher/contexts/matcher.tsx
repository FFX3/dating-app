import React, { useState, createContext, useContext, useRef, useMemo, useReducer, useEffect, ReactNode } from "react"
import { get_profile_image_url, supabase } from "../../utils/supabase";
import { useAuth } from "../../auth/authContext";
import { Database } from "../../../database.types";
import { RealtimePostgresUpdatePayload } from "@supabase/supabase-js";
import { Portal } from "react-native-paper";
import { NewMatchPopup } from "../components/NewMatchPopup";
import { DatabaseContact } from "../../messager/contexts/messager";


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

export function MatcherContextStateProvider({ children }){
    const { user } = useAuth()

    const [matcherQueue, dispatchMatcheQueue] = useReducer<MatcherQueueReducer>(matcherQueueReducer, {
        index: 0,
        order: [],
        profiles: {},
    })
    
    const [newMatch, setNewMatch] = useState<PublicProfile>(null)

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
        for (let i=0; i<data.length; i++){
            const row = data[i]
            const gallery = []

            const { image_ids } = row
            if(image_ids){
                for (let k=0; k<image_ids.length; k++){
                    gallery
                        .push(await get_profile_image_url(image_ids[k], row.profile_id))
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
                async (payload: RealtimePostgresUpdatePayload<DatabaseMatch>) => {
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

                    const { data, error } = await supabase
                        .from('contacts')
                        .select()
                        .eq('match_id', match_id)
                        .single<DatabaseContact>()

                    if(error) console.error(error)

                    const gallery = []

                    const { profile_id: id, sex, bio, name, image_ids } = data
                    if(image_ids){
                        for (let i=0; i<image_ids.length; i++){
                            gallery
                                .push(await get_profile_image_url(image_ids[i], data.profile_id))
                        }
                    }
                    setNewMatch({ id, sex, bio, name, gallery, })
                }
            ).subscribe()
    }
    
    const value = {
        dispatchMatcheQueue,
        matcherQueue,
        newMatch,
    }

    return <matcherStateContext.Provider value={value}>
        <Portal>
            {!!newMatch && <NewMatchPopup 
                close={()=>setNewMatch(null)}
                profile={newMatch}
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
        console.log(profile)
        supabase.rpc('like', {
            profile_id: profile.id
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
        newMatch: matcher.newMatch,
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
