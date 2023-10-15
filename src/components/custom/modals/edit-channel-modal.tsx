'use client';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import qs from 'query-string';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';
import { toast } from '@/components/ui/use-toast';
import { ChannelType } from '@prisma/client';
import { useEffect } from 'react';

const formSchema = z.object({
    name: z
        .string()
        .min(3, {
            message: 'Server name is required',
        })
        .refine(name => name.toLowerCase() !== 'general', {
            message: 'Channel name cannot be "general"',
        }),
    type: z.nativeEnum(ChannelType),
});

export default function EditChannelModal() {
    const { isOpen, onClose, type, data } = useModal(); // hook to handle modal management with zustand
    const isModalOpen = isOpen && type === 'editChannel'; // is it open ? is to create a server ?

    const router = useRouter(); // initialize router
    const params = useParams();
    const { channel, server } = data;

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            type: channel?.type || ChannelType.TEXT,
        },
    });

    useEffect(() => {
        if (channel) {
            form.setValue('name', channel.name);
            form.setValue('type', channel.type);
        }
    }, [form, channel]);

    const loading = form.formState.isSubmitting; // while the form is submitting

    const onSubmit = async (
        // what happens when we submit our edit channel form
        values: z.infer<typeof formSchema>
    ) => {
        console.log(values);
        try {
            if (!values.name) {
                toast({
                    description: 'Something is missging from your input.',
                });
                return;
            }
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id,
                },
            });
            await axios.patch(url, values);
            form.reset();
            router.refresh();
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    const handleClose = () => {
        // what happens when the modal closes
        form.reset();
        onClose();
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-50 overflow-hidden">
                <DialogHeader>
                    <DialogTitle>Edit Channel</DialogTitle>
                    <DialogDescription>
                        Edit your channel Anon!
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-5 w-full "
                    >
                        <div className="space-y-5">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-slate-700 dark:text-slate-100">
                                            Channel name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder="Enter channel name."
                                                className="bg-zinc-300/10 border-0 focus-visible:ring-0 text-black dark:text-slate-200 font-semibold focus-visible:ring-offset-0"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="font-semibold text-red-500" />
                                    </FormItem>
                                )}
                            ></FormField>
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-slate-700 dark:text-slate-100">
                                            Channel Type
                                        </FormLabel>
                                        <Select
                                            disabled={loading}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-zinc-300/10 border-0 focus:ring-0 ring-offset-0 focus:ring-offset-0 capitalize outline-none text-black dark:text-slate-200 font-semibold focus-visible:ring-offset-0">
                                                    <SelectValue placeholder="Select a type for your new channel" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(ChannelType).map(
                                                    type => (
                                                        <SelectItem
                                                            key={type}
                                                            value={type}
                                                            className="capitalize"
                                                        >
                                                            {type.toLowerCase()}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button className="font-bold" variant="primary">
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
