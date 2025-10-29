import { Path } from "@/types/path.ts";

export const paths: Record<string, Path> = {
    home: {
        label: 'Home',
        path: '/',
        getHref: () => '/',
    },

    auth: {
        hidden: true,
        register: {
            path: '/auth/register',
            getHref: (redirectTo?: string | null | undefined) =>
                `/auth/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
        },
        login: {
            path: '/auth/login',
            getHref: (redirectTo?: string | null | undefined) =>
                `/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
        },
    },

    contact_us: {
        label: 'Contact Us',
        path: '/contact-us',
        getHref: () => '/contact-us',
    },

    privacy_policy: {
        hidden: true,
        label: 'Privacy Policy',
        path: '/privacy-policy',
        getHref: () => '/privacy-policy',
    },

    dashboard: {
        hidden: true,
        root: {
            hidden: true,
            label: 'App',
            path: '/dashboard',
            getHref: () => '/dashboard',
        },
        overview: {
            label: 'Dashboard',
            path: '',
            getHref: () => '/dashboard',
        },
        cameras: {
            label: 'Cameras',
            path: '/dashboard/cameras',
            getHref: () => '/dashboard/cameras',
        },
        camera: {
            label: 'Camera View',
            hidden: true,
            path: '/dashboard/cameras/:cameraId',
            getHref: (id: string) => `/dashboard/cameras/${id}`,
        },
        videos: {
            label: 'Videos',
            path: '/dashboard/videos',
            getHref: () => '/dashboard/videos',
        },
        video: {
            label: 'Video Stream',
            hidden: true,
            path: '/dashboard/videos/:filename',
            getHref: (filename: string) => `/dashboard/videos/${filename}`,
        },
        keycards: {
            label: 'Keycards',
            path: '/dashboard/keycards',
            getHref: () => '/dashboard/keycards',
        },
        food: {
            label: 'Food',
            path: '/dashboard/food',
            getHref: () => '/dashboard/food',
        },
        todo: {
            label: 'Todo',
            path: '/dashboard/todo',
            getHref: () => '/dashboard/todo',
        },
        users: {
            label: 'Users',
            hidden: true,
            path: '/dashboard/users',
            getHref: () => '/dashboard/users',
        },
        user: {
            label: 'User View',
            hidden: true,
            path: '/dashboard/users/:id',
            getHref: (id: string) => `/dashboard/users/${id}`,
        },
    }
} as const;
