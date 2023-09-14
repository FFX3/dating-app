import React from 'react'
import { ScrollView, Button, Text } from 'react-native';

export function EditGalleryScreen({ navigation }) {
    function save(){
        navigation.goBack()
    }

    return (
        <ScrollView>
            <Text>edit gallery</Text>
            <Button title='save' onPress={save} />
        </ScrollView>
    )
}
