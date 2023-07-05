import { apis } from "@/apis";

export const getTeachers = async () => {
  const res = await apis.api!.get("/teacher/list").catch((err) => {
    console.log(err);
    return null;
  });
  return res;
};
