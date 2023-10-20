import { FlatList, StyleSheet, View } from 'react-native'
import { useMessager } from '../contexts/messager'
import { Text } from 'react-native'

export function ContactsScreen() {
    const { selectContacts } = useMessager()
    return (
        <FlatList
            data={selectContacts()}
            renderItem={({ item })=><View style={styles.contact_row}>
                <Text>{ item.profile.name }</Text>
            </View>}
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
