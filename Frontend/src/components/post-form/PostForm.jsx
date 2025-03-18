import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.slug || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();

    // Ensure userData is safely accessed
    const userData = useSelector((state) => {
        console.log("Full Redux state:", state); // Debug the whole state
        return state?.auth?.userData || null; // Extra safety check
    });

    console.log("User data in PostForm:", userData); 

    // Slug generation function
    const slugTransform = useCallback((value) => {
        if (typeof value === "string") {
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s+/g, "-");
        }
        return "";
    }, []);

    // Auto-generate slug when title changes
    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title) || "default-slug", { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    // Submit handler
    const submit = async (data) => {
    if (!userData || !userData._id) {
        console.error("User data not found. Please log in.");
        return;
    }

    try {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("slug", data.slug);
        formData.append("content", data.content);
        formData.append("status", data.status === "active");

        if (data.image?.[0]) {
            formData.append("featuredImage", data.image[0]);
        }

        let response;
        if (post?.slug) {
            // Ensure slug is used for updating existing posts
            response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/posts/slug/${post.slug}`, formData, {
                withCredentials: true,
            });
        } else {
            // For creating a new post
            response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/posts`, formData, {
                withCredentials: true,
            });
        }

        if (response?.status === 200 || response?.status === 201) {
            console.log("Post successfully saved:", response.data);
            navigate(`/post/${response.data.data.slug}`);
        }
    } catch (error) {
        console.error("Error creating/updating post:", error.response?.data || error.message);
    }
};

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            {/* Left Section */}
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: "Title is required" })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: "Slug is required" })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE
                    label="Content :"
                    name="content"
                    control={control}
                    rules={{ required: "Content is required" }}
                />
            </div>

            {/* Right Section */}
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />

                {post?.featuredImage && (
                    <div className="w-full mb-4">
                        <img 
                            src={post.featuredImage} 
                            alt={post.title || "Post image"} 
                            className="rounded-lg" 
                        />
                    </div>
                )}

                <Select
                    options={[
                        { label: "Active", value: "active" },
                        { label: "Inactive", value: "inactive" }
                    ]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: "Status is required" })}
                />

                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}
