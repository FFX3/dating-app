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
    });

    if (!result.canceled) {
        console.log(result.assets[0].uri);
        return (result.assets[0].uri)
    }
}

export default function EditableProfileImageGallery(){
    const { profile: { gallery }, deleteImage, replaceImage } = useProfile()

    const flatListData = [...gallery, { last: true }]
    return (
            <FlatList data={flatListData}
                renderItem={({ item, index }) => {
                    if(item.last){
                        return <AddImageGalleryItem index={index} />
                    }
                    return <GalleryImageItem 
                        item={{
                            uri: item
                        }}

                        onDelete={()=>{
                            deleteImage(index)
                        }}

                        onReplace={(uri: string)=>{
                            replaceImage(index, uri)
                        }}
                    />
                }}
                horizontal
                pagingEnabled
                snapToAlignment='center'
            />
    )
}

const { width, height } = Dimensions.get('screen')

function GalleryImageItem({ item, onDelete, onReplace }){
    const { replaceImage } = useProfile()

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
                <FAB icon='pencil' onPress={ async ()=>{ onReplace(await pickImage())} } />
                <FAB icon='delete' onPress={ onDelete } />
            </View>
        </View>
    )
}

function AddImageGalleryItem({ index }){
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
