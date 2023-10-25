import React, { useState } from "react";
import { createContext, useContext } from "react";
import fakeProfile from '../../../fake-data/user.json'
import { supabase } from '../../utils/supabase'

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

    async function login(email, password){
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        setProfile(fakeProfile)
    }

    async function register(email, password){
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        setProfile(fakeProfile)
    }

    function logout(){
        supabase.auth.signOut()
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
