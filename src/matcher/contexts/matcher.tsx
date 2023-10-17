import React, { useState, createContext, useContext, useRef, useMemo, useReducer } from "react"
import fakeProfiles from '../../../fake-data/matcher-queue.json'

export type PublicProfile = {
    id: string;
    name: String;
    bio: String;
    sex: String;
    gallery: String[];
}

const matcherContext = createContext(null)

export function useMatcher(){
    return useContext(matcherContext)
}

function queueIndexReducer(state, action) {
    if(action == 'increment'){
        return state + 1
    }
    return state
}

export function MatcherContextProvider({ children }){

    const [queue, setQueue] = useState(fakeProfiles)
    const [liked, setLiked] = useState<PublicProfile[]>([])

    const [queueIndex, dispatchQueueIndex] = useReducer(queueIndexReducer, 0)

    console.log('index', queueIndex)

    const like = () => {
        setLiked([...liked, getQueue()[0]])
        dispatchQueueIndex('increment')
    }

    function pass(){
        dispatchQueueIndex('increment')
    }

    const getQueue = (): PublicProfile[] => {
        return queue.slice(queueIndex)
    }

    const value = useMemo(()=>{ 
        return {
            queueIndex,
            like,
            pass,
            liked,
            getQueue,
        }
    },[queueIndex])

    return <matcherContext.Provider value={value}>
        { children }
    </matcherContext.Provider>
}
