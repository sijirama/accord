import { redirect } from 'next/navigation'
import { currentProfile } from '@/lib/current-profile'
import React from 'react'
import { db } from '@/lib/db'

export default async function NavigationSidebar() {
    const profile = await currentProfile()
    if (!profile) {
        redirect("/")
    }
    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })
    return (
        <div className='space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-slate-900 py-3'>NavigationSidebar</div>
    )
}
