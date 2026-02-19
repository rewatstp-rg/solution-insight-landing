import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard } from 'src/auth/guard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// OVERVIEW
const EmailEditorPage = lazy(() => import('src/pages/email-editor/email-editor-page'));
const EmailEditor2Page = lazy(() => import('src/pages/email-editor/email-editor-2-page'));
const EmailTemplateFormPage = lazy(() => import('src/pages/email-editor/email-editor-form'));
const EmailTemplateSearchPage = lazy(() => import('src/pages/email-editor/email-editor-search-page'));
const EmailTransactionFormPage = lazy(() => import('src/pages/email-transaction/email-transaction-form'));
const EmailTransactionSearchPage = lazy(() => import('src/pages/email-transaction/email-transaction-search'));

// ----------------------------------------------------------------------

export const emailEditorRoutes = [
    {
        path: 'email',
        element: (
            <AuthGuard>
                <Suspense fallback={<LoadingScreen />}>
                    <Outlet />
                </Suspense>
            </AuthGuard>
        ),
        children: [
            { path: 'template', element: <EmailTemplateSearchPage />, index: true },
            { path: 'editor-1', element: <EmailEditorPage />, index: true },
            { path: 'editor-2', element: <EmailEditor2Page />, index: true },
            { path: 'editor/:type', element: <EmailTemplateFormPage />, index: true },
            { path: 'editor/:type/:id', element: <EmailTemplateFormPage />, index: true },
            { path: 'transaction', element: <EmailTransactionSearchPage />, index: true },
            { path: 'transaction/:type/:transactionNo', element: <EmailTransactionFormPage />, index: true },

        ],
    }
];
