import { Test, ANSWERS } from "@/types";
import { apis } from "@/apis";

export const useTestStore = defineStore("test", () => {
  const tests = ref<Test[]>([]);
  const testDetail = ref({});
  const questionDetail = ref([]);

  const getTests = async () => {
    const res = await apis.api!.get("/test/list").catch((err) => {
      console.log(err);
      return null;
    });
    tests.value = res?.data || [];
  };

  const getTestDetail = async (id: number) => {
    const res = await apis.api!.get(`/test/detail/${id}`).catch((err) => {
      console.log(err);
      return null;
    });
    testDetail.value = res?.data || {};
    questionDetail.value =
      res?.data.questionResponses.map((item: any) => ({
        ...item,
        answers: item.answers.map((answer: any, index: number) => {
          return {
            ...answer,
            label: ANSWERS[index],
          };
        }),
      })) || [];
  };

  const createTest = async (
    subjectCode: string,
    chapterOrders: Array<[]>,
    questionQuantity: number,
    testDay: string,
    duration: number,
    testTime: string
  ) => {
    const res = await apis.api!
      .post("/test/create/random", {
        subjectCode,
        chapterOrders,
        questionQuantity,
        testDay,
        duration,
        testTime,
      })
      .catch((err) => {});
  };

  const createTestCheckbox = async (data: {
    questionIds: number[];
    testDay: string;
    duration: number;
    testTime: string;
  }) => {
    const res = await apis.api!.post("/test/create", data).catch((err) => {});
  };

  const deleteById = async (id: number) => {
    const res = await apis.api!.delete(`test/disable/${id}`).catch(() => null);
    if (res !== null) {
      const deletedItemIndex = tests.value.findIndex((item) => item.id === id);
      if (deletedItemIndex > -1) {
        tests.value.splice(deletedItemIndex, 1);
      }
    }
  };

  const exportTest = async () => {
    const res = await api
      .get(`/test-set/word/export/${id}`, {
        responseType: "blob",
      })
      .then((res) => {
        let fileUrl = window.URL.createObjectURL(res.data);
        let fileLink = document.createElement("a");

        fileLink.href = fileUrl;
        fileLink.setAttribute("download", "export-test-set.doc");
        document.body.appendChild(fileLink);

        fileLink.click();
      })
      .catch((err) => {
        console.log(err);
        return null;
      });
  };

  return {
    tests,
    testDetail,
    questionDetail,
    getTests,
    getTestDetail,
    deleteById,
    createTest,
    createTestCheckbox,
    exportTest,
  };
});
