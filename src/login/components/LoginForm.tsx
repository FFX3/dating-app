import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { TextInput, Button, HelperText } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../../auth/authContext'


export default function LoginForm(){
    const { login, authError } = useAuth()
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
            <HelperText type='error' visible={!!authError}>
                { authError }
            </HelperText>
            <TextInput label='email' value={email}
                error={!!authError}
                autoCapitalize='none'
                onChangeText={text=>setEmail(text)} />
            <TextInput label='password' value={password}
                error={!!authError}
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
