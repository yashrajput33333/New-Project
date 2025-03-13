import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import { login, logout } from "./store/authSlice";
import { Footer, Header } from "./components"; // Removed Signup (not needed here)
import { Outlet } from "react-router-dom";

function App() {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await fetch("/api/v1/users/current-user", {
                    method: "GET",
                    credentials: "include", // ✅ Ensures cookies are sent
                });

                if (!response.ok) throw new Error("No user logged in");

                const userData = await response.json();
                dispatch(login(userData.data)); // ✅ Save user in Redux
            } catch (error) {
                dispatch(logout());
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, [dispatch]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen flex flex-wrap content-between bg-gray-400">
            <div className="w-full block">
                <Header />
                <main>
                    <Outlet /> {/* ✅ This will render the correct page content */}
                </main>
                <Footer />
            </div>
        </div>
    );
}

export default App;
