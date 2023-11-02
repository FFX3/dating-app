import { useState, createContext, useContext, useEffect } from 'react';
import snowflake from '../../utils/snowflake';
import { useAuth } from '../../auth/authContext';
import { supabase } from '../../utils/supabase';
import { Database } from '../../../database.types';

export type Availability = Database['public']['Tables']['availabilities']['Row']

const availabilityContext = createContext(null)

function timeStringToDate(time: string){
    const [hours, minutes] = time.split(':')
    const date = new Date()
    date.setHours(hours)
    date.setMinutes(minutes)
    return date
}

export function useAvailabilities(){
    return useContext(availabilityContext)
}

export function AvailabilityContextProvider({ children }){
    const { user } = useAuth()

    const [start_monday, set_start_monday] = useState(new Date(1598051730000))
    const [end_monday, set_end_monday] = useState(new Date(1598051730000))

    const [start_tuesday, set_start_tuesday] = useState(new Date(1598051730000))
    const [end_tuesday, set_end_tuesday] = useState(new Date(1598051730000))

    const [start_wednesday, set_start_wednesday] = useState(new Date(1598051730000))
    const [end_wednesday, set_end_wednesday] = useState(new Date(1598051730000))

    const [start_thursday, set_start_thursday] = useState(new Date(1598051730000))
    const [end_thursday, set_end_thursday] = useState(new Date(1598051730000))

    const [start_friday, set_start_friday] = useState(new Date(1598051730000))
    const [end_friday, set_end_friday] = useState(new Date(1598051730000))

    const [start_saturday, set_start_saturday] = useState(new Date(1598051730000))
    const [end_saturday, set_end_saturday] = useState(new Date(1598051730000))

    const [start_sunday, set_start_sunday] = useState(new Date(1598051730000))
    const [end_sunday, set_end_sunday] = useState(new Date(1598051730000))

    const [exceptions, setExceptions] = useState([])

    useEffect(()=>{
        if(!user?.id) return
        fetchAvailabilites()
    },[user?.id])

    useEffect(()=>{
        if(!user?.id) return
        saveAvailability()
    },[
        start_monday.getTime(),
        start_tuesday.getTime(),
        start_wednesday.getTime(),
        start_thursday.getTime(),
        start_friday.getTime(),
        start_saturday.getTime(),
        start_sunday.getTime(),
        end_monday.getTime(),
        end_tuesday.getTime(),
        end_wednesday.getTime(),
        end_thursday.getTime(),
        end_friday.getTime(),
        end_saturday.getTime(),
        end_sunday.getTime(),
    ])

    async function fetchAvailabilites(){
        const { data, error } = await supabase
            .from('availabilities')
            .select()
            .match({
                item_id: user.id,
                item_type: 'profile'
            })
            .limit(1)
            .maybeSingle()
        if(error) return console.error(error)
        
        if(!!data){
            set_start_monday(timeStringToDate(data.start_monday))
            set_start_tuesday(timeStringToDate(data.start_tuesday))
            set_start_wednesday(timeStringToDate(data.start_wednesday))
            set_start_thursday(timeStringToDate(data.start_thursday))
            set_start_friday(timeStringToDate(data.start_friday))
            set_start_saturday(timeStringToDate(data.end_saturday))
            set_start_sunday(timeStringToDate(data.end_sunday))
            set_end_monday(timeStringToDate(data.end_monday))
            set_end_tuesday(timeStringToDate(data.end_tuesday))
            set_end_wednesday(timeStringToDate(data.end_wednesday))
            set_end_thursday(timeStringToDate(data.end_thursday))
            set_end_friday(timeStringToDate(data.end_friday))
            set_end_saturday(timeStringToDate(data.end_saturday))
            set_end_sunday(timeStringToDate(data.end_sunday))
        }
    }

    async function saveAvailability(){
        const { data, error } = await supabase
            .from('availabilities')
            .upsert({
                item_id: user.id,
                item_type: 'profile',
                start_monday: `${start_monday.getHours()}:${start_monday.getMinutes()}`,
                start_tuesday: `${start_tuesday.getHours()}:${start_tuesday.getMinutes()}`,
                start_wednesday: `${start_wednesday.getHours()}:${start_wednesday.getMinutes()}`,
                start_thursday: `${start_thursday.getHours()}:${start_thursday.getMinutes()}`,
                start_friday: `${start_friday.getHours()}:${start_friday.getMinutes()}`,
                start_saturday: `${start_saturday.getHours()}:${start_saturday.getMinutes()}`,
                start_sunday: `${start_sunday.getHours()}:${start_sunday.getMinutes()}`,
                end_monday: `${end_monday.getHours()}:${end_monday.getMinutes()}`,
                end_tuesday: `${end_tuesday.getHours()}:${end_tuesday.getMinutes()}`,
                end_wednesday: `${end_wednesday.getHours()}:${end_wednesday.getMinutes()}`,
                end_thursday: `${end_thursday.getHours()}:${end_thursday.getMinutes()}`,
                end_friday: `${end_friday.getHours()}:${end_friday.getMinutes()}`,
                end_saturday: `${end_saturday.getHours()}:${end_saturday.getMinutes()}`,
                end_sunday: `${end_sunday.getHours()}:${end_sunday.getMinutes()}`,
            },{ onConflict: 'item_id,item_type' })
            .match({
                item_id: user.id,
                item_type: 'profile'
            })
            .maybeSingle()
        if(error) console.error(error)

        return data
    }

    function removeException(exception_id: string){
        setExceptions(exceptions.filter((exception)=>exception.id !== exception_id))
    }

    function addException(start: Date, end: Date){
        setExceptions([{
            id: snowflake.generate(),
            start,
            end,
        },
        ...exceptions])
    }

    const value = {
        start_monday,
        start_tuesday,
        start_wednesday,
        start_thursday,
        start_friday,
        start_saturday,
        start_sunday,
        end_monday,
        end_tuesday,
        end_wednesday,
        end_thursday,
        end_friday,
        end_saturday,
        end_sunday,
        set_start_monday,
        set_start_tuesday,
        set_start_wednesday,
        set_start_thursday,
        set_start_friday,
        set_start_saturday,
        set_start_sunday,
        set_end_monday,
        set_end_tuesday,
        set_end_wednesday,
        set_end_thursday,
        set_end_friday,
        set_end_saturday,
        set_end_sunday,
        exceptions, setExceptions,
        removeException,
        addException,
    }

    return <availabilityContext.Provider value={value}>{children}</availabilityContext.Provider>
}
