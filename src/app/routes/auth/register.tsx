import {Error} from '@/components/ui/error';
import {useTranslation} from "react-i18next";

export function RegisterRoute() {
    const { t } = useTranslation();

    return (
        <Error title={t('auth.error')} text={t('auth.error2')} />
    );
}
