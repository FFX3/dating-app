import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { TextInput, Button } from 'react-native-paper'


export default function ForgotPasswordForm(){
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
            <TextInput label='email' value={email}
                onChangeText={text=>setEmail(text)} />
            <Button onPress={()=>{console.log('reset password')}}>
                Reset Password
            </Button>
        </KeyboardAvoidingView>
    )
}
