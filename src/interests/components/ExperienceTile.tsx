import React, { FunctionComponent } from 'react'
import { Button, Text, View } from 'react-native'
import { Experience } from '../contexts/experience'
import { useNavigation } from '@react-navigation/native'

export function ExperienceTile(
    { experience, action } :
    { experience: Experience, action: FunctionComponent }
){

    const navigation = useNavigation()

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
        <View
            style={{
                flexDirection: 'row',
            }}
        >
            {action(experience)}
            <Button title='Details' 
                onPress={()=>{
                    console.log('opening details')
                    navigation.navigate('Experiences', {
                            screen: 'Details',
                            params: { experience }
                    })
                }}
            />
        </View>
    </View>
}
