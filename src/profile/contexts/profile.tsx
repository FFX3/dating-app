import React, { useState } from "react";
import { createContext, useContext } from "react";
import fakeProfile from '../../../fake-data/user.json'

type Profile = {
    name: String;
    bio: String;
    email: String;
    gallery: String[];
}

const profileContext = createContext(null)

export function useProfile(){
   return  useContext(profileContext)
}

export function ProfileContextProvider({ children }){
    const [profile, setProfile] = useState<Profile|null>(null)

    function login(email, password){
        console.log(email, password)
        setProfile(fakeProfile)
    }

    function logout(){
        setProfile(null)
    }

    function saveProfile(newProfile: Profile){
        //api stuff
        //update app state
        setProfile({
            ...profile,
            ...newProfile,
        })
    }


    return <profileContext.Provider value={{
            profile,
            login,
            logout,
            saveProfile,
        }}>
        { children }
    </profileContext.Provider> 
}
