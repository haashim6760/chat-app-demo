import React, { createContext, useContext, useEffect, useState } from "react";
import {
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    User,
    GoogleAuthProvider,
    UserCredential,
    signOut,
} from 'firebase/auth';
import {useFirebase} from './FirebaseProvider';

type UserContextType = {
    user: User | null | undefined;
    signInWithGoogle: () =>
    Promise<UserCredential | void | undefined>;
    signInWithEmailAndPassword: (email: string, password: string) =>
    Promise<UserCredential | void | undefined>;
    createUserWithEmailAndPassword: (email: string, password: string) =>
    Promise<UserCredential | void | undefined>;
    resetPassword: (email: string) =>
    Promise<UserCredential | void | undefined>;
    signOut: () =>
    Promise<void>;
};

const UserContext = createContext<UserContextType>({
    user: undefined,
    signInWithGoogle: async () => {},
    signInWithEmailAndPassword: async () => {},
    createUserWithEmailAndPassword: async () => {},
    resetPassword: async () => {},
    signOut: async () => {},

});

export default function UserProvider({ children}: {children: React.ReactNode}){
    let {auth} = useFirebase();
    let [user, setUser] = useState<User | null | undefined>(undefined);

    useEffect(() => {
        if (auth) {
            auth.onAuthStateChanged(setUser);
        }
    }, [auth]);

    return (
        <UserContext.Provider value={{
            user,
            signInWithGoogle:async () => {
                if (auth) {
                    const provider = new GoogleAuthProvider();
                    provider.addScope('email');
                    return signInWithPopup(auth, provider);
                }
            },
            signInWithEmailAndPassword: async (email: string, password: string) => {
                if (auth) {
                    return signInWithEmailAndPassword(auth, email, password);
                }
            },
            createUserWithEmailAndPassword: async (email: string, password: string) => {
                if (auth) {
                    return sendPasswordResetEmail(auth, email);
                }
            },
            resetPassword: async (email: string) => {
                if (auth) {
                    return auth.signOut();
                }
            },
            signOut: async () => {
                if (auth) {
                    return auth.signOut();
                }
            }
        }}>
            {children}
        </UserContext.Provider>
    );
}
 
export const useUser = () => {
    return useContext(UserContext);
}