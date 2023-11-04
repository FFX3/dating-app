import React from 'react'
import { View, Text, FlatList, Image, Dimensions, StyleSheet } from 'react-native'
import { useProfile } from '../contexts/profile'
import { Button, FAB, TouchableRipple } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker'

const pickImage = async () => {
    console.log('picking image')
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        allowsMultipleSelection: false,
        quality: 1,
        base64: true,
    });

    if (!result.canceled) {
        return (result.assets[0])
    }
}

export default function EditableProfileImageGallery(){
    const { gallery } = useProfile()

    const flatListData = [...gallery, { last: true }]
    return (
            <FlatList data={flatListData}
                renderItem={({ item, index }) => {
                    console.log(item)
                    if(item.last){
                        return <AddImageGalleryItem index={index} />
                    }
                    return <GalleryImageItem 
                        item={item}
                    />
                }}
                horizontal
                pagingEnabled
                snapToAlignment='center'
            />
    )
}

const { width, height } = Dimensions.get('screen')

function GalleryImageItem({ item }){
    const { replaceImage, deleteImage } = useProfile()

    return (
        <View style={styles.container}>
            <Image 
                source={{ uri: item.uri }}
                style={styles.image}
                resizeMode='contain'
            />
            <View style={{
                position: 'absolute',
                gap: 20,
                flexDirection: 'row',
                right: 20,
                bottom: 20,
            }}>
                <FAB icon='pencil' onPress={ async ()=>{ replaceImage(item.index, await pickImage())} } />
                <FAB icon='delete' onPress={ ()=>{
                    deleteImage(item.index)
                } } />
            </View>
        </View>
    )
}

function AddImageGalleryItem(){
    const { addImage } = useProfile()


    return (
        <TouchableRipple onPress={ async ()=>{ addImage(await pickImage())} }>
            <View style={styles.container}>
                <FAB icon='plus' style={{ opacity: 0.2 }} size='large' />
            </View>
        </TouchableRipple>
    )
}

const styles = StyleSheet.create({
    container: {
        width,
        height: height * 0.6,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        padding: 0,
    },

    image: {
        flex: 1,
        width: '100%',
    },

})
