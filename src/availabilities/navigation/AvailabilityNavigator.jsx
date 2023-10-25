import { ExceptionsScreen } from '../screens/ExceptionsScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AvailabilitiesScreen } from '../screens/AvailibilitiesScreen';

const Stack = createNativeStackNavigator()

export default function AvailabilityNavigator({ header=true }){
    return (
        <Stack.Navigator initialRouteName='Availability' screenOptions={{
            headerShown: header
        }}>
            <Stack.Screen name="Availability" component={AvailabilitiesScreen}/>
            <Stack.Screen name="Exceptions" component={ExceptionsScreen} options={{
                presentation: 'modal',
                headerShown: 'true',
            }}/>
        </Stack.Navigator>
    )
}
