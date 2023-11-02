import React, { useEffect, useState } from 'react'
import { View, Button, Text } from 'react-native'
import { Checkbox, RadioButton, TextInput } from 'react-native-paper'
import { Profile, useProfile } from '../contexts/profile'
import { StyleSheet } from 'react-native'

export default function ProfileForm({ submitAction, submitActionTitle }){
    const { profile, saveProfile } = useProfile()
    const [name, setName] = useState(profile?.name)
    const [bio, setBio] = useState(profile?.bio)
    const [sex, setSex] = useState<Profile['sex']>(profile?.sex)

    const [interestedInMales, setInterestedInMales] =
        useState(profile?.interested_in.includes('male'))
    const [interestedInFemales, setInterestedInFemales] = 
        useState(profile?.interested_in.includes('female'))
    const [interestedInOther, setInterestedInOther] = 
        useState(profile?.interested_in.includes('other'))

    useEffect(()=>{
        if(!profile){ return }

        setName(profile.name)
        setBio(profile.bio)
        setSex(profile.sex)

        setInterestedInMales(profile?.interested_in.includes('male'))
        setInterestedInFemales(profile?.interested_in.includes('female'))
        setInterestedInOther(profile?.interested_in.includes('other'))

    }, [profile?.user_id])

    function save(){
        const interested_in: Profile['interested_in'] = []

        if(interestedInMales) interested_in.push('male')
        if(interestedInFemales) interested_in.push('female')
        if(interestedInOther) interested_in.push('other')

        const newProfile = {
            name,
            bio,
            sex,
            interested_in, 
        }
        saveProfile(newProfile)
        if(submitAction) submitAction()
    }

    return (
        <View style={{
            flexDirection: 'column',
            padding: 20,
            gap: 20,
        }}>
                <TextInput label='Name' value={name} onChangeText={(text)=>setName(text)} />
                <TextInput label='Bio' multiline value={bio} onChangeText={(text)=>setBio(text)} />
                <View>
                    <Text>You are:</Text>
                    <RadioButton.Group value={sex} onValueChange={(text)=>setSex(text)} >
                        <View style={styles.radioGroupContainer}>
                            <View style={styles.radioButton}>
                                <Text>Male</Text>
                                <RadioButton.Android value='male' />
                            </View>
                            <View style={styles.radioButton}>
                                <Text>Female</Text>
                                <RadioButton.Android value='female' />
                            </View>
                            <View style={styles.radioButton}>
                                <Text>Other</Text>
                                <RadioButton.Android value='other' />
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
                <Button 
                    title={ submitActionTitle ?? 'Save' } 
                    onPress={save}
                    disabled={
                        name == ''
                        || bio == ''
                        || !sex
                        || !(interestedInMales || interestedInFemales || interestedInOther)
                    }
                />
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
