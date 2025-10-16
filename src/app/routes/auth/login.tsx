import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {selectCurrentAccessToken} from '@/services/login';
import {useNavigate} from 'react-router-dom';
import {LoginForm} from "@/components/ui/login-form.tsx";

export function LoginRoute() {
    const navigate = useNavigate();
    const accessToken = useSelector(selectCurrentAccessToken);

    useEffect(() => {
        if (!accessToken) {
            return;
        }

        navigate('/dashboard');
    }, [accessToken, navigate]);

    return (
        <LoginForm/>
    );
}
