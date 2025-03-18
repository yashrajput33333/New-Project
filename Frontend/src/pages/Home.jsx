import React, { useEffect, useState } from "react";
import { Container, PostCard } from "../components";
import axios from "axios";

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const authRes = await axios.get("/api/v1/users/current-user", { withCredentials: true });
                if (!authRes.data.success) throw new Error("Unauthorized: Please log in.");

                setIsLoggedIn(true);
                const res = await axios.get("/api/v1/users/my-posts", { withCredentials: true });

                if (res.data.success) {
                    setPosts(res.data.data);
                } else {
                    throw new Error("Failed to fetch posts.");
                }
            } catch (err) {
                setIsLoggedIn(false);
                setError(err.message || "Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserPosts();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-lg font-semibold text-gray-600">Loading...</div>;
    }

    if (!isLoggedIn) {
        return <div className="text-center py-8 text-lg text-red-500 font-semibold">Please log in to view your posts.</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-lg text-red-500 font-semibold">{error}</div>;
    }

    if (posts.length === 0) {
        return (
            <Container>
                <h1 className="text-3xl font-bold text-center py-12 text-gray-800">You have no posts yet.</h1>
            </Container>
        );
    }

    return (
        <Container>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-8">
                {posts.map((post) => (
                    <PostCard key={post.slug} {...post} />
                ))}
            </div>
        </Container>
    );
}

export default Home;
