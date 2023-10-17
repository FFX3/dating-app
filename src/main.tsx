import AuthNavigator from '../src/login/navigation/AuthNavigator';
import { useProfile } from './profile/contexts/profile';
import RootNavigator from './root/navigation/RootNavigatior';

export default function Main() {
    const { profile } = useProfile()
    if(!profile)
        return <AuthNavigator/>

    return (
       <RootNavigator />
    );
}
