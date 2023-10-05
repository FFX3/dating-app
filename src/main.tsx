import AvailabilityNavigator from '../src/availabilities/navigation/AvailabilityNavigator'
import AuthNavigator from '../src/login/navigation/AuthNavigator';
import ProfileNavigator from '../src/profile/navigation/ProfileNavigator';
import { useProfile } from './profile/contexts/profile';

export default function Main() {
    const { profile } = useProfile()
    if(!profile)
        return <AuthNavigator/>

    return (
       <ProfileNavigator />
    );
}
