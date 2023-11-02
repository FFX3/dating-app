import React, { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import fakeProfile from '../../../fake-data/user.json'
import { supabase } from '../../utils/supabase'
import { useLocalTestData } from '../../config'
import { Database } from '../../../database.types'
import { useAuth } from "../../auth/authContext";

type Gallery = String[];

export type Profile = Database['public']['Tables']['profiles']['Row']

const profileContext = createContext(null)

export function useProfile(){
   return  useContext(profileContext)
}

export function ProfileContextProvider({ children }){
    const { user } = useAuth()

    const [profile, setProfile] = useState<Profile>()
    const [gallery, setGallery] = useState<Gallery>()

    useEffect(()=>{
        if(user){
            console.log(
                '%%%%%%%%%%%%%%%%%%%%',
                'fetching profile',
                '%%%%%%%%%%%%%%%%%%%%',
            )
            fetchProfile()
            fetchGallery()
        } else {
            setProfile(undefined)
            setGallery(undefined)
        }
    }, [user?.id])
    
    async function fetchProfile(){
        const { data, error } = await supabase
            .from('profiles')
            .select()
            .eq('user_id', user.id)
            .limit(1)
            .single()
        console.log(data)
        if(error)
            console.log('fetchProfile error', error)
        setProfile(data)
        return data
    }

    async function fetchGallery(){
        const newGallery = []
        for(let i=0; i<8; i++){
            const url = supabase.storage
                .from('profiles')
                .getPublicUrl(`${user.id}/${i}`)
            newGallery.push(url)
        }
        setGallery(newGallery)
        return newGallery
    }

    async function saveProfile(newProfile: Profile){
        //api stuff
        const { data, error } = await supabase
            .from('profiles')
            .upsert(newProfile)
            .select()
        //update app state
        console.log(error)
        setProfile({
            ...profile,
            ...newProfile,
        })
    }

    function addImage(uri: string){
        setGallery([
            ...gallery,
            uri
        ])
    }

    function deleteImage(deleteIndex: number){
        setGallery(gallery.reduce((carry, uri, index)=>{
            if(index==deleteIndex) return carry
            carry.push(uri)
            return carry
        }, []))
    }

    function replaceImage(replacementIndex: number, replacementUri: string){
        setGallery(gallery.reduce((carry, uri, index)=>{
            if(index==replacementIndex) {
                carry.push(replacementUri)
            } else {
                carry.push(uri)
            }
            return carry
        }, []))
    }

    function markOnboarded(){
        setProfile({
            ...profile,
            onboarded: true,
        })
    }


    return <profileContext.Provider value={{
            profile,
            saveProfile,
            addImage,
            deleteImage,
            replaceImage,
            markOnboarded,
        }}>
        { children }
    </profileContext.Provider> 
}
