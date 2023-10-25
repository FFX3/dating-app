import { AvailabilityContextProvider } from './availabilities/contexts/AvailabilityContext';
import { ExperienceContextProvider } from './interests/contexts/experience';
import { MatcherContextProvider } from './matcher/contexts/matcher';
import { MessagerContextProvider } from './messager/contexts/messager';
import { ProfileContextProvider, useProfile } from './profile/contexts/profile';
import RootNavigator from './root/navigation/RootNavigatior';

export default function Main() {
    return (
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
    );
}
