import React, { useEffect, useState } from "react";
import { Container, PostForm } from "../components";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function EditPost() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!slug) {
            navigate("/");
            return;
        }

        axios
            .get(`/api/v1/users/posts/slug/${slug}`)
            .then((res) => {
                if (res.data.success) {
                    setPost(res.data.data);
                } else {
                    toast.error("Post not found!", { autoClose: 2000 });
                    navigate("/");
                }
            })
            .catch(() => {
                toast.error("Failed to fetch post!", { autoClose: 2000 });
                navigate("/");
            });
    }, [slug, navigate]);

    // Handle Post Update
    const handlePostUpdate = async (updatedPost) => {
        try {
            const response = await axios.put(
                `/api/v1/users/posts/slug/${slug}`,
                {
                    ...updatedPost,
                    status: updatedPost.status === "active", // ✅ Ensure correct boolean conversion
                },
                { withCredentials: true }
            );

            if (response.data.success) {
                toast.dismiss();
                toast.success("Post updated successfully! 🎉", { autoClose: 2000 });
                navigate(`/post/${slug}`);
            }
        } catch (error) {
            console.error("Error updating post:", error);
            toast.error("Failed to update post!", { autoClose: 2000 });
        }
    };

    // Handle Post Deletion
    const handlePostDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        try {
            const response = await axios.delete(`/api/v1/users/posts/slug/${slug}`, {
                withCredentials: true,
            });

            if (response.data.success) {
                toast.dismiss();
                toast.success("Post deleted successfully! 🗑️", { autoClose: 2000 });
                navigate("/"); // Redirect to homepage after deletion
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Failed to delete post!", { autoClose: 2000 });
        }
    };

    return post ? (
        <div className="py-8">
            <Container>
                <PostForm post={post} onSubmit={handlePostUpdate} />
                <button
                    onClick={handlePostDelete}
                    className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition"
                >
                    Delete Post
                </button>
            </Container>
        </div>
    ) : null;
}

export default EditPost;
