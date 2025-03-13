import React, { useEffect, useState } from "react";
import { Container, PostForm } from "../components";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function EditPost() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (slug) {
            axios
                .get(`/api/v1/users/posts/slug/${slug}`)
                .then((res) => {
                    if (res.data.success) {
                        setPost(res.data.data);
                    } else {
                        navigate("/");
                    }
                })
                .catch(() => navigate("/"));
        } else {
            navigate("/");
        }
    }, [slug, navigate]);

    return post ? (
        <div className="py-8">
            <Container>
                <PostForm post={post} />
            </Container>
        </div>
    ) : null;
}

export default EditPost;
