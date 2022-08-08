import {useEffect, useState} from 'react'
import axios from 'axios'

export default function UseAuth(code) {
    const [accessToken, setAccessToken] = useState();
    const [refreshToken, setRefreshToken] = useState();
    const [expiresIn, setExpiresIn] = useState();
    useEffect(() => {
        axios
            .post('http://localhost:3001/login', {
                code,
            })
            .then(res => {
                setAccessToken(res.data.accessToken);
                //refresh token allowed the user not to reload the page every 1 hour
                setRefreshToken(res.data.refresh_token);
                setExpiresIn(res.data.expires_in);
                //remove the code from the url
                window.history.pushState({}, null, '/');
            })
            .catch(err => {
                console.log(err);
                //redirect to /login
                window.location = '/'
            })
    }, [code])
    useEffect(() => {       
        if(!refreshToken || !expiresIn) return;
        const interval = setInterval(() => {
            axios
                .post('http://localhost:3001/refresh', {
                    refreshToken,
                })
                .then(res => {
                    setAccessToken(res.data.accessToken);
                    setExpiresIn(res.data.expires_in);           
                })
                .catch(() => {
                    window.location = '/'
                })
        },  (expiresIn - 60) * 1000);      
        return () => clearInterval(interval);
    }, [refreshToken, expiresIn])   
    
    return accessToken;
}
