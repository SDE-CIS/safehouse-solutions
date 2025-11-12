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
        video: {
            label: 'Video',
            path: '/dashboard/videos',
            getHref: (filename: string) => `/dashboard/videos/${filename}`,

            live: {
                label: 'Live',
                path: '/dashboard/videos/live',
                getHref: () => '/dashboard/videos/live',
            },

            livePreview: {
                label: 'Stream',
                hidden: true,
                path: '/dashboard/videos/live/:cameraId',
                getHref: (cameraId: string) => `/dashboard/videos/live/${cameraId}`,
            },

            detections: {
                label: 'Detections',
                path: '/dashboard/videos/camera-detections',
                getHref: () => '/dashboard/videos/camera-detections',
            },

            archive: {
                label: 'Archive',
                path: '/dashboard/videos/archive',
                getHref: () => '/dashboard/videos/archive',
            },

            archivePreview: {
                label: 'Archive Preview',
                hidden: true,
                path: '/dashboard/videos/archive/:filename',
                getHref: (filename: string) => `/dashboard/videos/archive/${filename}`,
            },
        },
        access: {
            label: 'Access',
            path: '/dashboard/access',
            getHref: () => '/dashboard/access',

            keycards: {
                label: 'Keycards',
                path: '/dashboard/keycards',
                getHref: () => '/dashboard/keycards',
            },
            logs: {
                label: 'Logs',
                path: '/dashboard/access-logs',
                getHref: () => '/dashboard/access-logs',
            },
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
