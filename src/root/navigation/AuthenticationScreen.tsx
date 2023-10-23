import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginForm from '../../login/components/LoginForm';
import ForgotPasswordForm from '../../login/components/ForgotPassword';
import RegisterForm from '../../login/components/Register';

const Stack = createNativeStackNavigator()

export default function AuthenticationNavigator(){
    return (
        <Stack.Navigator initialRouteName='Login'>
            <Stack.Screen name="Login" component={LoginForm}/>
            <Stack.Screen name="Forgot Password" component={ForgotPasswordForm}/>
            <Stack.Screen name="Register" component={RegisterForm}/>
        </Stack.Navigator>
    )
}
