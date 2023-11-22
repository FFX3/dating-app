import { useState, createContext, useContext, useEffect, useReducer } from 'react';
import { useAuth } from '../../auth/authContext';
import { supabase } from '../../utils/supabase';
import { Database } from '../../../database.types';

export type Availability = Database['public']['Tables']['availabilities']['Row']

type hook = {
    [key: string]: any,
    availability: AvailabilityState,
    dispatchAvailability: React.Dispatch<AvailabilityAction>,
}
const availabilityContext = createContext<hook>(null)

export function timeStringToDate(time: string){
    const [hours, minutes] = time.split(':')
    const date = new Date()
    date.setHours(parseInt(hours))
    date.setMinutes(parseInt(minutes))
    return date
}

export function useAvailabilities(){
    return useContext(availabilityContext)
}

type TimeRange = [start:string, end:string]
type DailyAvailabilily = TimeRange[]

type AvailabilityState = {
    exeptions: any[]
    weekly: {
        monday: DailyAvailabilily,
        tuesday: DailyAvailabilily,
        wednesday: DailyAvailabilily,
        thursday: DailyAvailabilily,
        friday: DailyAvailabilily,
        saturday: DailyAvailabilily,
        sunday: DailyAvailabilily,
    }
}

const startingAvailabilityState = {
    exeptions:[],
    weekly: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
    }
}

type AvailabilityAction = {
    type: 'set',
    payload: AvailabilityState
}
|{
    type: 'set_day',
    payload: {
        day: 
            'monday' |
            'tuesday' |
            'wednesday' |
            'thursday' |
            'friday' |
            'saturday' |
            'sunday' 
        state: DailyAvailabilily
    }
}

type AvailabilityReducer = 
    (arg0: AvailabilityState, arg1: AvailabilityAction)=>AvailabilityState

function availabilityReducer(
    state: AvailabilityState, 
    action: AvailabilityAction,
){
    const { type, payload } = action

    switch(type){
        case 'set':
            state = payload
            break

        case 'set_day':
            state.weekly[payload.day] = payload.state
            break
    }

    return { ...state }
}

const messagerContext = createContext(null)

export function useMessager(){
    return useContext(messagerContext)
}


export function AvailabilityContextProvider({ children }){
    const { user } = useAuth()
    const [availability, dispatchAvailability] 
        = useReducer<AvailabilityReducer>(availabilityReducer, startingAvailabilityState)

    const [exceptions, setExceptions] = useState([])

    useEffect(()=>{
        if(!user?.id) return
        fetchAvailabilites()
    },[user?.id])

    useEffect(()=>{
        if(!user?.id) return
        saveAvailability()
    },[availability])

    async function fetchAvailabilites(){
        const { data, error } = await supabase
            .from('profiles')
            .select('availability')

        if(error) return console.error(error)

        console.log('availability', JSON.stringify(data))
    }

    async function saveAvailability(){
        const { data, error } = await supabase
            .from('profiles')
            .update({
                //TODO fix type gen
                availability: availability.weekly
            })
        if(error) console.error(error)

        return data
    }

    async function editException(exception){
        setExceptions(exceptions.map((_exception)=>{ 
            if (exception.id !== _exception.id) return _exception
            return exception
        }))
        const { id, start, end } = exception
        const { data, error } = await supabase.from('availability_exceptions')
            .update({ start, end })
            .eq('id', id)
            .select()

        if(error) console.error(error)

        return data
    }

    async function removeException(exception_id: string){
        setExceptions(exceptions.filter((exception)=>exception.id !== exception_id))
        const { data, error } = await supabase.from('availability_exceptions')
            .delete()
            .eq('id', exception_id)

        if(error) console.error(error)

        return data
    }

    async function addException(start: Date, end: Date){
        const { data: exception_id, error } = await supabase
            .rpc('add_availability_exception', { _end: end, _start: start })
            .single()

        console.log(exception_id)
        if(error) console.error(error)
         
        const new_exception = {
            id: exception_id,
            start,
            end,
        }
        setExceptions([new_exception, ...exceptions])
    }

    const value = {
        availability,
        dispatchAvailability,
        exceptions, setExceptions,
        removeException,
        addException,
        editException,
    }

    return <availabilityContext.Provider value={value}>
        {children}
    </availabilityContext.Provider>
}
