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

        axios.get(`/api/v1/users/posts/slug/${slug}`)
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
            const res = await axios.delete(`/api/v1/users/posts/slug/${post.slug}`);
            if (res.data.success) navigate("/");
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    return post ? (
        <div className="py-8">
            <Container>
                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
                    {post.featuredImage && (
                        <img
                            src={post.featuredImage}
                            alt={post.title || "Post image"}
                            className="rounded-xl"
                        />
                    )}

                    {isAuthor && (
                        <div className="absolute right-6 top-6">
                            <Link to={`/edit-post/${post.slug}`}>
                                <Button bgColor="bg-green-500" className="mr-3">
                                    Edit
                                </Button>
                            </Link>
                            <Button bgColor="bg-red-500" onClick={deletePost}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                <div className="w-full mb-6">
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                </div>
                <div className="browser-css">
                    {typeof post.content === "string" ? parse(post.content) : null}
                </div>
            </Container>
        </div>
    ) : null;
}
