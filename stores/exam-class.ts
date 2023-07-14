import { ExamClass } from "@/types";
import { apis } from "@/apis";

export const useExamClassStore = defineStore("exam-class", () => {
  const examClasses = ref<ExamClass[]>([]);
  const examClassDetail = ref({});

  const getExamClasses = async () => {
    const res = await apis.api!.get("/class/list").catch((err) => {
      console.log(err);
      return null;
    });
    examClasses.value = res?.data || [];
  };

  const joinExamClasses = async (classCode: string) => {
    const res = await apis
      .api!.post(`/class/join?classCode=${classCode}`)
      .catch((err) => {
        console.log(err);
        return null;
      });
    examClasses.value = res?.data || [];
  };

  const createExamClass = async (data: {
    roomName: string;
    semester: string;
    code: string;
    studentIds: number[];
    testId: number;
  }) => {
    const res = await apis.api!.post("/class/create", data).catch((err) => {});
  };

  const deleteById = async (id: number) => {
    const res = await apis.api!.delete(`class/disable/${id}`).catch(() => null);
    if (res !== null) {
      const deletedItemIndex = examClasses.value.findIndex(
        (item) => item.id === id
      );
      if (deletedItemIndex > -1) {
        examClasses.value.splice(deletedItemIndex, 1);
      }
    }
  };

  const importStudent = async (formData: any) => {
    const res = await apis
      .api!.post("/class/import/students", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((err) => console.log(err));
  };

  const getExamClassDetail = async (id: number) => {
    const res = await apis.api!.get(`/class/detail/${id}`).catch((err) => {
      console.log(err);
      return null;
    });
    examClassDetail.value = res?.data || {};
  };

  // export bảng điểm
  const exportMarkTable = async (code: string) => {
    console.log("test", code);
    const res = await apis
      .api!.get(`/class/export/${code}`, {
        responseType: "blob",
      })
      .then((res) => {
        let fileUrl = window.URL.createObjectURL(res.data);
        let fileLink = document.createElement("a");

        fileLink.href = fileUrl;
        fileLink.setAttribute("download", "export-mark-table.xls");
        document.body.appendChild(fileLink);

        fileLink.click();
      })
      .catch((err) => {
        console.log(err);
        return null;
      });
  };

  return {
    examClasses,
    examClassDetail,
    getExamClasses,
    createExamClass,
    joinExamClasses,
    deleteById,
    importStudent,
    getExamClassDetail,
    exportMarkTable,
  };
});
