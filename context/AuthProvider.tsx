import { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { supabase } from "~/utils/supabase";

const AuthContext = createContext<{
    session: Session | null;
    user: Session['user'] | null;
    isAuthenticated: boolean;
}>({
    session: null,
    user: null,
    isAuthenticated: false
});

export default function AuthProvider({children}: {children: React.ReactNode}) {
    const [session, setSession] = useState<Session | null>(null)
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setIsReady(true)
        })

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    }, [])


    if (!isReady) {
        return (
            <>
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size='large' color='gray' />
                </View>
            </>
        )
    }
    
    return (
        <AuthContext.Provider value={{session, user: session?.user ?? null, isAuthenticated: !!session?.user}}>
        {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);