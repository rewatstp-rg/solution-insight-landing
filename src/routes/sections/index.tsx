/* eslint-disable perfectionist/sort-imports */
import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import { GuestGuard } from 'src/auth/guard';
import { PATH_AFTER_LOGIN } from 'src/config-global';

import CompactLayout from 'src/layouts/compact';
import AuthClassicLayout from 'src/layouts/auth/classic';
import { SplashScreen } from 'src/components/loading-screen';

import { adminMainRoutes } from './admin-route';
// import { testModuleRoutes } from './admin-route/test-module';

// ----------------------------------------------------------------------

const VerifyPage = lazy(() => import('src/pages/auth/jwt/verify'));
const JwtLoginPage = lazy(() => import('src/pages/auth/jwt/login'));
const NewPasswordPage = lazy(() => import('src/pages/auth/jwt/new-password'));
const ForgotPasswordPage = lazy(() => import('src/pages/auth/jwt/forgot-password'));
const NewPasswordForEmailPage = lazy(() => import('src/pages/auth/jwt/new-password-for-email'));

const Page500 = lazy(() => import('src/pages/500'));
const Page403 = lazy(() => import('src/pages/403'));
const Page404 = lazy(() => import('src/pages/404'));

export default function Router() {
  return useRoutes([
    // SET INDEX PAGE WITH SKIP HOME PAGE
    {
      path: '/',
      element: <Navigate to={PATH_AFTER_LOGIN} replace />,
    },

    // ----------------------------------------------------------------------

    // SET INDEX PAGE WITH HOME PAGE
    {
      path: 'login',
      element: (
        <GuestGuard>
          <AuthClassicLayout>
            <JwtLoginPage />
          </AuthClassicLayout>
        </GuestGuard>
      ),
    },
    {
      element: (
        <CompactLayout>
          <Outlet />
        </CompactLayout>
      ),
      children: [
        { path: 'verify', element: <VerifyPage /> },
        { path: 'new-password', element: <NewPasswordPage /> },
        { path: 'forgot-password', element: <ForgotPasswordPage /> },
        { path: 'new-password-for-email', element: <NewPasswordForEmailPage /> },
      ],
    },
    // Admin Main routes
    ...adminMainRoutes,
    // // Test Module
    // ...testModuleRoutes,
    // No match 404
    {
      element: (
        <CompactLayout>
          <Suspense fallback={<SplashScreen />}>
            <Outlet />
          </Suspense>
        </CompactLayout>
      ),
      children: [
        { path: '500', element: <Page500 /> },
        { path: '404', element: <Page404 /> },
        { path: '403', element: <Page403 /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
