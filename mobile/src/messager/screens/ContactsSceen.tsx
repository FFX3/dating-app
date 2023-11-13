import { FlatList, StyleSheet, View } from 'react-native'
import { useMessager, Contact } from '../contexts/messager'
import { Text } from 'react-native'
import { Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'

export function ContactsScreen() {
    const { selectContacts } = useMessager()
    const navigation = useNavigation()
    const contacts = selectContacts()

    return (
        <FlatList
            data={contacts}
            renderItem={({ item }: { item: Contact })=><Pressable 
                style={styles.contact_row}
                onPress={()=>{
                    navigation.navigate('Messager', {
                        screen: 'Thread',
                        params: { profile: item.profile }
                    })
                }}
            >
                <Text>{ item.profile.name }</Text>
            </Pressable>}
            ItemSeparatorComponent={()=><View style={{
                height: 2,
                backgroundColor: 'grey',
                opacity: 0.5,
            }}></View>}
            
        />
    )
}

const styles = StyleSheet.create({
    contact_row: {
        alignItems: 'center',
        padding: 20,
    }
})
