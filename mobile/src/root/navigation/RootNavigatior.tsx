import { NavigationContainer } from "@react-navigation/native";
import AuthenticationNavigator from "./AuthenticationScreen";
import MainNavigator from "./MainScreens";
import { useAuth } from "../../auth/authContext";
import { PortalProvider } from "@gorhom/portal";

export default function Main() {
    const { user } = useAuth()

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
