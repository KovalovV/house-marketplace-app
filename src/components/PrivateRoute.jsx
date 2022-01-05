import { Navigate, Outlet } from 'react-router-dom';

import { useAuthStatus } from '../hooks/useAuthStatus';

import Spinner from './Spiner';

const PrivateRoute = () => {
    const { loggedIn, checkingAuthStatus } = useAuthStatus();

    if(checkingAuthStatus) {
        return <Spinner />;
    }

    return loggedIn ? <Outlet /> : <Navigate to='/sign-in'/>;
};

export default PrivateRoute;
