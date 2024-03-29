import { apis } from "@/apis";
export const useAuthStore = defineStore("auth", () => {
  const currentUser = ref();

  const handleLogin = async (accessToken: string, refreshToken: string) => {
    const session = { accessToken, refreshToken };
    localStorage.removeItem("session");
    localStorage.setItem("session", JSON.stringify(session));
    await getCurrentUser();
  };

  const getCurrentUser = async () => {
    const res = await apis.api!.get("user/profile").catch(() => null);
    currentUser.value = res?.data ?? {};
  };

  const logout = () => {
    localStorage.removeItem("session");
  };

  return {
    currentUser,
    handleLogin,
    getCurrentUser,
    logout,
  };
});
