'use client';

import { useEffect, useState } from 'react';
import CreateServerModal from '../custom/modals/create-server-modal';

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
        </>
    );
}
