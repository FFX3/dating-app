import React from 'react'
import { View } from 'react-native';
import { useProfile } from '../contexts/profile';
import EditableProfileImageGallery from '../components/EditableProfileImageGallery';

export function EditGalleryScreen({ navigation }) {
    return (
        <View style={{ gap: 20, alignItems: 'center' }}>
            <EditableProfileImageGallery />
        </View>
    )
}
