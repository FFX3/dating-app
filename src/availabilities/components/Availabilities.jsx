import { View, ScrollView, Button } from 'react-native';
import { WeeklyAvailibilities } from '../components/WeeklyAvailabilities';
import { SaveButton } from '../components/SaveButton';

export function AvailabilitiesScreen({ navigation }) {
    return (
        <ScrollView>
            <WeeklyAvailibilities />
            <SaveButton />
            <Button title='Exceptions' onPress={ ()=>navigation.navigate("Exceptions") }/>
        </ScrollView>
    )
}
