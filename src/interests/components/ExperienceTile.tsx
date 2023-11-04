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
            paddingHorizontal: 50,
            paddingVertical: 20,
        }}
    >
        <View
            style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
            }}
        >
            <Text style={{ fontSize: 20 }}>{experience.name}</Text>
            <View
                style={{
                    flexDirection: 'row',
                }}
            >
                {action(experience)}
                <Button title='Details' 
                    onPress={()=>{
                        navigation.navigate('Experiences', {
                                screen: 'Details',
                                params: { experience }
                        })
                    }}
                />
            </View>
        </View>
        <View>
            <Text numberOfLines={2}>{ experience.description }</Text>
        </View>
    </View>
}
