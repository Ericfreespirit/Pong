import axios, { AxiosResponse } from 'axios';
import { json } from 'stream/consumers';
import config from '../config';
import { authHeader } from '../_helpers';

export const userService = {
    login,
    getAll,
    whoami,
    signout
};

function whoami() {
    console.log(`${config.apiUrl}`)
    return axios.get(`${config.apiUrl}/users/whoami`,
    { 
        withCredentials: true
    }).then((response:any) => {
        if(response == 403)
        {
            const error = response.message || response.statusText;
            return Promise.reject(error);
        }
        return response.data;
    })     
}

function login(email:string, password:string) {
    console.log(`${config.apiUrl}`)
    return axios.post(`${config.apiUrl}/users/signin`,
    {
        email: email,
        password: password
    }, { 
        withCredentials: true 
    }).then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        });        
}

function signout() {
    return axios.post(`${config.apiUrl}/users/signout`,
    { 
        withCredentials: true 
    }).then(response => {
        if(response.status == 201 || response.status == 401)
            return true;
        else
            return Promise.reject("ERRRRORRRRR");    
    });       
}

function getAll() {
    const requestOptions = {
        method: 'GET'
    };
    return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
}

function handleResponse(response:any) {
    if(response.status == 400)
    {
        const error = response.message || response.statusText;
        return Promise.reject(error);
    }
    return response.data;
}