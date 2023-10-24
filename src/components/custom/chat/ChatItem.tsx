import React, { useEffect, useState } from 'react';
import type { MessagewithMemberProfile } from './ChatMessages';
import { Member, MemberRole, Profile } from '@prisma/client';
import UserAvatar from '../UserAvatar';
import { ActionTooltip } from '../action-tooltip';
import { Edit, ShieldAlert, ShieldCheckIcon, Trash } from 'lucide-react';
import Image from 'next/image';
import { FileIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import * as z from 'zod';
import axios from 'axios';
import qs from 'query-string';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useModal } from '@/hooks/use-modal-store';
import { toast } from '@/components/ui/use-toast';

interface Props {
    id: string;
    content: string;
    member: Member & {
        profile: Profile;
    };
    timestamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentMember: Member;
    isUpdated: boolean;
    socketUrl: string;
    socketQuery: Record<string, string>;
}

const roleIconMap = {
    GUEST: null,
    MODERATOR: <ShieldCheckIcon className="h-4 w-4 ml-2 text-indigo-500" />,
    ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};

const formSchema = z.object({
    content: z.string().min(1),
});

function ChatItem({
    id,
    content,
    member,
    timestamp,
    fileUrl,
    deleted,
    currentMember,
    isUpdated,
    socketUrl,
    socketQuery,
}: Props) {
    const fileType = fileUrl?.split('.').pop();
    const isAdmin = currentMember.role === MemberRole.ADMIN;
    const isModerator = currentMember.role === MemberRole.MODERATOR;
    const isOwner = currentMember.role === member.role;
    const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
    const canEditMessage = !deleted && isOwner && !fileType;
    const isPDF = fileType === 'pdf' && fileUrl;
    const isImage = !isPDF && fileUrl;
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const { onOpen } = useModal();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: content,
        },
    });

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsEditing(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        form.reset({
            content: content,
        });
    }, [content]);

    const isLoading = form.formState.isLoading;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `${socketUrl}/${id}`,
                query: socketQuery,
            });
            await axios.patch(url, values);
            form.reset();
            setIsEditing(false);
            toast({
                description: 'Message has been edited.',
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full ">
            <div className="group flex gap-x-2 items-start w-full ">
                <div className="cursor-pointer hover:drop-shadow-md transition ">
                    <UserAvatar src={member.profile.imageUrl} />
                </div>
                <div className="flex flex-col w-full ">
                    <div className="flex items-center gap-x-2 ">
                        <div className="flex items-center ">
                            <p className="font-semibold text-sm hover:underline cursor-pointer">
                                {member.profile.name}
                            </p>
                            <ActionTooltip label={member.role}>
                                {roleIconMap[member.role]}
                            </ActionTooltip>
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {timestamp}
                        </span>
                    </div>
                    {isImage && (
                        <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative aspect-square rounded-sm mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
                        >
                            <Image
                                src={fileUrl}
                                alt={content}
                                fill
                                className="object-cover"
                            />
                        </a>
                    )}
                    {isPDF && (
                        <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10 ">
                            <FileIcon className="h-10 w-10 fill-indigo-300 stroke-indigo-500 " />
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-sm text-indigo-600 dark:text-indigo-300 hover:underline "
                            >
                                PDF File
                            </a>
                        </div>
                    )}
                    {!fileUrl && !isEditing && (
                        <p
                            className={cn(
                                'text-sm text-zinc-600 dark:text-zinc-300',
                                deleted &&
                                    'italic text-zinc-500 dark:text-zinc-400 text-xs mt-l '
                            )}
                        >
                            {content}
                            {isUpdated && !deleted && (
                                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400 ">
                                    (edited)
                                </span>
                            )}
                        </p>
                    )}
                    {!fileUrl && isEditing && (
                        <Form {...form}>
                            <form
                                className="flex items-center w-full gap-x-2 pt-2"
                                onSubmit={form.handleSubmit(onSubmit)}
                            >
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <div className="relative w-full ">
                                                    <Input
                                                        disabled={isLoading}
                                                        className="p-2 bg-zinc-900/20 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0
                                                        focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200 
                                                    "
                                                        placeholder="Edited Message"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    size="sm"
                                    variant="primary"
                                    className="bg-indigo-600"
                                    disabled={isLoading}
                                >
                                    Save
                                </Button>
                            </form>
                            <span className="text-[11px] mt-1 text-zinc-400">
                                Press escape to cancel, enter to save.
                            </span>
                        </Form>
                    )}
                </div>
            </div>
            {canDeleteMessage && !isEditing && (
                <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 =top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
                    {canEditMessage && !isEditing && (
                        <ActionTooltip label="Edit">
                            <Edit
                                onClick={() => setIsEditing(true)}
                                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                            />
                        </ActionTooltip>
                    )}
                    <ActionTooltip label="Delete">
                        <Trash
                            onClick={() =>
                                onOpen('deleteMessage', {
                                    apiUrl: `${socketUrl}/${id}`,
                                    query: socketQuery,
                                    content,
                                })
                            }
                            className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                        />
                    </ActionTooltip>
                </div>
            )}
        </div>
    );
}

export default ChatItem;
