import React, {useState} from 'react';
import {AiOutlinePicture} from "react-icons/ai";

function PhotoInputer({ onChange }: { onChange: (file: File) => void }) {

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
            onChange(file);
        }
    };

    return (
        <label
            htmlFor="photo-upload"
            className="relative border border-gray-300 rounded-md w-64 h-48 px-4 flex items-center justify-center cursor-pointer hover:border-pink-400"
        >
            {previewUrl ? (
                <img
                    src={previewUrl}
                    alt="Uploaded"
                    className="object-cover w-full h-full"
                />
            ) : (
                <div className="flex flex-col gap-2 items-center justify-center h-full">
                    <AiOutlinePicture className="text-gray-500 size-10" />
                    <p className="text-gray-600 text-center">Upload Payment Receipt</p>
                </div>
            )}

            <input
                type="file"
                id="photo-upload"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
        </label>
    );
}

export default PhotoInputer;