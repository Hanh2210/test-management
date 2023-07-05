import { Teacher } from "@/types";
import { apis } from "@/apis";

export const useTeacherStore = defineStore("teacher", () => {
  const teachers = ref<Teacher[]>([]);
  const isCreating = ref(false);

  const getTeachers = async () => {
    const res = await apis.api!.get("/teacher/list").catch((err) => {
      console.log(err);
      return null;
    });
    teachers.value = res?.data || [];
  };

  const createTeacher = async (
    fullName: string,
    code: string,
    username: string,
    password: string,
    birthday: string,
    gender: string,
    phoneNumber: string,
    email: string
  ) => {
    const res = await apis
      .api!.post("/teacher/add", {
        fullName,
        code,
        username,
        password,
        birthday,
        gender,
        phoneNumber,
        email,
      })
      .catch((err) => {});
  };

  const updateById = async (
    id: number,
    fullName: string,
    code: string,
    birthday: string,
    gender: string,
    phoneNumber: string,
    email: string
  ) => {
    const res = await apis
      .api!.put(`/teacher/update/${id}`, {
        fullName,
        code,
        birthday,
        gender,
        phoneNumber,
        email,
      })
      .catch((err) => {});
    return res;
  };

  const deleteById = async (id: number) => {
    const res = await apis
      .api!.delete(`teacher/disable/${id}`)
      .catch(() => null);
    if (res !== null) {
      const deletedItemIndex = teachers.value.findIndex(
        (item) => item.id === id
      );
      if (deletedItemIndex > -1) {
        teachers.value.splice(deletedItemIndex, 1);
      }
    }
  };

  const importTeachers = async (formData: any) => {
    const res = await apis
      .api!.post("/teacher/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((err) => console.log(err));
  };

  const exportTeachers = async () => {
    const res = await apis
      .api!.get("/teacher/export", {
        responseType: "blob",
      })
      .then((res) => {
        let fileUrl = window.URL.createObjectURL(res.data);
        let fileLink = document.createElement("a");

        fileLink.href = fileUrl;
        fileLink.setAttribute("download", "export-teacher-template.xls");
        document.body.appendChild(fileLink);

        fileLink.click();
      })
      .catch((err) => {
        console.log(err);
        return null;
      });
  };

  const updateProfile = async (data: {
    email: string;
    fullName: string;
    birthday: string;
    gender: string;
    phoneNumber: string;
  }) => {
    const res = await apis
      .api!.put(`/teacher/update/profile`, data)
      .catch((err) => {});
    return res;
  };

  return {
    teachers,
    isCreating,
    getTeachers,
    createTeacher,
    updateById,
    deleteById,
    importTeachers,
    exportTeachers,
    updateProfile,
  };
});
