'use client'

import { useEffect } from 'react';
import useGlobalState from './globalState';
import { onUserAuthStateChange } from '@/lib/firebase/database/index';

export default function AuthProvider() {
    const { setUser } = useGlobalState();

    useEffect(() => {
        const unsubscribe = onUserAuthStateChange((currentUser) => {
            setUser(currentUser || null);
        });

        return () => unsubscribe();
    }, []);

    return null; // no UI, just logic
}
