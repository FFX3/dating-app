import React from 'react'
import { ScrollView } from 'react-native';
import ProfileForm from '../components/ProfileForm'

export function EditProfileScreen({ navigation }) {
    return (
        <ScrollView>
            <ProfileForm navigation={navigation} />
        </ScrollView>
    )
}
