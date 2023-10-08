import { currentProfile } from '@/lib/current-profile';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';
import { toast } from '@/components/ui/use-toast';
import { db } from '@/lib/db';

interface InviteCodePageProps {
    params: {
        inviteCode: string;
    };
}

async function page({ params }: InviteCodePageProps) {
    const profile = await currentProfile();
    if (!profile) {
        toast({
            description: 'You are unauthorized',
        });
        return redirectToSignIn();
    }
    if (!params.inviteCode) {
        toast({
            description: 'Invite code not available',
        });
        return redirect('/');
    }
    const existingserver = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    });

    if (existingserver) {
        return redirect(`/servers/${existingserver.id}`);
    }

    const server = await db.server.update({
        where: {
            inviteCode: params.inviteCode,
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id,
                    },
                ],
            },
        },
    });
    return <div>Hello Invite</div>;
}

export default page;
