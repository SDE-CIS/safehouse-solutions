import {Error} from "@/components/ui/error.tsx";
import {Outlet} from "react-router-dom";
import {DashboardLayout} from "@/components/layout/dashboard.tsx";
import {useTranslation} from "react-i18next";

export function DashboardRoot() {
    return (
        <DashboardLayout>
            <Outlet/>
        </DashboardLayout>
    );
}

export const DashboardRootErrorBoundary = () => {
    const {t} = useTranslation();

    return (
        <DashboardLayout>
            <Error title={t('error')} text={t('error2')}/>
        </DashboardLayout>
    );
};
