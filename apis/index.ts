import axios, { AxiosInstance } from "axios";

interface Session {
  accessToken: string;
  refreshToken: string;
}

const MAX_RETRY_ATTEMPTS = 1;

export const createAPI = (baseURL: string, requireAuth: boolean) => {
  const instance = axios.create({
    baseURL: baseURL, //Ex: "https://some-domain.com/api/",
    timeout: 10000,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
  });

  if (requireAuth) {
    // Add access token to header
    instance.interceptors.request.use(
      (config) => {
        const session: Session = JSON.parse(
          localStorage.getItem("session") || ""
        );
        config.headers.Authorization = `Bearer ${session?.accessToken}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const { config, response } = error;
        // Retry the request if it returns a 401 error and has retry attempts remaining
        console.log(response, config);
        if (
          response.status === 401 &&
          config &&
          (config.retryCount ?? 0) < MAX_RETRY_ATTEMPTS
        ) {
          config.retryCount = config.retryCount || 0;
          config.retryCount++;

          const result = await refreshTokenFn();

          if (result?.accessToken) {
            config.headers.Authorization = `Bearer ${result?.accessToken}`;
          }

          const retryConfig = { ...config };

          return instance.request(retryConfig);
        }
      }
    );
  }
  return instance;
};

export const apis: { authApi?: AxiosInstance; api?: AxiosInstance } = {};

const refreshTokenFn = async () => {
  const session: Session = JSON.parse(localStorage.getItem("session") || "");
  console.log("session", session);
  try {
    const response: any = await apis.authApi!.post("/auth/refresh-token", {
      refreshToken: session?.refreshToken,
    });

    const { accessToken, refreshToken } = response.data;

    if (!session?.accessToken) {
      localStorage.removeItem("session");
    }

    localStorage.setItem(
      "session",
      JSON.stringify({ accessToken, refreshToken })
    );

    return session;
  } catch (error) {
    localStorage.removeItem("session");
    return null;
  }
};
