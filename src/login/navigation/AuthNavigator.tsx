import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginForm from '../components/LoginForm'

const Stack = createNativeStackNavigator()

export default function AuthNavigator(){
    return (
        <Stack.Navigator initialRouteName='Login'>
            <Stack.Screen name="Login" component={LoginForm}/>
        </Stack.Navigator>
    )
}
