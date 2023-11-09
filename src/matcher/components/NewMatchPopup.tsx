import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Image, SafeAreaView, Text, View } from "react-native";
import { PublicProfile } from "../contexts/matcher";

const SCREEN_HEIGHT = Dimensions.get('window').height - 50
const SCREEN_WIDTH = Dimensions.get('window').width

export function NewMatchPopup({ close, profile }: 
    { close: ()=>void, profile: PublicProfile}
){
    const duration = 6000
    const animatedOpacity = useRef(new Animated.Value(0)).current

    const [fadeTimeout, setFadeTimeout] = useState<ReturnType<typeof setTimeout>>()
    

    function startFadeOut(){
        animatedOpacity.setValue(1)
        Animated.timing(animatedOpacity, {
            toValue: 0,
            delay: duration/2,
            duration: duration/2,
            useNativeDriver: true,
        }).start();

        setFadeTimeout(setTimeout(close, duration))
    }

    useEffect(()=>{
        return ()=>{ clearTimeout(fadeTimeout) }
    },[])

    return( 
        <SafeAreaView>
            <Animated.View style={{
                height: SCREEN_HEIGHT,
                width: SCREEN_WIDTH,
                opacity: animatedOpacity,
            }}>
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    width: '100%',
                    position: 'absolute',
                    zIndex: 2
                }}>
                    <View style={{
                        backgroundColor: 'pink',
                        width: Math.max(SCREEN_WIDTH, SCREEN_HEIGHT),
                        transform: [
                            {translateY: SCREEN_HEIGHT/4},
                            {rotate: '-20deg'},
                        ],
                        alignItems: 'center',
                        justifyContent: 'center',
                        shadowOffset: { width: -10, height: -10 }
                    }}>
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: SCREEN_WIDTH,
                            padding: 50,
                        }}>
                            <Text style={{
                                fontSize: 34,
                                color: 'white',
                            }}>{ profile.name } just matched with you!</Text>
                        </View>
                    </View>
                </View>
                {profile.gallery[0] && <View style={{
                    height: '100%',
                    width: '100%',
                    position: 'absolute',
                    zIndex: 1
                }}>
                    <Image
                        onLoad={startFadeOut}
                        source={{ uri: profile.gallery[0] }}
                        style={{ flex: 1 }}
                        resizeMode='cover'
                    />
                </View>}
            </Animated.View>
        </SafeAreaView>
    )
}
