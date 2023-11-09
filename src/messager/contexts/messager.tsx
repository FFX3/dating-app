import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react"
import fakeMessages from '../../../fake-data/messager.json'
import { Database } from "../../../database.types";
import { useAuth } from "../../auth/authContext";
import { get_profile_image_url, supabase } from "../../utils/supabase";
import { useRealtime } from "../../utils/RealtimeContext";
import { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import { useMatcher } from "../../matcher/contexts/matcher";

export type PublicProfile = {
    id: string;
    name: String;
    bio: String;
    sex: String;
    gallery: String[];
}

export type DatabaseContact = Database['public']['Views']['contacts']['Row'];
type DatabaseMessage = Database['public']['Views']['message_view']['Row'];
type DatabaseMessageRow = Database['public']['Tables']['messages']['Row'];

export type Message = {
    is_sender: boolean,
    contents: String,
}

export type Contact = {
    id?: number //undefinded when contacts are added optimistictly
    profile: PublicProfile,
    messages: Message[]
}


export type MessagerState = {
    [profile_id: string]: Contact,
}

export type MessagerAction = 
    {
        type: 'add_contact',
        payload: {
            profile: PublicProfile
        }
    }
    |{
        type: 'send_message',
        payload: {
            profile_id: string,
            message: string,
        }
    }
    |{
        type: 'receive_message',
        payload: {
            profile_id: string,
            message: string
        }
    }
    |{
        type: 'set_messages',
        payload: {
            profile_id: string,
            messages: Message[]
        }
    }

type MessagerReducer = 
    (arg0: MessagerState, arg1: MessagerAction)=>MessagerState

function messageReducer(
    state: MessagerState, 
    action: MessagerAction,
){
    const { type, payload } = action
    console.log(type)

    switch(type){
        case 'add_contact':
            state[payload.profile.id] = {
                messages: [],
                profile: payload.profile,
            }
            break
        case 'send_message':
            state[payload.profile_id].messages.push({
                is_sender: true,
                contents: payload.message
            }) 
            break
        case "receive_message":
            console.log('in message received action')
            state[payload.profile_id].messages.push({
                is_sender: false,
                contents: payload.message
            }) 
            break
        case "set_messages":
            state[payload.profile_id].messages = payload.messages
            break
    }

    return { ...state }
}

const messagerContext = createContext(null)

export function useMessager(){
    return useContext(messagerContext)
}

export function MessagerContextProvider({ children }){
    const { user } = useAuth()
    const { newMatch } = useMatcher()
    const [messager, dispatchMessager] = useReducer<MessagerReducer>(messageReducer, {})

    useEffect(()=>{
        if(!newMatch){ return }
        const { gallery, id, name, sex, bio } = newMatch
        dispatchMessager({
            type: 'add_contact',
            payload: { profile: {
                id,
                name,
                sex,
                bio,
                gallery,
            }, }
        })
    },[newMatch])

    useEffect(()=>{
        if(!user?.id) return;

        fetchContacts()
        subsribeToMessageStream()
    },[user?.id])

    function subsribeToMessageStream(){
        supabase.channel('received-messages')
            .on('postgres_changes',
                {
                  event: 'INSERT',
                  schema: 'public',
                  table: 'messages',
                },
                (payload: RealtimePostgresInsertPayload<DatabaseMessageRow>) => {
                    const { sender_id, message } = payload.new
                    console.log('in callback', sender_id, user.id)
                    if (sender_id == user.id) { return }

                    console.log('sending dispatch')

                    dispatchMessager({
                        type: 'receive_message',
                        payload: {
                            message,
                            profile_id: sender_id
                        }
                    })
                }
            ).subscribe()
    }

    async function fetchContacts() {
        const { data, error } = await supabase
            .from('contacts')
            .select()
            .returns<DatabaseContact[]>()

        if(error) console.error(error)

        data.forEach(async (row)=>{
            const gallery = []

            const { image_ids } = row
            if(image_ids){
                for (let i=0; i<image_ids.length; i++){
                    gallery
                        .push(await get_profile_image_url(image_ids[i], row.profile_id))
                }
            }

            dispatchMessager({
                type: 'add_contact',
                payload: { profile: {
                    id: row.profile_id,
                    name: row.name,
                    sex: row.sex,
                    bio: row.bio,
                    gallery,
                }, }
            })
        })
        
        return
    }
    
    async function fetchMessages(contact_profile_id: string) {
        const { data: database_messages, error } = await supabase
            .from('message_view')
            .select()
            .eq('contact_id', contact_profile_id)
            .returns<DatabaseMessage[]>()

        if(error) console.error(error)

        dispatchMessager({
            type: 'set_messages',
            payload: {
                profile_id: contact_profile_id,
                messages: database_messages.map(row=>{
                    return {
                        is_sender: row.is_sender,
                        contents: row.message
                    }
                }),
            }
        })

    }

    function addContact(profile: PublicProfile){
        dispatchMessager({
            type: 'add_contact',
            payload: { profile, }
        })
    }

    async function sendMessage(contact_profile_id: string, message: string){
        const { error } = await supabase
            .rpc('send_message', {
                _contact_id: contact_profile_id,
                _message: message,
            })

        if(error) console.error(error)

        dispatchMessager({
            type: 'send_message',
            payload: {
                profile_id: contact_profile_id,
                message,
            }
        })
    }

    function selectMessages(contact_profile_id: string): Message[] {
        return messager[contact_profile_id].messages ?? []
    }

    function selectContacts(){
        return Object.values(messager)
    }

    const value = useMemo(()=>{ 
        return {
            messager,
            dispatchMessager,
            fetchMessages,
            selectMessages,
            selectContacts,
            addContact,
            sendMessage,
        }
    },[messager])

    return <messagerContext.Provider value={value}>
        { children }
    </messagerContext.Provider>
}
