import { createAPI, apis } from "@/apis";

export default defineNuxtPlugin(async () => {
  const runtimeConfig = useRuntimeConfig();
  apis.api = createAPI(runtimeConfig.public.API_BASE_URL, true);
  apis.authApi = createAPI(runtimeConfig.public.API_BASE_URL, false);
});
