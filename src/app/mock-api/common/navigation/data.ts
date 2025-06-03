/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'tickets',
        title: 'Tickets',
        subtitle: 'Unique dashboard designs',
        type: 'group',
        icon: 'heroicons_outline:home',
        roles: ['admin', 'pegawai'],
        children: [
            {
                id: 'dashboards.home',
                title: 'Home',
                type: 'basic',
                icon: 'heroicons_outline:home',
                link: '/dashboards/home',
                roles: ['admin', 'pegawai'],
            },
            {
                id: 'dashboards.products',
                title: 'Products',
                type: 'basic',
                icon: 'mat_outline:receipt_long',
                link: '/dashboards/products',
                roles: ['admin', 'pegawai'],
            },
            {
                id: 'dashboards.category',
                title: 'Category',
                type: 'basic',
                icon: 'category',
                link: '/dashboards/category',
                roles: ['admin', 'pegawai'],
            },
            {
                id: 'dashboards.tickets',
                title: 'Tickets',
                type: 'basic',
                icon: 'heroicons_outline:ticket',
                link: '/dashboards/tickets',
                roles: ['admin', 'pegawai'],
            },
            {
                id: 'dashboards.handover',
                title: 'Handover Tickets',
                type: 'basic',
                icon: 'swap_horiz',
                link: '/dashboards/handover',
                roles: ['admin', 'pegawai'],
            },
        ],
    },
    {
        id: 'report',
        title: 'Reports',
        subtitle: 'Custom made application designs',
        type: 'group',
        roles: ['admin'],
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'dashboards.analytics',
                title: 'Analytics',
                type: 'basic',
                icon: 'bar_chart',
                link: '/dashboards/analytics',
                roles: ['admin',]
            },
            {
                id: 'dashboards.export',
                title: 'Export',
                type: 'basic',
                icon: 'heroicons_outline:document-arrow-down',
                link: '/dashboards/export',
                roles: ['admin',]
            },
        ],
    },
    {
        id: 'users',
        title: 'Users',
        subtitle: 'Unique dashboard designs',
        type: 'group',
        icon: 'heroicons_outline:home',
        roles: ['admin'],
        children: [
            {
                id: 'dashboards.users',
                title: 'Users',
                type: 'basic',
                icon: 'heroicons_outline:user',
                link: '/dashboards/users',
                roles: ['admin'],
            },
            {
                id: 'dashboards.shift-timing',
                title: 'Shift Timing',
                type: 'basic',
                icon: 'mat_solid:access_time',
                link: '/dashboards/shift-timing',
                roles: ['admin'],
            },
            {
                id: 'dashboards.shift',
                title: 'Shifts',
                type: 'basic',
                icon: 'heroicons_outline:user-group',
                link: '/dashboards/shift',
                roles: ['admin'],
            },
        ],
    },
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'tickets',
        title: 'Tickets',
        tooltip: 'Tickets',
        type: 'aside',
        icon: 'heroicons_outline:ticket',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'users',
        title: 'Users',
        tooltip: 'Users',
        type: 'aside',
        icon: 'heroicons_outline:user',
        roles: ['admin'],
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'report',
        title: 'Reports',
        tooltip: 'Reports',
        type: 'aside',
        icon: 'heroicons_outline:chart-pie',
        roles: ['admin'],
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'DASHBOARDS',
        type: 'group',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'apps',
        title: 'APPS',
        type: 'group',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'others',
        title: 'OTHERS',
        type: 'group',
    },
    {
        id: 'pages',
        title: 'Pages',
        type: 'aside',
        icon: 'heroicons_outline:document-duplicate',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'user-interface',
        title: 'User Interface',
        type: 'aside',
        icon: 'heroicons_outline:rectangle-stack',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'navigation-features',
        title: 'Navigation Features',
        type: 'aside',
        icon: 'heroicons_outline:bars-3',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'Dashboards',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'apps',
        title: 'Apps',
        type: 'group',
        icon: 'heroicons_outline:squares-2x2',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'pages',
        title: 'Pages',
        type: 'group',
        icon: 'heroicons_outline:document-duplicate',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'user-interface',
        title: 'UI',
        type: 'group',
        icon: 'heroicons_outline:rectangle-stack',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'navigation-features',
        title: 'Misc',
        type: 'group',
        icon: 'heroicons_outline:bars-3',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
