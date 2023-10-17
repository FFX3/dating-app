import { NavigationContainer } from '@react-navigation/native';
import { ProfileContextProvider } from './src/profile/contexts/profile';
import Main from './src/main';
import { AvailabilityContextProvider } from './src/availabilities/contexts/AvailabilityContext';
import { MatcherContextProvider } from './src/matcher/contexts/matcher';

export default function App() {
    console.log('context re-render')
    return (
        <ProfileContextProvider>
            <AvailabilityContextProvider>
                <MatcherContextProvider>
                    <NavigationContainer>
                        <Main/>
                    </NavigationContainer>
                </MatcherContextProvider>
            </AvailabilityContextProvider>
        </ProfileContextProvider>
    );
}
