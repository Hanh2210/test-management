import { ExamClass } from "@/types";
import { apis } from "@/apis";

export const useExamClassStore = defineStore("exam-class", () => {
  const examClasses = ref<ExamClass[]>([]);

  const getExamClasses = async () => {
    const res = await apis.api!.get("/class/list").catch((err) => {
      console.log(err);
      return null;
    });
    examClasses.value = res?.data || [];
  };

  const joinExamClasses = async (classCode: string) => {
    const res = await apis.api!
      .post(`/class/join?classCode=${classCode}`)
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

  return {
    examClasses,
    getExamClasses,
    createExamClass,
    joinExamClasses,
    deleteById,
  };
});
