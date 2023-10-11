import React from 'react'
import { View, Text, FlatList, Image, Dimensions, StyleSheet } from 'react-native'
import { useProfile } from '../contexts/profile'

export default function ProfileImageGallery(){
    const { profile: { gallery } } = useProfile()
    
    return (
            <FlatList data={gallery}
                renderItem={({ item, index }) => {
                    return <GalleryImageItem item={{
                        uri: item
                    }} />
                }}
                horizontal
                pagingEnabled
                snapToAlignment='center'
            />
    )
}

const { width, height } = Dimensions.get('screen')

function GalleryImageItem({ item }){
    return (
        <View style={styles.container}>
            <Image 
                source={{ uri: item.uri }}
                style={styles.image}
                resizeMode='contain'
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width,
        height: height * 0.6,
        alignItems: 'center',
        backgroundColor: 'black',
    },

    image: {
        flex: 1,
        width: '100%',
    },

})
