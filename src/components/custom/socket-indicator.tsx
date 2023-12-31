'use client';

import React from 'react';
import { useSocket } from '../providers/socket-provider';
import { Badge } from '@/components/ui/badge';

function SocketIndicator() {
    const { isConnected } = useSocket();

    if (!isConnected) {
        return (
            <Badge
                variant="outline"
                className="bg-yellow-600 text-white border-none font-semibold"
            >
                Fallback: Polling every 1s
            </Badge>
        );
    }

    return (
        <Badge
            variant="outline"
            className="bg-emerald-600 text-white border-none  font-semibold"
        >
            Live: Real-time updates
        </Badge>
    );
}

export default SocketIndicator;
