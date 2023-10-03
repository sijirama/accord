import { redirect } from 'next/navigation';
import { currentProfile } from '@/lib/current-profile';
import React from 'react';
import { db } from '@/lib/db';
import { NavigationAction } from './NavigationAction';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import NavigationItem from './NavigationItem';

export default async function NavigationSidebar() {
    const profile = await currentProfile();

    if (!profile) {
        redirect('/');
    }

    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    });

    return (
        <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-slate-800 py-3">
            <NavigationAction />
            <Separator className="h-[2px] bg-slate-800 dark:bg-slate-500 rounded-md w-12 mx-auto" />
            <ScrollArea>
                {servers.map(server => (
                    <NavigationItem
                        id={server.id}
                        imageUrl={server.imageurl}
                        name={server.name}
                    />
                ))}
            </ScrollArea>
        </div>
    );
}
