import { UserInfo } from "@/types";
import { apis } from "@/apis";

export const useUserInfoStore = defineStore("user", () => {
  const userInfo = ref<UserInfo>();

  const getProfile = async () => {
    const res = await apis.api!.get("/user/profile").catch((err) => {
      console.log(err);
      return null;
    });
    userInfo.value = res?.data || {};
  };

  return {
    userInfo,
    getProfile,
  };
});
