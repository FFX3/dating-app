import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react"
import fakeMessages from '../../../fake-data/messager.json'

export type PublicProfile = {
    id: string;
    name: String;
    bio: String;
    sex: String;
    gallery: String[];
}

export type Message = {
    sender: boolean,
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

    if(
        type == 'send_message' 
        && !!payload?.filter.profile_id 
        && !!payload.message
    ){
        state[payload.profile.id].messages.push({
            sender: true,
            contents: payload.message
        }) 
        return { ...state }
    }

    if(
        type == 'receive_message' 
        && !!payload?.filter.profile_id 
        && !!payload.message
    ){
        state[payload.profile.id].messages.push({
            sender: false,
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
    const [messager, dispatchMessager] = useReducer<MessagerReducer>(messageReducer, {})

    //TODO replace with useQuery
    useEffect(()=>{
        fetchContacts()
    },[])

    function fetchContacts() {
        Object.values(fakeMessages)
            .forEach((contact)=>{
                dispatchMessager({
                    type: 'add_contact',
                    payload: { profile: contact.profile, }
                })
            })

    }
    
    function fetchMessages(contact_profile_id: string) {
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

    function sendMessage(contact_profile_id: string, message: string){
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

    function selectMessages(contact_profile_id: string){
        return messager[contact_profile_id].messages
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
