import { useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { getStorage } from 'src/hooks/use-local-storage';

import { STORAGE_KEYS, ENV_NAME_ADMIN } from 'src/utils/constants';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

const ENV = import.meta.env.VITE_HOST_NAME;

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function GuestGuard({ children }: Props) {
  const { loading } = useAuthContext();

  return <>{loading ? <SplashScreen /> : <Container>{children}</Container>}</>;
}

// ----------------------------------------------------------------------

function Container({ children }: Props) {
  const router = useRouter();

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo') || paths.dashboard.general.overview;
  const key = ENV === ENV_NAME_ADMIN ? STORAGE_KEYS.USER_INFO : STORAGE_KEYS.CUSTOMER_INFO;
  const accessTokenOption : any = getStorage(key);


  const check = useCallback(() => {
    if (accessTokenOption?.accessToken) {
      router.replace(returnTo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessTokenOption, returnTo, router]);

  useEffect(() => {
    check();
  }, [check]);

  return <>{children}</>;
}
