import { lazy, Suspense } from 'react';
// import { lazy } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard } from 'src/auth/guard';

// import CompactLayout from 'src/layouts/compact';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const GetLocationPage = lazy(() => import('src/pages/get-location/get-location-page'));
const WebsocketAppPage = lazy(() => import('src/pages/websocket-app/websocket-app-page'));

const ViewCommonImageFramePage = lazy(() => import('src/pages/upload-common-image-frame/view-common-image-frame-page'));
const UploadCommonImageFramePage = lazy(() => import('src/pages/upload-common-image-frame/upload-common-image-frame-page'));

const ProductPage = lazy(() => import('src/pages/product/product.page'));
const ProductSearchPage = lazy(() => import('src/pages/product/product-search.page'));

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
      { path: 'upload-product', element: <UploadCommonImageFramePage />, index: true },
      { path: 'view-product', element: <ViewCommonImageFramePage />, index: true },
      { path: 'product', element: <ProductSearchPage />, index: true },
      { path: 'product/:type', element: <ProductPage />, index: true },
      { path: 'product/:code/:type', element: <ProductPage />, index: true },
    ],
  },
];
