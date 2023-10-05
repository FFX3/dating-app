import { NavigationContainer } from '@react-navigation/native';
import { ProfileContextProvider } from './src/profile/contexts/profile';
import Main from './src/main';

export default function App() {
    return (
        <ProfileContextProvider>
            <NavigationContainer>
                <Main/>
            </NavigationContainer>
        </ProfileContextProvider>
    );
}
