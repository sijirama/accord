'use client';

import { useEffect, useState } from 'react';
import CreateServerModal from '../custom/modals/create-server-modal';
import InviteModal from '../custom/modals/invite-modal';
import EditServerModal from '../custom/modals/edit-server-modal ';
import MemberModal from '../custom/modals/members-modal';
import CreateChannelModal from '../custom/modals/create-channel-modal';
import LeaveServerModal from '../custom/modals/leave-modal';
import DeleteServerModal from '../custom/modals/delete-server';

export function ModalProvider() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <CreateServerModal />
            <InviteModal />
            <EditServerModal />
            <MemberModal />
            <CreateChannelModal />
            <LeaveServerModal />
            <DeleteServerModal />
        </>
    );
}
