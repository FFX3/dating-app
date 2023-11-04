import React, { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import fakeProfile from '../../../fake-data/user.json'
import { supabase } from '../../utils/supabase'
import { useLocalTestData } from '../../config'
import { Database } from '../../../database.types'
import { useAuth } from "../../auth/authContext";
import { ImagePickerAsset } from "expo-image-picker";
import { decode } from 'base64-arraybuffer'

type Gallery = {
    uri: string;
    index: number;
    id: string;
    uploaded: boolean;
    imagePickerAsset?: ImagePickerAsset;
}[];

export type Profile = Database['public']['Tables']['profiles']['Row']

const profileContext = createContext(null)

export function useProfile(){
   return  useContext(profileContext)
}

export function ProfileContextProvider({ children }){
    const { user } = useAuth()

    const [profile, setProfile] = useState<Profile>()
    const [gallery, setGallery] = useState<Gallery>([])
    const [imagePendingDeletion, setImagePendingDeletion] = useState<Gallery>([])
    

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

        if(error)
            console.log('fetchProfile error', error)

        setProfile(data)
        return data
    }

    async function fetchGallery(){
        const { data, error } = await supabase
            .from('profile_images')
            .select()
            .eq('profile_id', user.id)
            .order('index')

        if(error)
            console.log('fetchGallery error', error)

        const gallery = []

        for(let i=0; i<data.length; i++){
            const { id, index } = data[i]
            const { data: image, error } = await supabase
                .storage
                .from('profiles')
                .createSignedUrl(`${user.id}/profile-images/${id}`, 60 * 24)

            if(error)
                console.log('fetchGallery image fetch error', error)

            if(!image) continue

            const { signedUrl: uri } = image

            gallery.push({ uri, id, index: i, uploaded: true })
        }

        setGallery(gallery)
    }

    async function saveProfile(newProfile: Profile){
        //api stuff
        const { data, error } = await supabase
            .from('profiles')
            .upsert(newProfile)
            .select()

        if(error) console.error(error)

        setProfile({
            ...profile,
            ...newProfile,
        })
    }

    async function addImage(resource: ImagePickerAsset){
        setGallery([...gallery,
            {
                id: resource.uri,
                uri: resource.uri,
                index: gallery.length,
                uploaded: false,
                imagePickerAsset: resource
            }
        ])
    }

    function deleteImage(deleteIndex: number){
        const newGallery = []
        const pendingDeletion = []
        console.log(gallery[deleteIndex])
        for(let i=0; i<gallery.length; i++){
            const item = gallery[i]
            if(i==deleteIndex) {
                pendingDeletion.push(item)
                continue
            }
            newGallery.push({
                ...item,
                index: newGallery.length,
            })
        }
        setImagePendingDeletion(pendingDeletion)
        setGallery(newGallery)
    }

    function replaceImage(replacementIndex: number, replacement: ImagePickerAsset){
        setGallery(gallery.reduce((carry, item, index)=>{
            if(index==replacementIndex) {
                carry.push({
                    id: replacement.uri,
                    uri: replacement.uri,
                    index: index,
                    uploaded: false,
                    imagePickerAsset: replacement
                })
                if(item.uploaded)
                    setImagePendingDeletion([...imagePendingDeletion, item])
            } else {
                carry.push(item)
            }
            return carry
        }, []))
    }

    async function saveGallery(){
        {
            // deleted images
            const { error } = await supabase
                .from('profile_images')
                .delete()
                .in('id', imagePendingDeletion.map((image)=>image.id))

            if(error) console.error(error)
        }

        {
            // update index
            const alreadyUploaded = gallery.filter(galleryItem=>galleryItem.uploaded)
            const { data: indexUpdates, error } = await supabase
                .from('profile_images')
                .upsert(alreadyUploaded.map((image)=>{
                    return { 
                        id: image.id,
                        index: image.index 
                    }
                }), { onConflict: 'id' })
                .select()
            if(error) console.error(error)
        }

        const uploadPendingImages = gallery.filter((galleryItem)=>!galleryItem.uploaded)

        const { data: inserts, error } = await supabase
            .from('profile_images')
            .insert(uploadPendingImages.map((image)=>{
                return { 
                    index: image.index 
                }
            }))
            .select()

        if(error) console.error(error)

        if(!inserts) return true

        console.log(inserts)

        const promises = inserts.map(async (row)=>{
            const base64 = uploadPendingImages
                .find(pending=>pending.index == row.index)
                .imagePickerAsset
                .base64

            await supabase.storage
                .from('profiles')
                .upload(`${user.id}/profile-images/${row.id}`, decode(base64), {
                    contentType: 'image/png'
                })

            return true
        })

        await Promise.all(promises)
        await fetchGallery()

        return true
    }

    function markOnboarded(){
        setProfile({
            ...profile,
            onboarded: true,
        })
    }


    return <profileContext.Provider value={{
            profile,
            gallery,
            saveProfile,
            addImage,
            deleteImage,
            replaceImage,
            markOnboarded,
            saveGallery,
        }}>
        { children }
    </profileContext.Provider> 
}
