import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { ChannelType, MemberRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import React from 'react';
import ServerHeader from './ServerHeader';
import { ScrollArea } from '@/components/ui/scroll-area';
import ServerSearch from './ServerSearch';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';

interface Props {
    serverId: string;
}

const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: (
        <ShieldCheck className="h-4 w-4 ml-2 text-indigo-800" />
    ),
    [MemberRole.ADMIN]: (
        <ShieldAlert className="h-4 w-4 ml-2 text-indigo-800" />
    ),
};

async function ServerSidebar({ serverId }: Props) {
    const profile = await currentProfile();
    if (!profile) {
        return redirectToSignIn();
    }
    const server = await db.server.findUnique({
        where: {
            id: serverId,
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: 'asc',
                },
            },
            members: {
                include: {
                    profile: true,
                },
                orderBy: {
                    role: 'asc',
                },
            },
        },
    });

    if (!server) {
        return redirect('/');
    }

    const textChannels = server.channels.filter(
        channel => channel.type === ChannelType.TEXT
    );
    const audioChannels = server.channels.filter(
        channel => channel.type === ChannelType.AUDIO
    );
    const videoChannels = server.channels.filter(
        channel => channel.type === ChannelType.VIDEO
    );
    const members = server.members.filter(
        member => member.profileId !== profile.id
    );
    const role = server.members.find(member => member.profileId === profile.id)
        ?.role;

    return (
        <nav className="flex flex-col w-full h-full text-primary dark:bg-slate-900 bg-slate-400">
            <ServerHeader server={server} role={role} />
            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                    <ServerSearch
                        data={[
                            {
                                label: 'Text Channels',
                                type: 'channel',
                                data: textChannels.map(channel => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                })),
                            },
                            {
                                label: 'Voice Channels',
                                type: 'channel',
                                data: audioChannels.map(channel => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                })),
                            },
                            {
                                label: 'Video Channels',
                                type: 'channel',
                                data: videoChannels.map(channel => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                })),
                            },
                            {
                                label: 'Members',
                                type: 'mmeber',
                                data: members.map(member => ({
                                    id: member.id,
                                    name: member.profile.name,
                                    icon: roleIconMap[member.role],
                                })),
                            },
                        ]}
                    />
                </div>
            </ScrollArea>
        </nav>
    );
}

export default ServerSidebar;
