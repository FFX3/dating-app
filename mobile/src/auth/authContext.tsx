import React, { useState, createContext, useContext, useEffect } from "react"
import { supabase } from "../utils/supabase"
import { User } from "@supabase/supabase-js"

const authContext = createContext(null)

export function useAuth(){
    return useContext(authContext)
}

export function AuthContextProvider({ children }){
    const [authError, setAuthError] = useState(null)
    const [user, setUser] = useState<User>()

    async function register(email: string, password: string){
        const { data, error } = await supabase.auth.signUp({ email, password })
        if(error) { setAuthError(error.message); return }
        setAuthError(null)
        setUser(data.user)
        return data.user
    }

    async function login(email: string, password: string){
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if(error) { setAuthError(error.message); return }
        setAuthError(null)
        setUser(data.user)
        return data.user
    }

    async function logout(){
        const { error } = await supabase.auth.signOut()
        if(error) { setAuthError(error.message); return }
        setAuthError(null)
    }

    async function forgotPassword(email: string){
        const { error } = await supabase.auth.resetPasswordForEmail(email)
        if(error) { setAuthError(error.message); return }
        setAuthError(null)
    }

    async function getUser(){
        const { data, error } = await supabase.auth.getUser()
        if(error) { setAuthError(error.message); return }
        return data.user
    }

    useEffect(()=>{
        async ()=>{
            setUser(await getUser())
        }
    },[])

    return <authContext.Provider value={{
        authError,
        register,
        login,
        logout,
        forgotPassword,
        getUser,
        user
    }}>
    
        { children }
    </authContext.Provider>
}
