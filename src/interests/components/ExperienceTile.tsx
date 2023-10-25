import React, { FunctionComponent } from 'react'
import { Text, View } from 'react-native'
import { Experience } from '../contexts/experience'

export function ExperienceTile(
    { experience, action } :
    { experience: Experience, action: FunctionComponent }
){

    return <View
        style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 50,
            paddingVertical: 20,
        }}
    >
        <Text>{experience.name}</Text>
        {action(experience)}
    </View>
}
