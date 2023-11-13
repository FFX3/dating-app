import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, View } from 'react-native'
import { TextInput, Button, HelperText } from 'react-native-paper'
import { useAuth } from '../../auth/authContext'


export default function RegisterForm(){
    const { register, authError } = useAuth()
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
            <HelperText type='error' visible={!!authError}>
                { authError }
            </HelperText>
            <TextInput label='Email' value={email}
                error={!!authError}
                autoCapitalize='none'
                onChangeText={text=>setEmail(text)} />
            <TextInput label='Password' value={password}
                error={!!authError}
                secureTextEntry
                onChangeText={text=>setPassword(text)} />
            <Button 
                onPress={()=>{
                    register(email, password)
                }}
                disabled={ email === '' || password === ''}
            >
                Register
            </Button>
        </KeyboardAvoidingView>
    )
}
