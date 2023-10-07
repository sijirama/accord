import ServerSidebar from '@/components/custom/Server/ServerSidebar';
import { toast } from '@/components/ui/use-toast';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function ServerIdLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { serverId: string };
}) {
    const profile = await currentProfile();
    if (!profile) {
        toast({
            description: 'Failed to find profile.',
        });
        return redirectToSignIn();
    }
    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    });
    if (!server) {
        return redirect('/');
    }
    return (
        <main className="h-full flex">
            <section className="hidden  md:flex w-60 transition-all z-20 flex-col inset-y-0">
                <ServerSidebar serverId = {params.serverId} />
            </section>
            <section className="h-full flex-1 bg-slate-800">
                {children}
            </section>
        </main>
    );
}
