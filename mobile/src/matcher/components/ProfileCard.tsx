import React, { useState } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { PublicProfile } from '../contexts/matcher'

export default function ProfileCard(
    { profile }: 
    { profile: PublicProfile } 
){
    return (
        <View style={styles.container}>
            <Gallery
                gallery={profile.gallery}
            />
        </View>
    )
}

function Gallery({ gallery }){
    const [index, setIndex] = useState(0)
    
    return (
        <View style={styles.container}>
            <Image
                source={{ uri: gallery[index] }}
                style={styles.image}
                resizeMode='cover'
            />
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        alignItems: 'center',
        backgroundColor: 'green',
        borderRadius: 20,
    },

    image: {
        width: 50,
        flex: 1,
    },

})
