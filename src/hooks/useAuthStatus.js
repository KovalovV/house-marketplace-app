import { useEffect, useState, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const useAuthStatus = () => {
    const [loggedIn, setloggedIn] = useState(false);
    const [checkingAuthStatus, setCheckingAuthStatus] = useState(true);
    const isMounted = useRef(true);

    useEffect(() => {
        if (isMounted) {
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setloggedIn(true);
                }
                setCheckingAuthStatus(false);
            });
        }
        return () => {
            isMounted.current = false;
        }
    }, [isMounted]);

    return { loggedIn, checkingAuthStatus };
};