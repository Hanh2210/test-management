import { Student } from "@/types";
import { apis } from "@/apis";

export const useStudentStore = defineStore("student", () => {
  const students = ref<Student[]>([]);
  const isCreating = ref(false);

  const getStudents = async () => {
    const res = await apis.api!.get("/student/list").catch((err) => {
      console.log(err);
      return null;
    });
    students.value = res?.data || [];
  };

  const createStudent = async (
    fullName: string,
    code: string,
    username: string,
    password: string,
    birthday: string,
    gender: string,
    phoneNumber: string,
    course: number,
    email: string
  ) => {
    const res = await apis.api!
      .post("/student/add", {
        fullName,
        code,
        username,
        password,
        birthday,
        gender,
        phoneNumber,
        course,
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
    course: number,
    email: string
  ) => {
    const res = await apis.api!
      .put(`/student/update/${id}`, {
        fullName,
        code,
        birthday,
        gender,
        phoneNumber,
        course,
        email,
      })
      .catch((err) => {});
    return res;
  };

  const deleteById = async (id: number) => {
    const res = await apis.api!.delete(`student/disable/${id}`).catch(() => null);
    if (res !== null) {
      const deletedItemIndex = students.value.findIndex(
        (item) => item.id === id
      );
      if (deletedItemIndex > -1) {
        students.value.splice(deletedItemIndex, 1);
      }
    }
  };

  const importStudents = async (formData: any) => {
    const res = await apis.api!
      .post("/student/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((err) => console.log(err));
  };

  const exportStudents = async () => {
    const res = await apis.api!
      .get("/student/export", {
        responseType: "blob",
      })
      .then((res) => {
        let fileUrl = window.URL.createObjectURL(res.data);
        let fileLink = document.createElement("a");

        fileLink.href = fileUrl;
        fileLink.setAttribute("download", "export-student-template.xls");
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
    code: string;
  }) => {
    const res = await apis.api!
      .put(`/teacher/update/profile`, data)
      .catch((err) => {});
    return res;
  };
  return {
    students,
    isCreating,
    getStudents,
    createStudent,
    updateById,
    deleteById,
    importStudents,
    exportStudents,
    updateProfile,
  };
});
