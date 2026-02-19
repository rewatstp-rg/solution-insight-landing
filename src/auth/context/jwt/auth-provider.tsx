/* eslint-disable perfectionist/sort-imports */
import { useMemo, useEffect, useReducer, useCallback } from 'react';

import axios, { endpoints } from 'src/utils/axios';
import { AUTH_TYPE, STORAGE_KEYS, ENV_NAME_ADMIN } from 'src/utils/constants';
import { getStorage } from 'src/hooks/use-local-storage';

// import { AxiosResponse } from 'axios';
import { AuthContext } from './auth-context';
import { setSession, isValidToken } from './utils';
import { AuthUserType, ActionMapType, AuthStateType } from '../../types';
// import { useRouter } from 'src/routes/hooks';

const ENV = import.meta.env.VITE_HOST_NAME;

// ----------------------------------------------------------------------
/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */
// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType;
    errorCode?: string;
    email?: string;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
    errorCode?: string;
    email?: string;
  };
  [Types.REGISTER]: {
    user: AuthUserType;
    errorCode?: string;
    email?: string;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  user: null,
  loading: true,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
      errorCode: action.payload.errorCode,
      email: action.payload.email
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      user: action.payload.user,
      errorCode: action.payload.errorCode,
      email: action.payload.email
    };
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      user: action.payload.user,
      errorCode: action.payload.errorCode,
      email: action.payload.email
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {

  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {

    try {
      const key = ENV === ENV_NAME_ADMIN ? STORAGE_KEYS.USER_INFO : STORAGE_KEYS.CUSTOMER_INFO;
      const accessToken = getStorage(key);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);
        const url = ENV === ENV_NAME_ADMIN ? endpoints.auth.login : endpoints.auth.loginCustomer;
        const res = await axios.get(url);

        const { user } = res.data;

        dispatch({
          type: Types.INITIAL,
          payload: {
            user: {
              ...user,
              accessToken,
              errorCode: "",
            },
            email: user.email
          },
        });
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            user: null,
            errorCode: ""
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
          errorCode: ""
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (username: string, password: string) => {

    const formValue = {
      username,
      password,
    };
    const url = ENV === ENV_NAME_ADMIN ? endpoints.auth.login : endpoints.auth.loginCustomer;
    const res = await axios.post(url, formValue);
    const { data, status } = res.data;

    if (status.description === "SUCCESS") {
      if (data?.status === AUTH_TYPE.NEW_USER) {
        // router.push('/new-password');
        dispatch({
          type: Types.LOGIN,
          payload: {
            user: null,
            errorCode: AUTH_TYPE.NEW_USER,
            email: data.email
          },
        });
      } else if (data?.status === AUTH_TYPE.ACTIVE) {
        dispatch({
          type: Types.LOGIN,
          payload: {
            user: null,
            errorCode: AUTH_TYPE.ACTIVE,
            email: data.email
          },
        });
      }

      // setSession(data?.accessToken);
      // setStorage(STORAGE_KEYS.USER_INFO, data);
      // axios.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;

      // dispatch({
      //   type: Types.LOGIN,
      //   payload: {
      //     user: data,
      //     errorCode: ""
      //   },
      // });
    } else {
      dispatch({
        type: Types.LOGIN,
        payload: {
          user: null,
          errorCode: status.description
        },
      });
    }
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;
  const errorCode = state?.errorCode;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      login,
      logout,
      errorCode: errorCode || ''
    }),
    [login, logout, state.user, status, errorCode]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}


