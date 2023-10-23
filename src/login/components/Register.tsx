import React, { useState } from 'react'
import { useProfile } from '../../profile/contexts/profile'
import { KeyboardAvoidingView, Platform, View } from 'react-native'
import { TextInput, Button } from 'react-native-paper'


export default function RegisterForm(){
    const { register } = useProfile()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{
                padding: 20,
                justifyContent: 'center',
                height: '100%',
                gap: 20
            }}
        >
            <TextInput label='email' value={email}
                onChangeText={text=>setEmail(text)} />
            <TextInput label='password' value={password}
                secureTextEntry
                onChangeText={text=>setPassword(text)} />
            <Button onPress={()=>{register(email, password)}}>
                Register
            </Button>
        </KeyboardAvoidingView>
    )
}
