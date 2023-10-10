//'use client';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-modal-store';
import { toast } from '@/components/ui/use-toast';
import { ServerWithMemberWithProfiles } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import UserAvatar from '../UserAvatar';
import {
    Check,
    Gavel,
    Loader2,
    MoreVertical,
    Shield,
    ShieldAlert,
    ShieldCheck,
    ShieldQuestion,
} from 'lucide-react';
import { useState } from 'react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MemberRole } from '@prisma/client';
import qs from 'query-string';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const roleIconMap = {
    GUEST: null,
    MODERTOR: <ShieldCheck className="h-5 w-5 ml-2 text-indigo-700" />,
    ADMIN: <ShieldAlert className="h-5 w-5 ml-2  text-rose-700" />,
};

export default function MemberModal() {
    const { isOpen, onClose, type, data, onOpen } = useModal(); // hook to handle modal management with zustand
    const isModalOpen = isOpen && type === 'members'; // is it open ? is to create a server ?
    const { server } = data as { server: ServerWithMemberWithProfiles };
    const router = useRouter();
    const [loadingId, setLoadingId] = useState('');

    const onRoleChange = async (memberId: string, role: MemberRole) => {
        try {
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server.id,
                    memberId,
                },
            });
            const response = await axios.patch(url, { role });
            router.refresh();
            onOpen('members', { server: response.data });
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingId('');
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-50 overflow-hidden">
                <DialogHeader>
                    <DialogTitle>Manage Members</DialogTitle>
                    <DialogDescription>
                        Oh Anon, i see you, you don't trust your server members,
                        well have a better look here.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <p className="capitalize my-2 md:my-4">
                        For starters, you have {server?.members?.length}{' '}
                        member(s) in this server.
                    </p>
                    <ScrollArea className="max-h-[420px] pr-6">
                        {server?.members.map(member => (
                            <div
                                key={member.id}
                                className="flex items-center gap-x-2 mb-6"
                            >
                                <UserAvatar src={member.profile.imageUrl} />
                                <div className="flex flex-col gap-y-1">
                                    <div className="text-xs font-bold flex items-center gap-x-1">
                                        {member.profile.name}
                                        {roleIconMap[member.role]}
                                    </div>
                                    <p className="text-xs text-zinc-400">
                                        {member.profile.email}
                                    </p>
                                </div>
                                {server.profileId !== member.profileId &&
                                    loadingId !== member.id && (
                                        <div className="ml-auto">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <MoreVertical className="h-4 w-4 text-zinc-400" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent side="left">
                                                    <DropdownMenuSub>
                                                        <DropdownMenuSubTrigger className="flex items-center">
                                                            <ShieldQuestion className="h-4 w-4 mr-2" />
                                                            <span>Role</span>
                                                        </DropdownMenuSubTrigger>
                                                        <DropdownMenuSubContent>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    onRoleChange(
                                                                        member.id,
                                                                        'GUEST'
                                                                    )
                                                                }
                                                            >
                                                                <Shield className="w-4 h-4 mr-2" />
                                                                Guest
                                                                {member.role ===
                                                                    'GUEST' && (
                                                                    <Check className="h-4 w-4 ml-auto" />
                                                                )}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    onRoleChange(
                                                                        member.id,
                                                                        'MODERTOR'
                                                                    )
                                                                }
                                                            >
                                                                <ShieldCheck className="w-4 h-4 mr-2" />
                                                                Moderator
                                                                {member.role ===
                                                                    'MODERTOR' && (
                                                                    <Check className="h-4 w-4 ml-auto" />
                                                                )}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuSub>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        <Gavel className="w-4 h-4 mr-2" />
                                                        Kick
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    )}
                                {loadingId === member.id && (
                                    <Loader2 className="animate-spin text-zinc-400 ml-auto w-4 h-4 " />
                                )}
                            </div>
                        ))}
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}
