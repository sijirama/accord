import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';

interface ServerIdPageProps {
    params: {
        serverId: string;
    };
}

export default async function ServerPage({ params }: ServerIdPageProps) {
    const profile = await currentProfile();

    if (!profile) {
        return redirectToSignIn();
    }
    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
            members: {
                some: {
                    profileId: profile?.id,
                },
            },
        },
        include: {
            channels: {
                where: {
                    name: 'general',
                },
                orderBy: {
                    createdAt: 'asc',
                },
            },
        },
    });
    const initialChannel = server?.channels[0];
    // if (initialChannel?.name === 'general') {
    //     return null;
    // }
    return redirect(
        `/server/${params.serverId}/channels/${initialChannel?.id}`
    );
}
