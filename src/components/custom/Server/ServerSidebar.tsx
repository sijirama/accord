import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { ChannelType } from '@prisma/client';
import { redirect } from 'next/navigation';
import React from 'react';
import ServerHeader from './ServerHeader';

interface Props {
    serverId: string;
}

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
    const role = server.members.find(
        member => member.profileId === profile.id
    )?.role;

    return (
        <nav className="flex flex-col w-full h-full text-primary dark:bg-slate-900 bg-slate-400">
            <ServerHeader server={server} role={role} />
        </nav>
    );
}

export default ServerSidebar;
