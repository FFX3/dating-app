import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { TextInput, Button, HelperText } from 'react-native-paper'
import { useAuth } from '../../auth/authContext'


export default function ForgotPasswordForm(){
    const { forgotPassword, authError } = useAuth()
    const [email, setEmail] = useState('')

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
                onChangeText={text=>setEmail(text)} />
            <Button onPress={()=>{forgotPassword(email)}}>
                Reset Password
            </Button>
        </KeyboardAvoidingView>
    )
}
