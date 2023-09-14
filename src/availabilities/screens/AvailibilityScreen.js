import { ScrollView, Button } from 'react-native';
import { WeeklyAvailibilities } from '../components/WeeklyAvailabilities';
import { SaveButton } from '../components/SaveButton';

export function AvailabilityScreen({ navigation }) {
    return (
        <ScrollView>
            <WeeklyAvailibilities />
            <SaveButton />
            <Button title='Exceptions' onPress={ ()=>navigation.navigate("Exceptions") }/>
        </ScrollView>
    )
}
