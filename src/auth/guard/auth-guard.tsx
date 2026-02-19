/* eslint-disable perfectionist/sort-imports */
import { useState, useEffect, useCallback } from 'react';

import { useRouter } from 'src/routes/hooks';

import { STORAGE_KEYS } from 'src/utils/constants';

import { SplashScreen } from 'src/components/loading-screen';

import { getStorage } from 'src/hooks/use-local-storage';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const { loading } = useAuthContext();

  return <>{loading ? <SplashScreen /> : <Container>{children}</Container>}</>;
}

// ----------------------------------------------------------------------

function Container({ children }: Props) {
  const router = useRouter();

  const key = STORAGE_KEYS.USER_INFO;
  const accessTokenOption: any  = getStorage(key);
  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    if (!accessTokenOption?.accessToken) {
      const searchParams = new URLSearchParams({
        returnTo: window.location.pathname,
      }).toString();

      const loginPath = '/login';

      const href = `${loginPath}?${searchParams}`;

      console.log("🚀 ~ file: auth-guard.tsx:57 ~ check ~ searchParams:", searchParams)
      console.log("🚀 ~ file: auth-guard.tsx:45 ~ check ~ href:", href)
      router.replace(href);

      // router.replace('/login');
    } else {
      setChecked(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, accessTokenOption]);

  useEffect(() => {
     
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}
