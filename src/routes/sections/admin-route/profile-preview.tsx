
import { Outlet } from "react-router";
import { lazy, Suspense } from "react";

import { AuthGuard } from "src/auth/guard";

import { LoadingScreen } from "src/components/loading-screen";

const ProfilePreviewPage = lazy(() => import('src/pages/profile-preview/profile-preview'));


export const profilePreviewRoutes = [
    {
        path: 'profile',
        element: (
            <AuthGuard>
                <Suspense fallback={<LoadingScreen />}>
                    <Outlet />
                </Suspense>
            </AuthGuard>
        ),
        children: [
            { path: '', element: <ProfilePreviewPage /> }
        ],
    },
];
