import React, { useEffect, useState } from "react";
import { Container, PostCard } from "../components";
import axios from "axios";

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Assume logged in, update later

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                // Check authentication first
                const authRes = await axios.get("/api/v1/users/current-user", { withCredentials: true });
                if (!authRes.data.success) {
                    setIsLoggedIn(false);
                    setLoading(false);
                    return;
                }

                // If logged in, fetch posts
                const res = await axios.get("/api/v1/users/my-posts", { withCredentials: true });
                if (res.data.success) {
                    setPosts(res.data.data);
                } else {
                    throw new Error("Failed to fetch user's posts");
                }
            } catch (err) {
                setIsLoggedIn(false);
                setError("Please log in to view your posts.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserPosts();
    }, []);

    if (loading) return <div className="text-center py-8">Loading...</div>;

    if (!isLoggedIn) {
        return <div className="text-center py-8 text-blue-500">Please log in to view your posts.</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">{error}</div>;
    }

    if (posts.length === 0) {
        return (
            <Container>
                <h1 className="text-2xl font-bold text-center py-8">You have no posts yet.</h1>
            </Container>
        );
    }

    return (
        <Container>
            <div className="flex flex-wrap">
                {posts.map((post) => (
                    <div key={post.slug} className="p-2 w-1/4">
                        <PostCard {...post} />
                    </div>
                ))}
            </div>
        </Container>
    );
}

export default Home;
