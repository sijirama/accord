import { getAuth } from '@clerk/nextjs/server';

import { db } from './db';
import { toast } from '@/components/ui/use-toast';
import { NextApiRequest } from 'next';

export const currentProfilePages = async (req: NextApiRequest) => {
    const { userId } = getAuth(req);
    if (!userId) {
        return null;
    }
    let profile;
    try {
        profile = await db.profile.findUnique({
            where: {
                userId,
            },
        });
    } catch (error) {
        console.error(error, ': Error in Current Profile Function!');
    }

    if (!profile) {
        toast({
            description: 'No current profile found',
        });
    }
    return profile;
};
