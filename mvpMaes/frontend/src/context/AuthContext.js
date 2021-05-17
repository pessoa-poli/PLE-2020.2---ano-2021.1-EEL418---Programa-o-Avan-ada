import React, {createContext, useState, useEffect} from 'react';
import api from "../api"
import history from '../history';
const Context = createContext();


function AuthProvider({children}){
    const [authenticated, setAuthenticated] = useState(false); 
    const [loading, setLoading] = useState(true);

    useEffect(()=> {
        const token = localStorage.getItem('token');

        if (token) {
            api.defaults.headers.Authorization =  `Bearer ${JSON.parse(token)}`
            setAuthenticated(true);
        }     
        setLoading(false);    
    },[])

    function handleLogin () {
        const {data: {token}} = api.post('auth/login');
        localStorage.setItem('token'.JSON.stringify(token));
        api.defaults.headers.Authorization = `Bearer ${token}`;
        setAuthenticated(true);
        history.push('experiencias');
    }

    function handleLogout() {
        setAuthenticated(false);
        localStorage.removeItem('token');
        api.defaults.headers.Authorization = undefined;
        history.push('login');
    }

    return(
        <Context.Provider value={{authenticated: authenticated, handleLogin, handleLogout}}>
            {children}
        </Context.Provider>
    )
}

export  {Context, AuthProvider}