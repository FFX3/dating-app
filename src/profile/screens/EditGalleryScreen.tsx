import React from 'react'
import { ScrollView, Button, Text, Image, View } from 'react-native';
import { useProfile } from '../contexts/profile';
import Carousel, { Pagination } from 'react-native-snap-carousel'

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
                <Carousel
                    layout='default'
                    data={images}
                    sliderWidth={300}
                    itemWidth={300}
                    renderItem={({ item, index }) => (
                        <Image
                            key={index}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode='contain'
                            src={item.image.uri}
                        />
                    )}
                />
                <Button title='save' onPress={save} />
            </View>
        </ScrollView>
    )
}
