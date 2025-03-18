import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import axios from "axios";

export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const isAuthor = post && userData ? post.owner === userData._id : false;

    useEffect(() => {
        if (!slug) {
            navigate("/");
            return;
        }

        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/posts/slug/${slug}`)
            .then((res) => {
                if (res.data.success) setPost(res.data.data);
                else navigate("/");
            })
            .catch((err) => {
                console.error("Error fetching post:", err);
                navigate("/");
            });
    }, [slug, navigate]);

    const deletePost = async () => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        try {
            const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/posts/slug/${post.slug}`);
            if (res.data.success) navigate("/");
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    return post ? (
        <div className="py-8 bg-gradient-to-b from-gray-500 to-black min-h-screen">
            <Container>
                {/* Post Title (Centered) */}
                <div className="w-full text-center mb-6">
                    <h1 className="text-3xl font-extrabold text-white">{post.title}</h1>
                </div>

                {/* Featured Image (Reduced Size) */}
                <div className="w-full flex justify-center mb-6">
                    {post.featuredImage && (
                        <img
                            src={post.featuredImage}
                            alt={post.title || "Post image"}
                            className="rounded-xl max-h-96 w-full max-w-3xl object-cover transition-transform duration-300 hover:scale-105 shadow-lg"
                        />
                    )}
                </div>

                {/* Edit & Delete Buttons for Author */}
                {isAuthor && (
                    <div className="flex justify-end max-w-3xl mx-auto mb-4">
                        <Link to={`/edit-post/${post.slug}`}>
                            <Button bgColor="bg-green-500" className="mr-3 px-4 py-2 text-sm">
                                ✏ Edit
                            </Button>
                        </Link>
                        <Button bgColor="bg-red-500" onClick={deletePost} className="px-4 py-2 text-sm">
                            🗑 Delete
                        </Button>
                    </div>
                )}

                {/* Post Content (Left Aligned) */}
                <div className="browser-css text-white leading-relaxed max-w-3xl mx-auto text-left">
                    {typeof post.content === "string" ? parse(post.content) : null}
                </div>
            </Container>
        </div>
    ) : null;
}
