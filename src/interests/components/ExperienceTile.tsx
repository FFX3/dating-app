import React from 'react'
import { Text, View, Button } from 'react-native'

export function ExperienceTile({ experience }){
    function selectExperience(){

    }

    function deselectExperience(){

    }

    return <View>
        <Text>{experience.item.name}</Text>
        { experience.selected && <Button title='deselect' onPress={selectExperience} /> }
        { experience.selected || <Button title='select' onPress={deselectExperience} /> }
    </View>
}
