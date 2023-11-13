import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react"
import fakeExperiences from '../../../fake-data/experiences.json'
import { supabase } from "../../utils/supabase";
import { useAuth } from "../../auth/authContext";

export type Experience = {
    id: string;
    name: String;
    description: String;
    gallery: String[];
}



export type ExperienceState = {
    discover: { [experience_id: string]: Experience },
    selected: { [experience_id: string]: Experience },
}

export type ExperienceAction = { 
    type: String, 
    payload?: {
        state?: ExperienceState,
        filter?: { experience_id: string },
    } 
}

type ExperienceReducer = 
    (arg0: ExperienceState, arg1: ExperienceAction)=>ExperienceState

function experienceReducer(
    state: ExperienceState, 
    action: ExperienceAction,
){
    const { type, payload } = action
    
    if(
        type == 'set_state' 
        && !!payload?.state
    ){
        return payload.state
    }

    if(
        type == 'deselect' 
        && !!payload?.filter.experience_id 
    ){
        const newState: ExperienceState = { 
            discover: { ...state.discover },
            selected: { ...state.selected },
        }
        newState.discover[payload.filter.experience_id] =
            state.selected[payload.filter.experience_id]
        delete newState.selected[payload.filter.experience_id]
        return newState
    }
    
    if(
        type == 'select' 
        && !!payload?.filter.experience_id 
    ){
        const newState: ExperienceState = { 
            discover: { ...state.discover },
            selected: { ...state.selected },
        }
        newState.selected[payload.filter.experience_id] =
            state.discover[payload.filter.experience_id]
        delete newState.discover[payload.filter.experience_id]
        return newState
    }

    return state
}

const experienceContext = createContext(null)

export function useExperience(){
    return useContext(experienceContext)
}

export function ExperienceContextProvider({ children }){
    const { user } = useAuth()

    const [experiences, dispatchExperiences] =
        useReducer<ExperienceReducer>(experienceReducer, { discover: {}, selected: {} })

    //TODO replace with useQuery
    useEffect(()=>{
        if(! user?.id) return
        fetchExperiences()
    },[user?.id])

    async function fetchExperiences() {
        const { data: selected, error: selected_error } = await supabase
            .from('experiences')
            .select('*, experience_selections!inner(*)')

        if(selected_error) console.error(selected_error)

        const { data: discover, error: discover_error } = await supabase
            .from('experiences')
            .select('*, experience_selections(experience_id)')
            .neq('experience_selections.experience_id', user.id)

        if(discover_error) console.error(discover_error)

        const state: ExperienceState = {
            discover: discover.reduce((carry, row)=>{
                // remove selected from discover
                if(row.experience_selections.length) return carry
                delete row['experience_selections']
                carry[row.id] = row
                return carry
            },{}),
            selected: selected.reduce((carry, row)=>{
                delete row['experience_selections']
                carry[row.id] = row
                return carry
            },{}),
        }


        dispatchExperiences({
            type: 'set_state',
            payload: { state },
        })
    }

    async function addExperience(experience_id: string) {
        dispatchExperiences({
            type: 'select',
            payload: { filter: { experience_id }} 
        }) 

        const { error } = await supabase.from('experience_selections')
            .insert({ experience_id })

        if(error)
            console.error(error)
    }

    async function removeExperience(experience_id: string) {
        dispatchExperiences({
            type: 'deselect',
            payload: { filter: { experience_id }} 
        }) 

        const { error } = await supabase.from('experience_selections')
            .delete()
            .eq('experience_id', experience_id)
        if(error)
            console.error(error)
    }
    

    function selectSelectedExperiences(): Experience[] {
        return Object.values(experiences.selected)
    }

    function selectUnselectedExperiences(): Experience[] {
        return Object.values(experiences.discover)
    }


    const value = useMemo(()=>{ 
        return {
            selectUnselectedExperiences,
            selectSelectedExperiences,
            addExperience,
            removeExperience,
        }
    },[experiences])

    return <experienceContext.Provider value={value}>
        { children }
    </experienceContext.Provider>
}
