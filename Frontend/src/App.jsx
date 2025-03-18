import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import { login, logout } from "./store/authSlice";
import { Footer, Header } from "./components";
import { Outlet } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toast styles

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

                if (!response.ok) throw new Error("User not authenticated");

                const userData = await response.json();
                dispatch(login(userData.data)); // ✅ Save user in Redux
            } catch (error) {
                console.error("Error fetching user:", error.message);
                dispatch(logout());
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, [dispatch]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-lg font-semibold text-gray-700">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Toast Notifications */}
            <ToastContainer position="top-right" autoClose={3000} />

            <Header />
            <main className="flex-grow">
                <Outlet /> {/* ✅ This will render the correct page content */}
            </main>
            <Footer />
        </div>
    );
}

export default App;
