import { NavigationContainer } from '@react-navigation/native';
//import AvailabilityNavigator from './src/availabilities/navigation/AvailabilityNavigator'
import ProfileNavigator from './src/profile/navigation/ProfileNavigator';

export default function App() {
    return (
        <NavigationContainer>
            <ProfileNavigator />
        </NavigationContainer>
    );
}
