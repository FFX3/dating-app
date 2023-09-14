import { useState, createContext, useContext } from 'react';

const availabilityContext = createContext()

export function useAvailabilities(){
    return useContext(availabilityContext)
}

export function AvailabilityContextProvider({ children }){
    const [startMonday, setStartMonday] = useState(new Date(1598051730000))
    const [endMonday, setEndMonday] = useState(new Date(1598051730000))

    const [startTuesday, setStartTuesday] = useState(new Date(1598051730000))
    const [endTuesday, setEndTuesday] = useState(new Date(1598051730000))

    const [startWednesday, setStartWednesday] = useState(new Date(1598051730000))
    const [endWednesday, setEndWednesday] = useState(new Date(1598051730000))

    const [startThursday, setStartThursday] = useState(new Date(1598051730000))
    const [endThursday, setEndThursday] = useState(new Date(1598051730000))

    const [startFriday, setStartFriday] = useState(new Date(1598051730000))
    const [endFriday, setEndFriday] = useState(new Date(1598051730000))

    const [startSaturday, setStartSaturday] = useState(new Date(1598051730000))
    const [endSaturday, setEndSaturday] = useState(new Date(1598051730000))

    const [startSunday, setStartSunday] = useState(new Date(1598051730000))
    const [endSunday, setEndSunday] = useState(new Date(1598051730000))

    const [exceptions, setExceptions] = useState([
        {
            start: new Date(1598051730000),
            end: new Date()
        }
    ])

    function save(){
        //save availability
    }

    function saveExceptions(){

    }

    function saveAvailability(){

    }

    const value = {
        startMonday, setStartMonday, endMonday, setEndMonday,
        startTuesday, setStartTuesday, endTuesday, setEndTuesday,
        startWednesday, setStartWednesday, endWednesday, setEndWednesday,
        startThursday, setStartThursday, endThursday, setEndThursday,
        startFriday, setStartFriday, endFriday, setEndFriday,
        startSaturday, setStartSaturday, endSaturday, setEndSaturday,
        startSunday, setStartSunday, endSunday, setEndSunday,
        exceptions, setExceptions,
        save,
    }

    return <availabilityContext.Provider value={value}>{children}</availabilityContext.Provider>
}
