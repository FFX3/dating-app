import { FlatList, View, Text } from "react-native"
import { useMessager, Message } from "../contexts/messager"
import { useEffect } from "react"

export function ThreadScreen({ route }) {
    const { profile } = route.params
    const { selectMessages, fetchMessages } = useMessager()

    const messages = selectMessages(profile.id)

    useEffect(()=>{ fetchMessages(profile.id) },[])

    console.log(messages, profile.id)

    return (
        <FlatList
            data={messages}
            renderItem={({ item } : { item: Message }) => item.sender ?
                <View>
                    <Text>{item.contents}</Text>
                </View>
                : 
                <View>
                    <Text>{item.contents}</Text>
                </View>
            }
        />
    )
}
