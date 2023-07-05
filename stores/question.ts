import { Question, stringToBoolean } from "@/types";
import { apis } from "@/apis";
import { AxiosResponse } from "axios";

export const useQuestionStore = defineStore("question", () => {
  const questions = ref<Question[]>([]);
  const isCreating = ref(false);

  const getQuestions = async (code: string): Promise<Question[]> => {
    try {
      const res: AxiosResponse<Question[]> = await apis.api!.get(
        `/question/list?code=${code}`
      );
      questions.value =
        res.data.map((item: any) => ({
          ...item,
          answers: item.answers.map((answer: any) => ({
            ...answer,
            isCorrected: stringToBoolean(answer.isCorrected),
          })),
        })) || [];
    } catch (error) {
      console.log(error);
    } finally {
      return questions.value;
    }
  };

  const createQuestion = async (formData: any) => {
    const res = await apis
      .api!.post("/question/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((err) => {});
  };

  const updateById = async (id: number, formData: any) => {
    const res = await apis
      .api!.put(`/question/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((err) => {});
    return res;
  };

  const deleteById = async (id: number) => {
    const res = await apis
      .api!.delete(`question/disable/${id}`)
      .catch(() => null);
    if (res !== null) {
      const deletedItemIndex = questions.value.findIndex(
        (item) => item.id === id
      );
      if (deletedItemIndex > -1) {
        questions.value.splice(deletedItemIndex, 1);
      }
    }
  };

  const importQuestion = async (formData: any) => {
    const res = await apis
      .api!.post("/question/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((err) => console.log(err));
  };

  return {
    questions,
    isCreating,
    getQuestions,
    createQuestion,
    updateById,
    deleteById,
    importQuestion,
  };
});
