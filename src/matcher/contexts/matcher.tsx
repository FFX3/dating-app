import React, { useState, createContext, useContext, useRef, useMemo, useReducer, useEffect } from "react"
import fakeProfiles from '../../../fake-data/matcher-queue.json'
import { get_profile_image_url, supabase } from "../../utils/supabase";
import { useAuth } from "../../auth/authContext";
import { Database } from "../../../database.types";
import { Profile } from "../../onboarding/screens/Profile";

export type PublicProfile = {
    id: string;
    name: string;
    bio: string;
    sex: string;
    gallery: string[];
}

type DatabasePendingMatch = Database['public']['Views']['pending_matches']['Row']

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

    useEffect(()=>{
        if(!user?.id){ return }
        fillQueue()
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
            //payload: { profiles: newQueue.concat(fakeProfiles) }
            payload: { profiles: newQueue }
        })
    }
    
    const value = {
        dispatchMatcheQueue,
        matcherQueue,
    }

    return <matcherStateContext.Provider value={value}>
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
        selectQueue
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
