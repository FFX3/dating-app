import { createContext, useContext } from "react-native";

const userContext = createContext(false)

export const useUser = useContext(userContext)

export const userContextProvider = ({ children }) => {
    const value = {
        name: 'Justin McIntyre'
    }

    return <userContext.Provider value={value}>{ children }</userContext.Provider>
}
