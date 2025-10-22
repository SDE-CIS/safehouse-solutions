import { PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectCurrentAccessToken } from '@/services/login';
import { paths } from '@/config/paths';

export default function RequireAuth({ children }: PropsWithChildren) {
    const token = useSelector(selectCurrentAccessToken);
    const location = useLocation();

    if (!token) {
        return (
            <Navigate
                to={paths.auth.login.path}
                replace
                state={{ from: location }}
            />
        );
    }

    return <>{children}</>;
}
