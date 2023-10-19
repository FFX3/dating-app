import React, { useEffect, useRef, useState } from 'react'
import { PublicProfile } from '../contexts/matcher'
import { useMatcher } from '../contexts/matcher'
import { StyleSheet, Text, View, Dimensions, Image, Animated, PanResponder,
PanResponderInstance, 
TouchableOpacity,
Pressable} from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width



export function MatcherScreen(){
    const { getQueue, like, pass } = useMatcher()

    const positionRef = useRef(new Animated.ValueXY())
    const position = positionRef.current

    const rotate = position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: ['-10deg', '0deg', '10deg'],
        extrapolate: 'clamp',
    })

    const likeOpacity = position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: [0, 0, 1],
        extrapolate: 'clamp',
    })

    const nopeOpacity = position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: [1, 0, 0],
        extrapolate: 'clamp',
    })

    const nextCardOpacity = position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: [1, 0, 1],
        extrapolate: 'clamp',
    })

    const nextCardScale = position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: [1, 0.8, 1],
        extrapolate: 'clamp',
    })

    const panResponder = useRef(
        PanResponder.create({

            onMoveShouldSetPanResponderCapture: (evt, gestureState) => (
            (gestureState.dx - Math.abs(30)) < 0),

            onPanResponderMove: (evt, guestureState) => {
                position.setValue({ 
                    x: guestureState.dx,
                    y: guestureState.dy,
                })
            },

            onPanResponderRelease: (evt, guestureState) => {
                if(guestureState.dx > 120) {
                    Animated.spring(position, {
                        toValue: { x: SCREEN_WIDTH + 100, y: guestureState.dy },
                        useNativeDriver: true,
                    }).start(()=>{
                        like()
                        position.setValue({ x: 0, y: 0, })
                    })
                } else if(guestureState.dx < -120) {
                    Animated.spring(position, {
                        toValue: { x: -SCREEN_WIDTH - 100, y: guestureState.dy },
                        useNativeDriver: true,
                    }).start(()=>{
                        pass()
                        position.setValue({ x: 0, y: 0, })
                    })
                } else {
                    Animated.spring(position, {
                        toValue: { x: 0, y: 0 },
                        friction: 4,
                        useNativeDriver: true,
                    }).start()
                }
            },
    })).current

    return <View style={{ flex: 1 }}>
        <View style={{ height: 60 }}>
        </View>
        <View style={{ flex: 1 }}>
            { getQueue().map((profile, index)=>{
                return <SwipableCard
                    opacity={nextCardOpacity}
                    scale={nextCardScale}
                    key={profile.id}
                    swipable={index==0} 
                    profile={profile}
                    position={position}
                    rotate={rotate}
                    panResponder={panResponder}
                    likeOpacity={likeOpacity}
                    nopeOpacity={nopeOpacity}
                />
            }
            ).reverse() }
        </View>
        <View style={{ height: 60 }}>
        </View>
    </View>
}

export default function SwipableCard(
    { 
        profile,
        swipable=false,
        panResponder, 
        nopeOpacity,
        likeOpacity,
        position,
        rotate,
        opacity,
        scale,
    }: 
    { 
        profile: PublicProfile, 
        swipable: boolean, 
        panResponder: PanResponderInstance 
        nopeOpacity,
        likeOpacity,
        position,
        rotate,
        opacity,
        scale,
    } 
){
    return (
            <Animated.View
                { ...panResponder.panHandlers}
                style={[
                    swipable ? [{
                        transform: [
                            { rotate },
                            ...position.getTranslateTransform()
                        ]
                    }] : [{
                        opacity,
                        transform: [{ scale }],
                    }],
                    {
                        height: SCREEN_HEIGHT - 120,
                        width: SCREEN_WIDTH,
                        padding: 10,
                        position: 'absolute',
                    }
                ]}
            >
                <Animated.View
                style={{
                    opacity: swipable ? likeOpacity : 0,
                    transform: [{ rotate: "-30deg" }],
                    position: "absolute",
                    top: 50,
                    left: 40,
                    zIndex: 1000
                }}
                >
                    <Text
                        style={{
                            borderWidth: 1,
                            borderColor: "green",
                            color: "green",
                            fontSize: 32,
                            fontWeight: "800",
                            padding: 10
                        }}
                    >
                    LIKE
                    </Text>
                </Animated.View>
                <Animated.View
                style={{
                    opacity: swipable ? nopeOpacity : 0,
                    transform: [{ rotate: "30deg" }],
                    position: "absolute",
                    top: 50,
                    right: 40,
                    zIndex: 1000
                }}
                >
                    <Text
                    style={{
                        borderWidth: 1,
                        borderColor: "red",
                        color: "red",
                        fontSize: 32,
                        fontWeight: "800",
                        padding: 10
                    }}
                    >
                    NOPE
                    </Text>
                </Animated.View>
                <ProfileCard
                    profile={profile}
                />
            </Animated.View>
    )
}

function ProfileCard({ profile } : { profile: PublicProfile }){
    const [index, setIndex] = useState(0)

    const { gallery } = profile

    console.log(gallery.length)
    
    return (
        <View
        style={{
            flex: 1,
            borderRadius: 20,
        }}>
            <View
            style={{
                width: '100%',
                height: '100%',
                zIndex: 2000,
            }}>
                <View
                style={{
                    flex: 3,
                    flexDirection: 'row',
                }}>
                    <Pressable
                        onPress={()=>{
                            console.log('left', index)
                            setIndex(Math.max(index-1, 0))
                        }}
                        style={{
                            flex: 1,
                        }}
                    >
                    </Pressable>
                    <Pressable
                        onPress={()=>{
                            console.log('right', index)
                            setIndex(Math.min(index+1, gallery.length-1))
                        }}
                        style={{
                            flex: 1,
                        }}
                    >
                    </Pressable>
                </View>
                <Pressable
                    onPress={()=>console.log('expand')}
                    style={{
                        flex: 1,
                    }}
                >
                </Pressable>
            </View>
        <Gallery
            gallery={profile.gallery}
            index={index}
        />
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

    image: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        position: 'absolute',
        zIndex: 1000,
    },

})
