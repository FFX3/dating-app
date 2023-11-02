import { useAvailabilities } from "../contexts/AvailabilityContext"
import { View, Text, Button, FlatList } from "react-native"
import { useState } from "react"
import { IntervalPicker } from "../components/IntervalPicker"

export function ExceptionsScreen(){
    const { exceptions, addException } = useAvailabilities()

    if(!exceptions) return <></>

    return (
        <>
            <Text style={{
                textAlign: 'center',
                fontSize: 24,
                padding: 50
            }}>Exceptions</Text>
            <Button title="Add" onPress={()=>addException(new Date(), new Date())} />
            <FlatList 
                ItemSeparatorComponent={()=><View style={{ height: 20 }}></View>}
                contentContainerStyle={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 60,
                }}
                data={exceptions}
                renderItem={({ item }) => <Exception key={item.id} exception={item} />}
                
            />
        </>
    )
}

function Exception({ exception }){
    const { removeException, editException } = useAvailabilities()

    const { start, end } = exception

    return (
        <View style={{
            flexDirection: 'row',
            borderColor: 'grey',
            borderWidth: 1,
            borderRadius: 8,
            padding: 20
        }}>
            <IntervalPicker {...{
                start, setStart: (start)=>editException({...exception, start}), 
                end, setEnd: (end)=>editException({...exception, end}), 
                mode: 'datetime' 
            }} />
            <Button title='clear' onPress={()=>removeException(exception.id)}/>
        </View>
    )
}
