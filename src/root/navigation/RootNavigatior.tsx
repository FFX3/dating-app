import { NavigationContainer } from "@react-navigation/native";
import { useProfile } from "../../profile/contexts/profile";
import AuthenticationNavigator from "./AuthenticationScreen";
import MainNavigator from "./MainScreens";

export default function Main() {
    const { profile } = useProfile()

    return (
        <NavigationContainer>
            { !!profile ? 
               <MainNavigator />
            : 
                <AuthenticationNavigator/>
            }
        </NavigationContainer>
    );
}
