import React, { useState } from 'react'
import { useProfile } from '../../profile/contexts/profile'
import { KeyboardAvoidingView, Platform, View } from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'


export default function LoginForm(){
    const { login } = useProfile()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation()

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
            <Button onPress={()=>login(email, password)}>
                Login
            </Button>
            <Button onPress={()=>{navigation.navigate('Forgot Password')}}>
                Forgot Password
            </Button>
            <Button onPress={()=>{navigation.navigate('Register')}}>
                Register
            </Button>
        </KeyboardAvoidingView>
    )
}
