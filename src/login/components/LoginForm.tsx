import React, { useState } from 'react'
import { useProfile } from '../../profile/contexts/profile'
import { View } from 'react-native'
import { TextInput, Button } from 'react-native-paper'


export default function LoginForm(){
    const { login } = useProfile()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    return (
        <View>
            <TextInput value={email} onChangeText={text=>setEmail(text)} />
            <TextInput value={password} onChangeText={text=>setPassword(text)} />
            <Button onPress={()=>login(email, password)}>
                Login
            </Button>
        </View>
    )
}
