"use client"

import { UploadDropzone } from "@/lib/uploadthing"
import "@uploadthing/react/styles.css";
import { X } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
    onChange: (url: string) => void;
    endpoint: "serverImage" | "messageFile" | "profileImage";
    value: string
}

export const FileUpload = (props: FileUploadProps) => {
    const { onChange, value, endpoint } = props
    const filetype = value?.split(".").pop()

    if (value != " " && filetype != "pdf") {
        return (
            <div className="relative h-16 w-16 md:w-24 md:h-24 lg:h-32 lg:w-32  ">
                <Image
                    fill
                    src={value}
                    alt="upload"
                    className="rounded-full"
                />
                <button
                    onClick={() => onChange("")}
                    className="bg-red-500 text-white rounded-full p-1 absolute top-0 right-0 shadow-sm"
                >
                    <X className=" h-4 w-4 md:h-6 md:w-6" />
                </button>
            </div>
        )
    }

    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].url!)
            }}
            onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
            }}
            onUploadBegin={(name) => {
                console.log("Uploading: ", name);
            }}
        />
    )
}
