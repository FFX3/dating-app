import React, { useState } from 'react'
import { View, Button } from 'react-native'
import ProfileImageGallery from '../components/ProfileImageGallery'
import { TextField } from '@mui/material'

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
            <TextField variant='outlined' required value={name} onChange={(e)=>setName(e.target.value)} />
            <TextField variant='outlined' required value={bio} onChange={(e)=>setBio(e.target.value)} />
            <Button title='save' onPress={save}/>
        </View>
    )
}
