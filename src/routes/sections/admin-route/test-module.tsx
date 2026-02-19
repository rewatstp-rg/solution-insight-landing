import { lazy, Suspense } from 'react';
// import { lazy } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard } from 'src/auth/guard';

// import CompactLayout from 'src/layouts/compact';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const GetLocationPage = lazy(() => import('src/pages/get-location/get-location-page'));
const WebsocketAppPage = lazy(() => import('src/pages/websocket-app/websocket-app-page'));

// ----------------------------------------------------------------------

export const testModuleRoutes = [
  {
    path: 'module',
    element: (
      <AuthGuard>
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </AuthGuard>
      // <CompactLayout>
      //   <Outlet />
      // </CompactLayout>
    ),
    children: [
      { path: 'websocket', element: <WebsocketAppPage />, index: true },
      { path: 'location', element: <GetLocationPage />, index: true },
    ],
  },
];
