/* eslint-disable perfectionist/sort-imports */
import { configureStore } from '@reduxjs/toolkit';

// API 
import { userApi } from 'src/api/user.api';
import { menuApi } from 'src/api/menu.api';
import { fileApi } from 'src/api/file.api';
import { roleApi } from 'src/api/role.api';
import { reportApi } from 'src/api/report.api';
import { dashboardApi } from 'src/api/dashboard.api';
import { masterDataApi } from 'src/api/master-data.api';
import { administratorApi } from 'src/api/administrator.api';
import { emailMarketingApi } from 'src/api/email-marketing.api';
import { errorMiddleware } from 'src/api/middleware/error-middleware';
import { commonApi } from 'src/api/common.api';
import { productApi } from 'src/api/product.api';

// REDUCER
import RoleReducer from 'src/slices/role.slices';
import UserReducer from 'src/slices/user.slices';
import FileReducer from 'src/slices/file.slices';
import AuthMenuReducer from 'src/slices/menu.slices';
import ReportReducer from 'src/slices/report.slices';
import otpMessageReducer from 'src/slices/otp.slices';
import dashboardReducer from 'src/slices/dashboard.slices';
import MasterDataReducer from 'src/slices/master-data.slices';
import errorMessageReducer from 'src/slices/error-message.slices';
import administratorReducer from 'src/slices/administrator.slices';
import EmailMarketingReducer from 'src/slices/email-marketing.slices';

export const store = configureStore({
    reducer: {
        errorMessage: errorMessageReducer,
        masterData: MasterDataReducer, [masterDataApi.reducerPath]: masterDataApi.reducer,
        administrator: administratorReducer, [administratorApi.reducerPath]: administratorApi.reducer,
        report: ReportReducer, [reportApi.reducerPath]: reportApi.reducer,
        file: FileReducer, [fileApi.reducerPath]: fileApi.reducer,
        authMenu: AuthMenuReducer, [menuApi.reducerPath]: menuApi.reducer,
        dashboard: dashboardReducer, [dashboardApi.reducerPath]: dashboardApi.reducer,
        user: UserReducer, [userApi.reducerPath]: userApi.reducer,
        otpMessage: otpMessageReducer,
        role: RoleReducer, [roleApi.reducerPath]: roleApi.reducer,
        emailMarketing: EmailMarketingReducer, [emailMarketingApi.reducerPath]: emailMarketingApi.reducer,
        [commonApi.reducerPath]: commonApi.reducer,
        [productApi.reducerPath]: productApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat(
            errorMiddleware,
            masterDataApi.middleware,
            administratorApi.middleware,
            reportApi.middleware,
            fileApi.middleware,
            menuApi.middleware,
            dashboardApi.middleware,
            userApi.middleware,
            roleApi.middleware,
            emailMarketingApi.middleware,
            commonApi.middleware,
            productApi.middleware
        ),
});
