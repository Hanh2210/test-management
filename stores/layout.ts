import { apis } from "@/apis";
export const useLayoutStore = defineStore("layout", () => {
  const isShowLoading = ref(false);
  const changeShowLoading = (value: boolean) => {
    isShowLoading.value = value;
  };
  return {
    isShowLoading,
    changeShowLoading,
  };
});
