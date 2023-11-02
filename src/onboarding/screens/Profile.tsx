import { Button } from "react-native";
import ProfileForm from "../../profile/components/ProfileForm";

export function Profile({ navigation }) {
    
    function SubmitAction() {
        navigation.navigate('Availabilities')
    }

    return <ProfileForm submitAction={SubmitAction} submitActionTitle='Next' />
}
