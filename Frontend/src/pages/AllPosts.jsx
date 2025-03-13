import React, { useState, useEffect } from "react";
import { Container, PostCard } from "../components";
import axios from "axios";

function AllPosts() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get("/api/v1/users/posts");
                if (res.data.success) {
                    setPosts(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPosts(); // Call the function
    }, []);

    return (
        <div className="w-full py-8">
            <Container>
                <div className="flex flex-wrap">
                    {posts.map((post) => (
                        <div key={post.slug} className="p-2 w-1/4">
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}

export default AllPosts;
