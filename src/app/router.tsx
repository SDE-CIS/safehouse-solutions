import { useMemo } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { paths } from '@/config/paths';
import { MainLayout } from '@/components/layout/main';
import { Error } from '@/components/ui/error';
import { DashboardRoot, DashboardRootErrorBoundary } from "@/app/routes/dashboard/Root";
import { useTranslation } from "react-i18next";
import RequireAuth from '@/RequireAuth';

const AppRoot = () => (
    <MainLayout>
        <Outlet />
    </MainLayout>
);

const AppRootErrorBoundary = () => {
    const { t } = useTranslation();

    return (
        <Error title={t('error')}
            text={t('error2')} />
    );
};

function newRoute(path: string, route: string, routeImport: () => Promise<any>) {
    return {
        path,
        lazy: async () => {
            const { [route]: Component } = await routeImport();
            return {
                Component,
            };
        },
        ErrorBoundary: AppRootErrorBoundary,
    };
}

export const createAppRouter = () =>
    createBrowserRouter([
        {
            path: '/',
            element: <AppRoot />,
            ErrorBoundary: AppRootErrorBoundary,
            children: [
                newRoute(paths.home.path, 'LandingRoute', () => import('./routes/landing')),
                newRoute(paths.auth.register.path, 'RegisterRoute', () => import('./routes/auth/register')),
                newRoute(paths.auth.login.path, 'LoginRoute', () => import('./routes/auth/login')),
                newRoute(paths.contact_us.path, "ContactUsRoute", () => import('./routes/contact-us')),
                newRoute(paths.privacy_policy.path, 'PrivacyPolicyRoute', () => import('./routes/privacy-policy'))
            ],
        },
        {
            path: paths.dashboard.root.path,
            element: <RequireAuth><DashboardRoot /></RequireAuth>,
            ErrorBoundary: DashboardRootErrorBoundary,
            children: [
                newRoute(paths.dashboard.overview.path, 'OverviewRoute', () => import('./routes/dashboard/Overview')),
                newRoute(paths.dashboard.access.keycards.path, 'KeycardsRoute', () => import('./routes/dashboard/Access/Keycards')),
                newRoute(paths.dashboard.access.locks.path, 'LocksRoute', () => import('./routes/dashboard/Access/Locks')),
                newRoute(paths.dashboard.access.logs.path, 'AccessLogsRoute', () => import('./routes/dashboard/Access/AccessLog')),
                newRoute(paths.dashboard.food.path, 'FoodRoute', () => import('./routes/dashboard/Food')),
                newRoute(paths.dashboard.todo.path, 'TodoRoute', () => import('./routes/dashboard/Todo')),
                newRoute(paths.dashboard.users.path, 'UsersRoute', () => import('./routes/dashboard/User/Users')),
                newRoute(paths.dashboard.user.path, 'UserRoute', () => import('./routes/dashboard/User/User')),
                newRoute(paths.dashboard.video.live.path, 'LiveRoute', () => import('./routes/dashboard/Video/Live')),
                newRoute(paths.dashboard.video.livePreview.path, 'LivePreviewRoute', () => import('./routes/dashboard/Video/LivePreview')),
                newRoute(paths.dashboard.video.detections.path, 'CameraDetectionsRoute', () => import('./routes/dashboard/Video/CameraDetections')),
                newRoute(paths.dashboard.video.archive.path, 'ArchiveRoute', () => import('./routes/dashboard/Video/Archive')),
                newRoute(paths.dashboard.video.archivePreview.path, 'ArchivePreviewRoute', () => import('./routes/dashboard/Video/ArchivePreview')),
                newRoute(paths.dashboard.devices.path, 'DevicesRoute', () => import('./routes/dashboard/Devices')),
                newRoute(paths.dashboard.locations.path, 'LocationsRoute', () => import('./routes/dashboard/Locations'))
            ]
        },
        newRoute('*', 'NotFoundRoute', () => import('./routes/not-found')),
    ]);

export const AppRouter = () => {
    const router = useMemo(() => createAppRouter(), []);

    return <RouterProvider router={router} />;
};
