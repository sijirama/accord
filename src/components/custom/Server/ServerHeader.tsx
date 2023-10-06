import React from 'react';
import { ServerWithMemberWithProfiles } from '@/types';
import { MemberRole } from '@prisma/client';

function ServerHeader({
    server,
    role
}: {
    server: ServerWithMemberWithProfiles;
    role?:MemberRole
}) {
    return <div>ServerHeader</div>;
}

export default ServerHeader;
