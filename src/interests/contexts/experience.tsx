import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react"
import fakeExperiences from '../../../fake-data/experiences.json'

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
    const [experiences, dispatchExperiences] =
        useReducer<ExperienceReducer>(experienceReducer, { discover: {}, selected: {} })

    //TODO replace with useQuery
    useEffect(()=>{
        fetchExperiences()
    },[])

    function fetchExperiences() {
        dispatchExperiences({
            type: 'set_state',
            payload: { state: fakeExperiences },
        })
    }

    function addExperience(experience_id: string) {
        dispatchExperiences({
            type: 'select',
            payload: { filter: { experience_id }} 
        }) 
    }

    function removeExperience(experience_id: string) {
        dispatchExperiences({
            type: 'deselect',
            payload: { filter: { experience_id }} 
        }) 
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
