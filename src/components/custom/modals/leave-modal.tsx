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
import { useRouter } from 'next/navigation';

export default function LeaveServerModal() {
    const { isOpen, onClose, type, data } = useModal(); // hook to handle modal management with zustand
    const isModalOpen = isOpen && type === 'leaveServer'; // is it open ? is to create a server ?
    const { server } = data;
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onConfirm = async () => {
        try {
            setLoading(true);
            await axios.patch(`/api/servers/${server?.id}/leave`);
            onClose();
            router.refresh();
            router.push('/');
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
                    <DialogTitle>Leave the server</DialogTitle>
                    <DialogDescription>
                        Do you really want to leave{' '}
                        <span className="font-semibold text-indigo-500">
                            {server?.name}
                        </span>{' '}
                        ?.
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
