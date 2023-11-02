import { AuthContextProvider } from './auth/authContext';
import { AvailabilityContextProvider } from './availabilities/contexts/AvailabilityContext';
import { ExperienceContextProvider } from './interests/contexts/experience';
import { MatcherContextProvider } from './matcher/contexts/matcher';
import { MessagerContextProvider } from './messager/contexts/messager';
import { ProfileContextProvider } from './profile/contexts/profile';
import RootNavigator from './root/navigation/RootNavigatior';

export default function Main() {
    return (
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
    );
}
