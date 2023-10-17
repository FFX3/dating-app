import { AvailabilityScreen } from '../screens/AvailibilityScreen';
import { ExceptionsScreen } from '../screens/ExceptionsScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AvailabilityContextProvider } from '../contexts/AvailabilityContext';

const Stack = createNativeStackNavigator()

export default function AvailabilityNavigator(){
    return (
        <Stack.Navigator initialRouteName='Availability'>
            <Stack.Screen name="Availability" component={AvailabilityScreen}/>
            <Stack.Screen name="Exceptions" component={ExceptionsScreen}/>
        </Stack.Navigator>
    )
}
