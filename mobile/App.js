import { NavigationContainer } from '@react-navigation/native';
import { ProfileContextProvider } from './src/profile/contexts/profile';
import Main from './src/main';
import { AvailabilityContextProvider } from './src/availabilities/contexts/AvailabilityContext';
import { MatcherContextProvider } from './src/matcher/contexts/matcher';
import { MessagerContextProvider } from './src/messager/contexts/messager';

export default function App() {
    return (
        <Main/>
    );
}
