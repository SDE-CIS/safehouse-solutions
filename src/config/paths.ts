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
        security: {
            label: 'Security',
            path: '/dashboard/security',
            getHref: () => '/dashboard/security',
        },
        pim: {
            label: 'PIM',
            path: '/dashboard/pim',
            getHref: () => '/dashboard/pim',
        },
        users: {
            label: 'Users',
            path: '/dashboard/users',
            getHref: () => '/dashboard/users',
        },
        user: {
            hidden: true,
            label: 'User View',
            path: '/dashboard/users/:userId',
            getHref: (id: string) => `/app/discussions/${id}`,
        },
        keycards: {
            label: 'Keycards',
            path: '/dashboard/keycards',
            getHref: () => '/dashboard/keycards',
        },
        keycard: {
            hidden: true,
            label: 'Keycard View',
            path: '/dashboard/keycards/:keycardId',
            getHref: (id: string) => `/dashboard/keycards/${id}`,
        }
    }
} as const;
