import { FlatList, View, Text, StyleSheet, KeyboardAvoidingView, Platform } from "react-native"
import { useMessager, Message } from "../contexts/messager"
import { useEffect, useState } from "react"
import { Button, TextInput } from "react-native-paper"

export function ThreadScreen({ route }) {
    const { profile } = route.params
    const { selectMessages, fetchMessages, sendMessage } = useMessager()

    const [messageDraft, setMessageDraft] = useState('')
    

    const messages = selectMessages(profile.id)

    useEffect(()=>{ fetchMessages(profile.id) },[])

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={90}
            style={{
                display: 'flex',
                height: '100%',
            }}
        >
            <FlatList
                data={[...messages].reverse()}
                renderItem={({ item } : { item: Message }) =>(
                    <View style={styles.message_row}>
                        <View style={item.sender ? styles.sent_message_bubble : styles.received_message_bubble}>
                            <Text style={styles.message}>{item.contents}</Text>
                        </View>
                    </View>
                )}
                onEndReached={()=>console.log('load more messages')}
                onEndReachedThreshold={2}
                inverted
            />
            <View style={styles.message_draft_row} >
                <TextInput 
                    onChangeText={(msg)=>{ setMessageDraft(msg) }}
                    multiline
                    value={messageDraft}
                    style={styles.text_input}
                />
                <Button 
                    disabled={messageDraft === ''}
                    onPress={()=>{
                        sendMessage(profile.id, messageDraft)
                        setMessageDraft('')
                    }}
                    style={styles.send_button}
                >
                    <Text>send</Text>
                </Button>
            </View>
        </KeyboardAvoidingView>
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
    },

    message_draft_row: {
        flexDirection: 'row',
    },

    send_button: {
        flex: 2
    },

    text_input: {
        flex: 10,
    }
})
