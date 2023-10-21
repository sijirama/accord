'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import qs from 'query-string';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileUpload } from '../fileUpload';
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';

const formSchema = z.object({
    fileUrl: z.string().min(1, {
        message: 'Server name is required',
    }),
});

export default function MemberFIleModal() {
    const { isOpen, onClose, type, data } = useModal();
    const { apiUrl, query } = data;
    const router = useRouter();
    const isModalOpen = isOpen && type === 'messageFile';
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: ' ',
        },
    });

    const loading = form.formState.isSubmitting;
    const handleClose = () => {
        form.reset();
        onClose();
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        try {
            const url = qs.stringifyUrl({
                url: apiUrl || '',
                query,
            });
            await axios.post(url, {
                ...values,
                content: values.fileUrl,
            });
            form.reset();
            router.refresh();
            handleClose();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-50 overflow-hidden">
                <DialogHeader>
                    <DialogTitle>Add an attachment!</DialogTitle>
                    <DialogDescription>
                        Send a file as a message
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
                                name="fileUrl"
                                render={({ field }) => (
                                    <FormItem className="flex justify-center">
                                        <FormControl className=" ">
                                            <FileUpload
                                                endpoint="messageFile"
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button className="font-bold" variant="primary">
                                Send
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
