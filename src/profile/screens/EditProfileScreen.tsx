import React from 'react'
import { ScrollView } from 'react-native';
import ProfileForm from '../components/ProfileForm'
import ProfileImageGallery from '../components/ProfileImageGallery';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from 'react-native';

export function EditProfileScreen({ navigation }) {
    return (
        <KeyboardAwareScrollView
            extraScrollHeight={20}
        >
            <ProfileImageGallery />
            <Button title='edit gallery' onPress={()=>{navigation.navigate('Edit Gallery')}} />
            <ProfileForm navigation={navigation} />
        </KeyboardAwareScrollView>
    )
}
