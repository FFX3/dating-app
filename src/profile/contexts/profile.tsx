import React, { useState } from "react";
import { createContext, useContext } from "react";
import fakeProfile from '../../../fake-data/user.json'

type Profile = {
    name: String;
    bio: String;
    sex: String;
    interested_in: String[];
    email: String;
    gallery: String[];
    onboarded: boolean;
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

    function register(email, password){
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

    function addImage(uri: string){
        console.log(uri)
       setProfile({
            ...profile,
            gallery: [
                ...profile.gallery,
                uri,
            ]
        }) 
    }

    function deleteImage(deleteIndex: number){
       setProfile({
            ...profile,
            gallery: profile.gallery.reduce((carry, uri, index)=>{
                if(index==deleteIndex) return carry
                carry.push(uri)
                return carry
            }, [])
        }) 
    }

    function replaceImage(replacementIndex: number, replacementUri: string){
       setProfile({
            ...profile,
            gallery: profile.gallery.reduce((carry, uri, index)=>{
                if(index==replacementIndex) {
                    carry.push(replacementUri)
                } else {
                    carry.push(uri)
                }
                return carry
            }, [])
        }) 
    }

    function markOnboarded(){
        setProfile({
            ...profile,
            onboarded: true,
        })
    }


    return <profileContext.Provider value={{
            profile,
            login,
            logout,
            saveProfile,
            addImage,
            deleteImage,
            replaceImage,
            markOnboarded,
            register,
        }}>
        { children }
    </profileContext.Provider> 
}
