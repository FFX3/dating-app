import { FlatList, View, Text, StyleSheet } from "react-native"
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
            renderItem={({ item } : { item: Message }) =>(
                <View style={styles.message_row}>
                    <View style={item.sender ? styles.sent_message_bubble : styles.received_message_bubble}>
                        <Text style={styles.message}>{item.contents}</Text>
                    </View>
                </View>
            )}
        />
    )
}

const styles = StyleSheet.create({
    message_row: {
        width: '100%',
        padding: 10,
        alignSelf: 'center',
    },

    sent_message_bubble: {
        alignSelf: 'flex-end',
        backgroundColor: 'green',
        padding: 7,
        borderRadius: 3,
    },

    received_message_bubble: {
        alignSelf: 'flex-start',
        backgroundColor: 'blue',
        padding: 7,
        borderRadius: 3,
    },

    message: {
        color: 'white',
        fontSize: 16,
    }
})
