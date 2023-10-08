//'use client';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-modal-store';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, Copy, RefreshCcw } from 'lucide-react';
import { useOrigin } from '@/hooks/use-origin';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';

export default function InviteModal() {
    const { isOpen, onClose, type, data, onOpen } =
        useModal(); // hook to handle modal management with zustand
    const isModalOpen = isOpen && type === 'invite'; // is it open ? is to create a server ?

    const origin = useOrigin();
    const { server } = data;
    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);
        toast({
            description:
                'Invite has been copied to clipboard',
        });
        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    const onNew = async () => {
        try {
            setLoading(true);
            const response = await axios.patch(
                `/api/servers/${server?.id}/invite-code`
            );
            toast({
                description:
                    'New server invite has been created Anon.',
            });
            onOpen('invite', { server: response.data });
        } catch (error) {
            console.log(
                error,
                ': Error caught on onNew hook in invite modal.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-50 overflow-hidden">
                <DialogHeader>
                    <DialogTitle>Invite Incels</DialogTitle>
                    <DialogDescription>
                        Oh Anon, your server is completely
                        useless until you have some people
                        in it, Rise up and send some
                        invites!
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <Label className="text-sx bold text-zinc-400 ">
                        Server Invite Link
                    </Label>
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input
                            readOnly
                            disabled={loading}
                            className="bg-zinc-300/50 border-0 
                            focus-visible:ring-0 text-black 
                            focus-visible:ring-offset-0"
                            value={inviteUrl}
                        />
                        <Button
                            onClick={onCopy}
                            disabled={loading}
                        >
                            {copied ? <Check /> : <Copy />}
                        </Button>
                    </div>
                    <Button
                        onClick={onNew}
                        disabled={loading}
                        className="text-xs text-zinc-500 mt-4 "
                        size="sm"
                        variant="link"
                    >
                        Generate a new link.
                        <RefreshCcw className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
