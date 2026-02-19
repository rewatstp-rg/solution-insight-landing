import { useMemo, useEffect } from 'react';
import { useLocation, useSearchParams as _useSearchParams } from 'react-router-dom';

// ----------------------------------------------------------------------

export function useSearchParams() {
  const [searchParams] = _useSearchParams();

  return useMemo(() => searchParams, [searchParams]);
}

export const useLocationChange = (action: any) => {
  const location = useLocation()
  useEffect(() => {
    action(location)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])
}
