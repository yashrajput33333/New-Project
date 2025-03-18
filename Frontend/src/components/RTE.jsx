import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";

export default function RTE({ name, control, label, defaultValue = "" }) {
    return (
        <div className="w-full">
            {label && <label className="inline-block text-gray-700 text-sm font-medium mb-2 pl-1">{label}</label>}

            <div className="bg-white rounded-lg shadow-lg border border-gray-300 transition-all hover:shadow-2xl duration-300">
                <Controller
                    name={name || "content"}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <Editor
                            apiKey="30onstaybn2i88w1y8ki7n273lcwnyzcn965izz218hl993v"
                            initialValue={defaultValue}
                            value={value}
                            init={{
                                height: 500,
                                menubar: true,
                                plugins: ["advlist", "autolink", "lists", "link", "image", "preview", "fullscreen", "table", "wordcount"],
                                toolbar: "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | removeformat",
                                content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                            }}
                            onEditorChange={onChange}
                        />
                    )}
                />
            </div>
        </div>
    );
}
