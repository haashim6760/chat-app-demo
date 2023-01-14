import { FirebaseApp, initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState} from "react";
import { getAnalytics, Analytics} from "firebase/analytics";
import { getFirestore, Firestore} from "firebase/firestore";
import { getStorage, FirebaseStorage} from "firebase/storage";
import { async } from "@firebase/util";
 


type FirebaseContextType = {
    app: FirebaseApp | null;
    auth: Auth | null;
    firestore: Firestore | null;
    storage: FirebaseStorage | null;
};

const FirebaseContext = createContext<FirebaseContextType>({
    app: null,
    auth: null,
    firestore: null,
    storage: null,
});

export default function FirebaseProvide({
    children,
}: {
    children: React.ReactNode;
}){

    const [variables, setVariables] = useState<FirebaseContextType>({
    app: null,
    auth: null,
    firestore: null,
    storage: null, 
    })

    useEffect(() =>{
        const initialize = async () => {
            const firebaseConfig = {
                apiKey: "AIzaSyCgJ7sog1e8CNFNMRcvYmE3Ik0RBgKbDqw",
                authDomain: "chat-web-app-8fad2.firebaseapp.com",
                projectId: "chat-web-app-8fad2",
                storageBucket: "chat-web-app-8fad2.appspot.com",
                messagingSenderId: "18485972364",
                appId: "1:18485972364:web:09ffdde19c063bb0bb9aa9",
                measurementId: "G-MKQJET4BPQ"
            };


            const app = initializeApp(firebaseConfig);
            const auth = getAuth(app);
            const firestore = getFirestore(app);
            const storage = getStorage(app);

            setVariables({
                app: app,
                auth: auth,
                firestore: firestore,
                storage: storage,
            });
        };

        initialize();
    }, []);
   
    return (
        <FirebaseContext.Provider value={variables}>
            {children}
        </FirebaseContext.Provider>
    );
}



export const useFirebase = () => {
    return useContext(FirebaseContext)
}