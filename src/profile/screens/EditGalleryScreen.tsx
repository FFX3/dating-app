import React from 'react'
import { ScrollView, Button, Text, Image, View } from 'react-native';
import { useProfile } from '../contexts/profile';
import EditableProfileImageGallery from '../components/EditableProfileImageGallery';

export function EditGalleryScreen({ navigation }) {
    const { profile: { gallery } } = useProfile()
    const images = gallery.map((uri, id)=>{
        return { image: { uri }, id, }
    })
    function save(){
        navigation.goBack()
    }
        console.log(images)

    return (
        <View style={{ gap: 20, alignItems: 'center' }}>
            <EditableProfileImageGallery />
            <Button title='save' onPress={save} />
        </View>
    )
}
