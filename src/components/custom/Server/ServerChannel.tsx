'use client';
import { Channel, MemberRole, Server } from '@prisma/client';
import React from 'react';

interface ServerChannelProps {
    channel: Channel;
    server: Server;
    role?: MemberRole;
}

function ServerChannel({ channel, server, role }: ServerChannelProps) {
    return <div>ServerChannel</div>;
}

export default ServerChannel;
