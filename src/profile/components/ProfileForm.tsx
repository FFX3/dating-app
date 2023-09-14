import React, { useState } from 'react'
import { View, TextInput, Text, Button } from 'react-native'
import ProfileImageGallery from '../components/ProfileImageGallery'

export default function ProfileForm({ navigation }){
    const [name, setName] = useState('Justin')
    const [bio, setBio] = useState('I built this app')

    function save(){
        // save name and bio
    }

    return (
        <View style={{
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <ProfileImageGallery />
            <Button title='edit gallery' onPress={()=>{navigation.navigate('Edit Gallery')}} />
            <TextInput value={name} onChange={setName}/>
            <TextInput value={bio} onChange={setBio}/>
            <Button title='save' onPress={save}/>
        </View>
    )
}
