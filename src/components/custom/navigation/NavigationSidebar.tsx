import { redirect } from 'next/navigation';
import { currentProfile } from '@/lib/current-profile';
import React from 'react';
import { db } from '@/lib/db';
import { NavigationAction } from './NavigationAction';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import NavigationItem from './NavigationItem';
import { ModeToggle } from '../theme-toggle';
import { UserButton } from '@clerk/nextjs';

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
            <ScrollArea className="flex-1 w-full ">
                {servers.map(server => (
                    <NavigationItem
                        key={server.id}
                        id={server.id}
                        imageUrl={server.imageurl}
                        name={server.name}
                    />
                ))}
            </ScrollArea>
            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                <ModeToggle />
                <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                        elements: {
                            avatarBox: 'h-[48px] w-[48px] ',
                        },
                    }}
                />
            </div>
        </div>
    );
}
