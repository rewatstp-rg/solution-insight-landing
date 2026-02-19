/* eslint-disable perfectionist/sort-imports */

import { lazy, Suspense } from "react";
import { Outlet } from "react-router";
import { AuthGuard } from "src/auth/guard";
import { LoadingScreen } from "src/components/loading-screen";

const ProvinceSearchPage = lazy(() => import('src/pages/master-data/province/province-search'));
const DistrictSearchPage = lazy(() => import('src/pages/master-data/district/district-search'));
const SubDistrictSearchPage = lazy(() => import('src/pages/master-data/sub-district/sub-district-search'));
const ConfigGroupSearchSearchPage = lazy(() => import('src/pages/master-data/config-group/config-group-search'));
const ConfigGroupSearchListBoxPage = lazy(() => import('src/pages/master-data/config-group/config-listbox-search'));

export const masterDataRoutes = [
    {
        path: 'master-data',
        element: (
            <AuthGuard>
                <Suspense fallback={<LoadingScreen />}>
                    <Outlet />
                </Suspense>
            </AuthGuard>
        ),
        children: [
            { path: 'province', element: <ProvinceSearchPage /> },
            { path: 'district', element: <DistrictSearchPage /> },
            { path: 'sub-district', element: <SubDistrictSearchPage /> },
            { path: 'config-group', element: <ConfigGroupSearchSearchPage /> },
            { path: 'config-group/:type', element: <ConfigGroupSearchListBoxPage /> },
            { path: 'config-group/:type/:listboxGroup', element: <ConfigGroupSearchListBoxPage /> },
        ],
    },
];
