import axios from "axios";

// backend pr jo function usse react krte hai
export async function register({username, email, password}) {
    try{
        const response = await axios.post("http://localhost:3000/api/auth/register",{
        username,
        email,
        password
    },{
        withCredentials: true
    })
    return response.data;
    } catch(error){
        console.error("Error registering user:", error);
    }
    
}

export async function login({email, password}) {
    try{
        const response = await axios.post("http://localhost:3000/api/auth/login",{
            email,
            password
        },{
            withCredentials: true
        })
        return response.data;
    }catch(error){
        console.error("Error logging in user:", error);
    }
}

export async function logout() {
    try{
        const response = await axios.post("http://localhost:3000/api/auth/logout",{},{
            withCredentials: true
        })
        return response.data;
    }catch(error){
        console.error("Error logging out user:", error);
    }
}

export async function getMe(){
    try{
        const response = await axios.get("http://localhost:3000/api/auth/get-me",{
            withCredentials: true
        })
        return response.data;
    }catch(error){
        console.error("Error fetching user data:", error);
    }
}