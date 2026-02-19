import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import MainLayout from 'src/layouts/main';
import { AuthGuard } from 'src/auth/guard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------
import { dashboardRoutes } from './dashboard';
import { testModuleRoutes } from './test-module';
import { masterDataRoutes } from './master-data';
import { emailEditorRoutes } from './email-editor';
import { administratorRoutes } from './administrator';
import { profilePreviewRoutes } from './profile-preview';

// ----------------------------------------------------------------------

export const adminMainRoutes = [
    {
        path: 'admin',
        element: (
            <AuthGuard>
                <MainLayout>
                    <Suspense fallback={<LoadingScreen />}>
                        <Outlet />
                    </Suspense>
                </MainLayout>
            </AuthGuard>
        ),
        children: [
            // Dashboard routes
            ...dashboardRoutes,
            // Administrator routes
            ...administratorRoutes,
            // Master Data
            ...masterDataRoutes,
            // Profile Preview
            ...profilePreviewRoutes,
            // Email Template
            ...emailEditorRoutes,
            // Test Module
            ...testModuleRoutes
        ]
    },
];
