'use client';

import { UploadDropzone } from '@/lib/uploadthing';
import '@uploadthing/react/styles.css';
import { FileIcon, X } from 'lucide-react';
import Image from 'next/image';

interface FileUploadProps {
    onChange: (url: string) => void;
    endpoint: 'serverImage' | 'messageFile' | 'profileImage';
    value: string;
}

export const FileUpload = (props: FileUploadProps) => {
    const { onChange, value, endpoint } = props;
    const filetype = value?.split('.').pop();

    if (value != ' ' && filetype != 'pdf') {
        return (
            <div className="relative h-16 w-16 md:w-24 md:h-24 lg:h-32 lg:w-32  ">
                <Image
                    fill
                    src={value}
                    alt="upload"
                    className="rounded-full bg-center"
                />
                <button
                    onClick={() => onChange('')}
                    className="bg-red-500 text-white rounded-full p-1 absolute top-0 right-0 shadow-sm"
                >
                    <X className=" h-4 w-4 md:h-6 md:w-6" />
                </button>
            </div>
        );
    }

    if (value && filetype === 'pdf') {
        return (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10 ">
                <FileIcon className="h-10 w-10 fill-indigo-300 stroke-indigo-500 " />
                <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-sm text-indigo-600 dark:text-indigo-300 hover:underline "
                >
                    {value}
                </a>
                <button
                    onClick={() => onChange('')}
                    className="bg-red-500 text-white rounded-full p-1 absolute -top-0 -right-2 shadow-sm"
                >
                    <X className=" h-4 w-4 md:h-6 md:w-6" />
                </button>
            </div>
        );
    }

    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={res => {
                onChange(res?.[0].url!);
            }}
            onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
            }}
            onUploadBegin={name => {
                console.log('Uploading: ', name);
            }}
        />
    );
};
