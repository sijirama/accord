import React from 'react';
import { Hash } from 'lucide-react';
import MobileToggle from '../mobile-toggle';
import UserAvatar from '../UserAvatar';

interface ChatHeaderProps {
    serverId: string;
    name: string;
    type: 'channel' | 'conversation';
    image?: string;
}

function ChatHeader({ serverId, name, type, image }: ChatHeaderProps) {
    return (
        <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
            <MobileToggle serverId={serverId} />
            {type == 'channel' && (
                <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-1 " />
            )}
            {type === 'conversation' && (
                <UserAvatar
                    src={image}
                    className="h-8 w-8 md:h-8 md:w-8 mr-1"
                />
            )}
            <p className="font-semibold text-md text-black dark:text-white">
                {name}
            </p>
        </div>
    );
}

export default ChatHeader;
