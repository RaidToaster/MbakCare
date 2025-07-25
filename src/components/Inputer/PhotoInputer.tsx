import React, {useState} from 'react';
import {AiOutlinePicture} from "react-icons/ai";

function PhotoInputer({ onChange, defaultPhoto = null, full = false}: { onChange: (file: File) => void, defaultPhoto?:File|string|null, full?: boolean }) {

    const [previewUrl, setPreviewUrl] = useState<string | null>(
        defaultPhoto ?  (defaultPhoto instanceof File ? URL.createObjectURL(defaultPhoto) : defaultPhoto) : null);

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
            className={`overflow-hidden relative border flex items-center justify-center cursor-pointer hover:border-pink-400 transition-all duration-300 ${full ? 'border-pink-300 rounded-full w-40 h-40 shadow-lg hover:shadow-xl' : 'border-gray-300 rounded-md w-72 h-64 px-4'}`}
        >
            {previewUrl ? (
                <img
                    src={previewUrl}
                    alt="Uploaded"
                    className={`object-cover w-full h-full ${full ? 'rounded-full' : ''}`}
                />
            ) : (
                <div className="flex flex-col gap-2 items-center justify-center h-full text-gray-500">
                    <AiOutlinePicture className="size-12" />
                    <p className="text-center text-sm">Upload Photo</p>
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