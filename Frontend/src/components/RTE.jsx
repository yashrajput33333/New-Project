import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Controller } from 'react-hook-form';

export default function RTE({ name, control, label, defaultValue = "" }) {
    return (
        <div className="w-full">
            {/* Render label if provided */}
            {label && <label className="inline-block mb-1 pl-1">{label}</label>}

            {/* Controller from react-hook-form */}
            <Controller
                name={name || "content"}
                control={control}
                render={({ field: { onChange, value } }) => (
                    <Editor
                        apiKey="30onstaybn2i88w1y8ki7n273lcwnyzcn965izz218hl993v" // 🔥 Add your TinyMCE API key here
                        initialValue={defaultValue}
                        value={value}
                        init={{
                            height: 500,
                            menubar: true,
                            plugins: [
                                "advlist", "autolink", "lists", "link", "image", "charmap", 
                                "preview", "anchor", "searchreplace", "visualblocks", 
                                "code", "fullscreen", "insertdatetime", "media", 
                                "table", "code", "help", "wordcount"
                            ],
                            toolbar:
                                "undo redo | blocks | image | " +
                                "bold italic forecolor | alignleft aligncenter " +
                                "alignright alignjustify | bullist numlist outdent indent | " +
                                "removeformat | help",
                            content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
                        }}
                        onEditorChange={onChange}
                    />
                )}
            />
        </div>
    );
}
