import React from 'react'
import ProfileForm from '../components/ProfileForm'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from 'react-native';

export function OnboardingScreen({ navigation }) {
    return (
        <KeyboardAwareScrollView
            extraScrollHeight={20}
        >
            <ProfileForm navigation={navigation}
            onSave={()=>{
                navigation.navigate('Create Your Gallery')
            }} />
        </KeyboardAwareScrollView>
    )
}
