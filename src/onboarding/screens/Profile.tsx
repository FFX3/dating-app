import { Button } from "react-native";
import ProfileForm from "../../profile/components/ProfileForm";

export function Profile({ navigation }) {
    
    function SubmitAction() {
        return <Button title="Next" onPress={()=>navigation.navigate('Availabilities')} />
    }

    return <ProfileForm submitAction={SubmitAction} />
}
