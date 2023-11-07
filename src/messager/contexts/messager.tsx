import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react"
import fakeMessages from '../../../fake-data/messager.json'
import { Database } from "../../../database.types";
import { useAuth } from "../../auth/authContext";
import { get_profile_image_url, supabase } from "../../utils/supabase";

export type PublicProfile = {
    id: string;
    name: String;
    bio: String;
    sex: String;
    gallery: String[];
}

type DatabaseContact = Database['public']['Views']['contacts']['Row'];
type DatabaseMessage = Database['public']['Views']['message_view']['Row'];

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

export type MessagerAction = { 
    type: String, 
    payload?: {
        profile?: PublicProfile
        message?: string,
        filter?: { profile_id: string },
        messages?: Message[],
    } 
}

type MessagerReducer = 
    (arg0: MessagerState, arg1: MessagerAction)=>MessagerState

function messageReducer(
    state: MessagerState, 
    action: MessagerAction,
){
    const { type, payload } = action

    if(type == 'add_contact' && !!payload.profile ){
        state[payload.profile.id] = {
            messages: [],
            profile: payload.profile,
        }
        return { ...state }
    }
    console.log(type, payload)
    if(
        type == 'send_message' 
        && !!payload?.filter.profile_id 
        && !!payload.message
    ){
        state[payload.filter.profile_id].messages.push({
            is_sender: true,
            contents: payload.message
        }) 
        return { ...state }
    }

    if(
        type == 'receive_message' 
        && !!payload?.filter.profile_id 
        && !!payload.message
    ){
        state[payload.filter.profile_id].messages.push({
            is_sender: false,
            contents: payload.message
        }) 
        return { ...state }
    }

    if(
        type == 'set_messages' 
        && !!payload?.filter.profile_id 
        && !!payload.messages
    ){
        state[payload.filter.profile_id].messages = payload.messages
        return { ...state }
    }

    return state
}

const messagerContext = createContext(null)

export function useMessager(){
    return useContext(messagerContext)
}

export function MessagerContextProvider({ children }){
    const { user } = useAuth()
    const [messager, dispatchMessager] = useReducer<MessagerReducer>(messageReducer, {})

    //TODO replace with useQuery
    useEffect(()=>{
        if(!user?.id) return;

        fetchContacts()
        const unsubMessages = subsribeToMessageStream()

        return ()=>{
            // TODO fix unsubsription
            //unsubMessages()
        }
    },[user?.id])

    function subsribeToMessageStream(){
        const channel = supabase
          .channel('table-db-changes')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'messages',
            },
            (payload) => {
                console.log('from subscription')
                const { sender_id, message } = payload.new
                if (sender_id == user.id) return

                dispatchMessager({
                    type: 'receive_message',
                    payload: {
                        message,
                        filter: {
                            profile_id: sender_id
                        }
                    }
                })
            }
          )
          .subscribe()

        return channel.unsubscribe
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
                        .push(get_profile_image_url(image_ids[i], row.profile_id))
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
        
        Object.values(fakeMessages)
            .forEach((contact)=>{
                dispatchMessager({
                    type: 'add_contact',
                    payload: { profile: contact.profile, }
                })
            })

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
                filter: {
                    profile_id: contact_profile_id,
                },
                messages: database_messages.map(row=>{
                    return {
                        is_sender: row.is_sender,
                        contents: row.message
                    }
                }),
            }
        })

        return 
        const { messages } = fakeMessages
            .find((contact)=>contact.profile.id == contact_profile_id)

        dispatchMessager({
            type: 'set_messages',
            payload: {
                filter: {
                    profile_id: contact_profile_id,
                },
                messages,
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
                filter: {
                    profile_id: contact_profile_id,
                },
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
