import { useAvailabilities } from "../contexts/AvailabilityContext"
import { View, Text, Button } from "react-native"
import { useState } from "react"
import { IntervalPicker } from "./IntervalPicker"

export function ExceptionsScreen(){
    const { exceptions } = useAvailabilities()

    if(!exceptions) return <></>

    return (
        <View style={{
            flexDirection: 'column',
            alignItems: 'center',
            padding: 60,
        }}>
            { exceptions.map((exception, i) => <Exception key={i} exception={exception} />)}
        </View>
    )
}

function Exception({ exception }){
    const [start, setStart] = useState(exception.start)
    const [end, setEnd] = useState(exception.end)
    return (
        <View style={{
            flexDirection: 'row'
        }}>
            <IntervalPicker {...{start, setStart, end, setEnd, mode: 'datetime' }} />
            <Button title='clear' />
        </View>
    )
}
