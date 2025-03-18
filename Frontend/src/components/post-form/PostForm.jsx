import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

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
    const userData = useSelector((state) => state?.auth?.userData || null);
    const [loading, setLoading] = useState(false);

    // Generate slug automatically
    const slugTransform = useCallback((value) => {
        return value?.trim().toLowerCase().replace(/[^a-zA-Z\d\s]+/g, "-").replace(/\s+/g, "-") || "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title) || "default-slug", { shouldValidate: true });
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    // Submit Handler
    const submit = async (data) => {
        if (!userData || !userData._id) {
            toast.error("User not authenticated!");
            return;
        }

        setLoading(true);
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
                response = await axios.put(`/api/v1/users/posts/slug/${post.slug}`, formData, { withCredentials: true });
            } else {
                response = await axios.post("/api/v1/users/posts", formData, { withCredentials: true });
            }

            if (response?.status === 200 || response?.status === 201) {
                toast.dismiss();
                toast.success("Post saved successfully! 🎉");
                navigate(`/post/${response.data.data.slug}`);
            }
        } catch (error) {
            console.error("Error creating/updating post:", error.response?.data || error.message);
            toast.error("Failed to save post. Please try again!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            {/* Left Section */}
            <div className="w-2/3 px-2">
                <Input label="Title :" placeholder="Title" className="mb-4" {...register("title", { required: "Title is required" })} />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: "Slug is required" })}
                    onInput={(e) => setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true })}
                />
                <RTE label="Content :" name="content" control={control} rules={{ required: "Content is required" }} />
            </div>

            {/* Right Section */}
            <div className="w-1/3 px-2">
                <Input label="Featured Image :" type="file" className="mb-4" accept="image/*" {...register("image", { required: !post })} />

                {post?.featuredImage && (
                    <div className="w-full mb-4">
                        <img src={post.featuredImage} alt={post.title || "Post image"} className="rounded-lg w-full max-h-48 object-cover" />
                    </div>
                )}

                <Select
                    options={[
                        { label: "Active", value: "active" },
                        { label: "Inactive", value: "inactive" },
                    ]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: "Status is required" })}
                />

                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {loading ? "Submitting..." : post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}
