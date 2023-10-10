import React from 'react'
import { ScrollView, Button, Text, Image, View } from 'react-native';
import { useProfile } from '../contexts/profile';

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
        <ScrollView>
            <View style={{ flex: 1, backgroundColor: 'black', alignItems: 'center' }}>
                <Button title='save' onPress={save} />
            </View>
        </ScrollView>
    )
}
