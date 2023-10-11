import React from 'react'
import { ScrollView } from 'react-native';
import ProfileForm from '../components/ProfileForm'
import ProfileImageGallery from '../components/ProfileImageGallery';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export function EditProfileScreen({ navigation }) {
    return (
        <KeyboardAwareScrollView
            extraScrollHeight={20}
        >
            <ProfileImageGallery />
            <ProfileForm navigation={navigation} />
        </KeyboardAwareScrollView>
    )
}
