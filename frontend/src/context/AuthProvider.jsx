import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            setAuth(JSON.parse(userInfo));
        }
    }, []);

    const login = async (username, password) => {
        const { data } = await api.post("/users/login", { username, password });
        localStorage.setItem("userInfo", JSON.stringify(data));
        setAuth(data);
        return data; // Return data so we can redirect in the component
    };

    const logout = () => {
        localStorage.removeItem("userInfo");
        setAuth({});
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
