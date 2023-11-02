import { NavigationContainer } from "@react-navigation/native";
import { useProfile } from "../../profile/contexts/profile";
import AuthenticationNavigator from "./AuthenticationScreen";
import MainNavigator from "./MainScreens";
import { useAuth } from "../../auth/authContext";

export default function Main() {
    const { user } = useAuth()

    console.log(user)

    return (
        <NavigationContainer>
            { !!user ? 
               <MainNavigator />
            : 
                <AuthenticationNavigator/>
            }
        </NavigationContainer>
    );
}
