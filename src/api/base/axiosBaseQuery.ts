import axios, { AxiosError, AxiosResponse } from 'axios';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';

import { getStorage, removeStorage } from 'src/hooks/use-local-storage';

import { STORAGE_KEYS } from 'src/utils/constants';

import {
  AxiosBase,
  BaseRequest,
  BaseDataResponse,
  BaseErrorResponse,
} from './types';
import {
  createErrorMessageWithAxiosError,
  createErrorMessageWithAxiosResponse,
} from './createErrorMessage';

const key = STORAGE_KEYS.USER_INFO;

const ENV = import.meta.env.VITE_ENV;

export const axiosBaseQuery =
  ({
    baseUrl = '',
  }: AxiosBase): BaseQueryFn<BaseRequest, unknown, BaseErrorResponse> =>
    async ({ url, method, body, params, overrideBaseUrl }) => {
      try {
        let authorization = {};
        let clientModule = {};
        const accessTokenOption: any = getStorage(key);
        const { accessToken } = accessTokenOption;
        if (accessToken) {
          authorization = { Authorization: `Bearer ${accessToken}` }
          clientModule = { 'Client-Module': `administrator` };
        }

        const _url = overrideBaseUrl ? url : baseUrl + url
        const headers = { 'Accept-Language': 'th', ...authorization, ...clientModule }

        const response = await axios({
          url: _url,
          method,
          data: body,
          params,
          headers,
        })

        if (isServiceError(response)) {
          console.error(`API RESPONSE ERROR WITH DATA :`, response.data)
          return createErrorMessageWithAxiosResponse(response)
        }

        return { data: response.data }
      } catch (axiosError) {
        const err = axiosError as AxiosError<BaseDataResponse, any>
        if (err?.response?.status === 401 && ENV !== 'dev') {
          removeStorage(key);
          localStorage.clear();
          window.location.href = `/login?returnTo=${window.location.pathname}`
        }

        console.error(
          `API RESPONSE ERROR WITH HTTP STUTUS : ${err.response?.status}, DATA :`,
          err.response?.data
        )

        return createErrorMessageWithAxiosError(err)
      }
    }

const isServiceError = (res: AxiosResponse) => {
  if (res.status !== 200 && res.status !== 499) return true
  if (res.data.status && res.data.status.code === '102') return true
  return false
}
