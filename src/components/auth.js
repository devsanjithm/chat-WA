
import React, { useEffect, useState } from "react";
import { fapp } from "../firebase";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    useEffect(() => {
        fapp.auth().onAuthStateChanged((user) => {
            setCurrentUser(user);
        });
    }, []);
    return (<AuthContext.Provider value={{
        currentUser
    }}>
        {children}
    </AuthContext.Provider>);
};