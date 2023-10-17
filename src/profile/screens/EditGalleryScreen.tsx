import React from 'react'
import { View } from 'react-native';
import { useProfile } from '../contexts/profile';
import EditableProfileImageGallery from '../components/EditableProfileImageGallery';

export function EditGalleryScreen({ navigation }) {
    const { profile: { gallery } } = useProfile()
    const images = gallery.map((uri, id)=>{
        return { image: { uri }, id, }
    })

    function exit(){
        navigation.goBack()
    }
        console.log(images)

    return (
        <View style={{ gap: 20, alignItems: 'center' }}>
            <EditableProfileImageGallery />
        </View>
    )
}
