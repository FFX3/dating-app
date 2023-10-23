import { AvailabilityContextProvider } from './availabilities/contexts/AvailabilityContext';
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
                       <RootNavigator />
                    </MatcherContextProvider>
                </AvailabilityContextProvider>
            </ProfileContextProvider>
        </MessagerContextProvider>
    );
}
