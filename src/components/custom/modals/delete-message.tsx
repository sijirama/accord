//'use client';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-modal-store';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
import qs from 'query-string';

export default function DeleteMessageModal() {
    const { isOpen, onClose, type, data } = useModal(); // hook to handle modal management with zustand
    const isModalOpen = isOpen && type === 'deleteMessage'; // is it open ? is to create a server ?
    const [loading, setLoading] = useState(false);

    const onConfirm = async () => {
        try {
            setLoading(true);
            const url = qs.stringifyUrl({
                url: data.apiUrl || '',
                query: data.query,
            });
            await axios.delete(url);
            onClose();
            toast({
                description: 'Message has been deleted',
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-50 overflow-hidden">
                <DialogHeader>
                    <DialogTitle>Delete Message</DialogTitle>
                    <DialogDescription>
                        Do you really want to delete this message?
                        <div className="font-semibold my-1 bg-zinc-900/60 py-2  text-indigo-500">
                            &quot;{data.content}&quot;
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex items-center justify-between w-full">
                        <Button
                            disabled={loading}
                            onClick={() => {}}
                            variant="ghost"
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={loading}
                            onClick={onConfirm}
                            variant="primary"
                        >
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
