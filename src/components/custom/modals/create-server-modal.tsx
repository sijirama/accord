'use client';

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

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileUpload } from '../fileUpload';
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';
import { toast } from '@/components/ui/use-toast';

const formSchema = z.object({
    name: z.string().min(3, {
        message: 'Server name is required',
    }),
    imageUrl: z.string().min(1, {
        message: 'Server name is required',
    }),
});

export default function CreateServerModal() {
    const { isOpen, onClose, type } = useModal(); // hook to handle modal management with zustand
    const isModalOpen = isOpen && type === 'createServer'; // is it open ? is to create a server ?

    const router = useRouter(); // initialize router

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: 'Octavius The Server',
            imageUrl: ' ',
        },
    });

    const loading = form.formState.isSubmitting; // while the form is submitting

    const onSubmit = async (
        // what happens when we submit our create server form
        values: z.infer<typeof formSchema>
    ) => {
        console.log(values);
        try {
            if (!values.name || !values.imageUrl) {
                toast({
                    description: 'Something is missging from your input.',
                });
                return;
            }
            await axios.post('/api/servers', values);
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
                    <DialogTitle>Customize your server Anon!</DialogTitle>
                    <DialogDescription>
                        Give your server a personality with a name and an image,
                        you can always change it later.
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
                                name="imageUrl"
                                render={({ field }) => (
                                    <FormItem className="flex justify-center">
                                        <FormControl className=" ">
                                            <FileUpload
                                                endpoint="serverImage"
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-slate-700 dark:text-slate-100">
                                            Server name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder="Enter server name."
                                                className="bg-zinc-300/10 border-0 focus-visible:ring-0 text-black dark:text-slate-200 font-semibold focus-visible:ring-offset-0"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="font-semibold text-red-500" />
                                    </FormItem>
                                )}
                            ></FormField>
                        </div>
                        <DialogFooter>
                            <Button className="font-bold" variant="primary">
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
