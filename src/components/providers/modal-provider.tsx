'use client';

import { useEffect, useState } from 'react';
import CreateServerModal from '../custom/modals/create-server-modal';
import InviteModal from '../custom/modals/invite-modal';
import EditServerModal from '../custom/modals/edit-server-modal ';

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
        </>
    );
}
