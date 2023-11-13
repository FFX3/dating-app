import React from 'react'
import { Text } from 'react-native';
import ProfileForm from '../components/ProfileForm'
import ProfileImageGallery from '../components/ProfileImageGallery';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from 'react-native';
import { useProfile } from '../contexts/profile';

export function EditProfileScreen({ navigation }) {
    const { profile, logout } = useProfile()
    return (
        <KeyboardAwareScrollView
            extraScrollHeight={20}
        >
            <ProfileImageGallery />
            <Button title='edit gallery' onPress={()=>{navigation.navigate('Edit Gallery')}} />
            <Button title='preview' onPress={()=>{
                navigation.navigate('Account', {
                    screen: 'Preview',
                    params: { profile }
                })
            }} />
            <ProfileForm navigation={navigation} />
            <Button title='logout' onPress={logout} />
        </KeyboardAwareScrollView>
    )
}
