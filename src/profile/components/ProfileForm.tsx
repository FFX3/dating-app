import React, { useState } from 'react'
import { View, Button } from 'react-native'
import ProfileImageGallery from '../components/ProfileImageGallery'
import { TextInput } from 'react-native-paper'
import { useProfile } from '../contexts/profile'

export default function ProfileForm({ navigation }){
    const { profile, saveProfile } = useProfile()
    const [name, setName] = useState(profile?.name)
    const [bio, setBio] = useState(profile?.bio)

    function save(){
        saveProfile({
            name,
            bio
        })
    }

    return (
        <View style={{
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <ProfileImageGallery />
            <Button title='edit gallery' onPress={()=>{navigation.navigate('Edit Gallery')}} />
            <TextInput value={name} onChange={(text)=>setName(text)} />
            <TextInput  value={bio} onChange={(text)=>setBio(text)} />
            <Button title='save' onPress={save}/>
        </View>
    )
}
