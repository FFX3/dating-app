import { PortalProvider } from '@gorhom/portal';
import { AuthContextProvider } from './auth/authContext';
import { AvailabilityContextProvider } from './availabilities/contexts/AvailabilityContext';
import { ExperienceContextProvider } from './interests/contexts/experience';
import { MatcherContextProvider } from './matcher/contexts/matcher';
import { MessagerContextProvider } from './messager/contexts/messager';
import { ProfileContextProvider } from './profile/contexts/profile';
import RootNavigator from './root/navigation/RootNavigatior';
import { Provider } from 'react-native-paper';

export default function Main() {
    return (
        <Provider>
            <PortalProvider>
                <AuthContextProvider>
                    <MessagerContextProvider>
                        <ProfileContextProvider>
                            <AvailabilityContextProvider>
                                <MatcherContextProvider>
                                    <ExperienceContextProvider>
                                        <RootNavigator />
                                    </ExperienceContextProvider>
                                </MatcherContextProvider>
                            </AvailabilityContextProvider>
                        </ProfileContextProvider>
                    </MessagerContextProvider>
                </AuthContextProvider>
            </PortalProvider>
        </Provider>
    );
}
