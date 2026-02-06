import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for token and user on load
        const storedUser = localStorage.getItem("user");
        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, [token]);

    const login = (userData, authToken) => {
        localStorage.setItem("token", authToken);
        localStorage.setItem("user", JSON.stringify(userData));
        // ✅ SYNC: Set the general userId to the authenticated user's ID
        // This ensures the cart and checkout use the correct ID for history
        localStorage.setItem("userId", userData.id || userData._id);

        setToken(authToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // ✅ SYNC: Clear userId so a new guest ID acts as fresh session
        localStorage.removeItem("userId");

        setToken(null);
        setUser(null);
    };

    // Helper to extract first name for UI
    const getFirstName = () => {
        if (!user || !user.name) return "User";
        return user.name.split(" ")[0];
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, getFirstName, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
