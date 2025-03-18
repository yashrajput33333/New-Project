import React from "react";
import { Container, PostForm } from "../components";
import { toast } from "react-toastify";

function AddPost() {
    const handlePostAdded = () => {
        toast.success("Post added successfully! 🎉");
    };

    return (
        <div className="py-8">
            <Container>
                <PostForm onPostAdded={handlePostAdded} />
            </Container>
        </div>
    );
}

export default AddPost;
