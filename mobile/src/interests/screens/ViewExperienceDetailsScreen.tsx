import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View, Dimensions, Pressable } from "react-native";

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

export function ViewExperienceDetailsScreen({ route }) {
    const { experience } = route.params

    const [index, setIndex] = useState(0)
    
    return (
        <View
            style={{
                width: SCREEN_WIDTH,
                height: SCREEN_HEIGHT,
            }}
        >
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                }}
            >
            <Pressable
                onPress={()=>{
                    setIndex(Math.max(index-1, 0))
                }}
                style={{
                    zIndex: 2000,
                    flex: 1,
                }}
            >
            </Pressable>
            <Pressable
                onPress={()=>{
                    setIndex(Math.min(index+1, experience.gallery.length-1))
                }}
                style={{
                    flex: 1,
                    zIndex: 2000,
                }}
            >
            </Pressable>
            <Gallery
                index={index}
                gallery={experience.gallery}
            />
            </View>
            <ScrollView style={styles.profile_container}>
                <Text
                    style={styles.profile_name}
                >{ experience.name }</Text>
                <Text
                    style={styles.profile_bio}
                >{ experience.description }</Text>
            </ScrollView>
        </View>
    )
}

function Gallery({ gallery, index }: { gallery: String[], index: number }) {
    return (<>
        {gallery.map((uri, _index)=>(
            <Image
                key={_index}
                source={{ uri: gallery[_index] }}
                style={[
                    styles.image,
                    {
                        display: index == _index ? null : "none",
                    }
                ]}
                resizeMode='cover'
            />
        ))}
    </>)
}

const styles = StyleSheet.create({
    profile_name: {
        fontSize: 42,
        paddingBottom: 10,
    },

    profile_bio: {
        fontSize: 20,
    },

    profile_container: {
        flex: 1,
        padding: 20,
        borderRadius: 20,
    },

    image: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: 1000,
    },

})
