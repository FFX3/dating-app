import React, { useState } from 'react'
import { View, Button, Text } from 'react-native'
import { Checkbox, RadioButton, TextInput } from 'react-native-paper'
import { useProfile } from '../contexts/profile'
import { StyleSheet } from 'react-native'

export default function ProfileForm({ navigation, onSave, submitAction=false }){
    const { profile, saveProfile } = useProfile()
    const [name, setName] = useState(profile?.name)
    const [bio, setBio] = useState(profile?.bio)
    const [sex, setSex] = useState(profile?.sex)

    const [interestedInMales, setInterestedInMales] =
        useState(profile?.interested_in.includes('m'))
    const [interestedInFemales, setInterestedInFemales] = 
        useState(profile?.interested_in.includes('f'))
    const [interestedInOther, setInterestedInOther] = 
        useState(profile?.interested_in.includes('o'))

    function save(){
        const interested_in = []

        if(interestedInMales) interested_in.push('m')
        if(interestedInFemales) interested_in.push('f')
        if(interestedInOther) interested_in.push('o')

        saveProfile({
            name,
            bio,
            interested_in, 
        })
        if(onSave) onSave()
    }

    return (
        <View style={{
            flexDirection: 'column',
            padding: 20,
            gap: 20,
        }}>
                <TextInput label='Name' value={name} onChange={(text)=>setName(text)} />
                <TextInput label='Bio' multiline value={bio} onChange={(text)=>setBio(text)} />
                <View>
                    <Text>You are:</Text>
                    <RadioButton.Group value={sex} onValueChange={(text)=>setSex(text)} >
                        <View style={styles.radioGroupContainer}>
                            <View style={styles.radioButton}>
                                <Text>Male</Text>
                                <RadioButton.Android value='m' />
                            </View>
                            <View style={styles.radioButton}>
                                <Text>Female</Text>
                                <RadioButton.Android value='f' />
                            </View>
                            <View style={styles.radioButton}>
                                <Text>Other</Text>
                                <RadioButton.Android value='o' />
                            </View>
                        </View>
                    </RadioButton.Group>
                </View>
                <View>
                <Text>Interested in:</Text>
                    <View style={styles.radioGroupContainer}>
                        <View style={styles.radioButton}>
                            <Text>Males</Text>
                            <Checkbox.Android 
                                status={ interestedInMales ? "checked" : "unchecked" } 
                                onPress={()=>{setInterestedInMales(!interestedInMales)}}
                            />
                        </View>
                        <View style={styles.radioButton}>
                            <Text>Females</Text>
                            <Checkbox.Android 
                                status={ interestedInFemales ? "checked" : "unchecked" } 
                                onPress={()=>{setInterestedInFemales(!interestedInFemales)}}
                            />
                        </View>
                        <View style={styles.radioButton}>
                            <Text>Others</Text>
                            <Checkbox.Android 
                                status={ interestedInOther ? "checked" : "unchecked" } 
                                onPress={()=>{setInterestedInOther(!interestedInOther)}}
                            />
                        </View>
                    </View>
                </View>
                { !!submitAction ?
                    submitAction()
                :
                    <Button title='save' onPress={save}/>
                }
        </View>
    )
}

const styles = StyleSheet.create({
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: 100,
    },
    radioGroupContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    }
})
