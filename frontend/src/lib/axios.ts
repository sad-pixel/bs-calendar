import axios, { type AxiosRequestConfig, AxiosError } from "axios";

export const AXIOS_INSTANCE = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Custom instance for orval-generated queries
export const api = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-expect-error zzz
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};

// Type definitions for error and body handling
export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;

export default api;
