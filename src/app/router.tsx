import { useMemo } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { paths } from '@/config/paths';
import { MainLayout } from '@/components/layout/main';
import { Error } from '@/components/ui/error';
import { DashboardRoot, DashboardRootErrorBoundary } from "@/app/routes/dashboard/root.tsx";
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
                newRoute(paths.dashboard.overview.path, 'OverviewRoute', () => import('./routes/dashboard/overview')),
                newRoute(paths.dashboard.access.keycards.path, 'KeycardsRoute', () => import('./routes/dashboard/Access/Keycards')),
                newRoute(paths.dashboard.access.logs.path, 'AccessLogsRoute', () => import('./routes/dashboard/Access/AccessLog')),
                newRoute(paths.dashboard.food.path, 'FoodRoute', () => import('./routes/dashboard/food')),
                newRoute(paths.dashboard.todo.path, 'TodoRoute', () => import('./routes/dashboard/todo')),
                newRoute(paths.dashboard.users.path, 'UsersRoute', () => import('./routes/dashboard/users/users')),
                newRoute(paths.dashboard.user.path, 'UserRoute', () => import('./routes/dashboard/users/user')),
                newRoute(paths.dashboard.video.live.path, 'LiveRoute', () => import('./routes/dashboard/Video/Live')),
                newRoute(paths.dashboard.video.livePreview.path, 'LivePreviewRoute', () => import('./routes/dashboard/Video/LivePreview')),
                newRoute(paths.dashboard.video.archive.path, 'VideosRoute', () => import('./routes/dashboard/videos/VideosRoute')),
                newRoute(paths.dashboard.video.archivePreview.path, 'VideoStreamRoute', () => import('./routes/dashboard/videos/VideoStreamRoute')),
            ]
        },
        newRoute('*', 'NotFoundRoute', () => import('./routes/not-found')),
    ]);

export const AppRouter = () => {
    const router = useMemo(() => createAppRouter(), []);

    return <RouterProvider router={router} />;
};
