import { Outlet } from "react-router";
import { lazy, Suspense } from "react";

import { AuthGuard } from "src/auth/guard";

import { LoadingScreen } from "src/components/loading-screen";

const AdministratorSearchPage = lazy(() => import('src/pages/administrator/administrator-search'));
const AdministratorFormPage = lazy(() => import('src/pages/administrator/administrator-form'));


export const administratorRoutes = [
  {
    path: 'administrator',
    element: (
      <AuthGuard>
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </AuthGuard>
    ),
    children: [
      { path: '', element: <AdministratorSearchPage /> },
      { path: ':type', element: <AdministratorFormPage /> },
      { path: ':adminCode/:type', element: <AdministratorFormPage /> }
    ],
  },
];
