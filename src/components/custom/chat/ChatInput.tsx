'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

interface ChatInputProps {
    apiUrl: string;
    query: Record<string, any>;
    name: string;
    type: 'channel' | 'conversation';
}

const formShema = z.object({
    content: z.string().min(1),
});

function ChatInput({ apiUrl, query, name, type }: ChatInputProps) {
    const form = useForm<z.infer<typeof formShema>>({
        resolver: zodResolver(formShema),
        defaultValues: {
            content: '',
        },
    });

    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formShema>) => {
        console.log(values);
    };

    return <div>ChatInput</div>;
}

export default ChatInput;
