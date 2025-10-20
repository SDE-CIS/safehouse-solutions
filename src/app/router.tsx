import { useMemo } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { paths } from '@/config/paths';
import { MainLayout } from '@/components/layout/main';
import { Error } from '@/components/ui/error';
import { DashboardRoot, DashboardRootErrorBoundary } from "@/app/routes/dashboard/root.tsx";
import { useTranslation } from "react-i18next";

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

export const createAppRouter = () =>
    createBrowserRouter([
        {
            path: '/',
            element: <AppRoot />,
            ErrorBoundary: AppRootErrorBoundary,
            children: [
                {
                    path: paths.home.path,
                    lazy: async () => {
                        const { LandingRoute } = await import('./routes/landing');
                        return { Component: LandingRoute };
                    },
                },
                {
                    path: paths.auth.register.path,
                    lazy: async () => {
                        const { RegisterRoute } = await import('./routes/auth/register');
                        return { Component: RegisterRoute };
                    },
                },
                {
                    path: paths.auth.login.path,
                    lazy: async () => {
                        const { LoginRoute } = await import('./routes/auth/login');
                        return { Component: LoginRoute };
                    },
                },
                {
                    path: paths.contact_us.path,
                    lazy: async () => {
                        const { ContactUsRoute } = await import('./routes/contact-us');
                        return { Component: ContactUsRoute };
                    },
                },
            ],
        },
        {
            path: paths.dashboard.root.path,
            element: <DashboardRoot />,
            ErrorBoundary: DashboardRootErrorBoundary,
            children: [
                {
                    path: paths.dashboard.overview.path,
                    lazy: async () => {
                        const { OverviewRoute } = await import('./routes/dashboard/overview');
                        return {
                            Component: OverviewRoute,
                        };
                    },
                    ErrorBoundary: AppRootErrorBoundary,
                },
                {
                    path: paths.dashboard.cameras.path,
                    lazy: async () => {
                        const { CamerasRoute } = await import('./routes/dashboard/cameras/cameras');
                        return {
                            Component: CamerasRoute,
                        };
                    },
                    ErrorBoundary: AppRootErrorBoundary,
                },
                {
                    path: paths.dashboard.camera.path,
                    lazy: async () => {
                        const { CameraRoute } = await import('./routes/dashboard/cameras/camera');
                        return {
                            Component: CameraRoute,
                        };
                    },
                    ErrorBoundary: AppRootErrorBoundary,
                },
                {
                    path: paths.dashboard.keycards.path,
                    lazy: async () => {
                        const { KeycardsRoute } = await import('./routes/dashboard/keycards/keycards');
                        return {
                            Component: KeycardsRoute,
                        };
                    },
                    ErrorBoundary: AppRootErrorBoundary,
                },
                {
                    path: paths.dashboard.keycard.path,
                    lazy: async () => {
                        const { KeycardRoute } = await import('./routes/dashboard/keycards/keycard');
                        return {
                            Component: KeycardRoute,
                        };
                    },
                    ErrorBoundary: AppRootErrorBoundary,
                },
            ]
        },
        {
            path: '*',
            lazy: async () => {
                const { NotFoundRoute } = await import('./routes/not-found');
                return {
                    Component: NotFoundRoute,
                };
            },
            ErrorBoundary: DashboardRootErrorBoundary,
        },
    ]);

export const AppRouter = () => {
    const router = useMemo(() => createAppRouter(), []);

    return <RouterProvider router={router} />;
};
