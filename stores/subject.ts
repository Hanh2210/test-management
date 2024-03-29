import { Subject, Chapter } from "@/types";
import { apis } from "@/apis";

export const useSubjectStore = defineStore("subject", () => {
  const subjects = ref<Subject[]>([]);
  const chapters = ref<Chapter[]>([]);

  // subjects
  const getSubjects = async () => {
    const res = await apis.api!.get("/subject/list").catch((err) => {
      console.log(err);
      return null;
    });
    subjects.value = res?.data || [];
  };

  const create = async (
    title: string,
    code: string,
    description: string,
    credit: number
  ) => {
    const res = await apis
      .api!.post("/subject/add", {
        title,
        code,
        description,
        credit,
      })
      .catch((err) => {});
  };

  const updateById = async (
    id: number,
    title: string,
    code: string,
    description: string,
    credit: number
  ) => {
    const res = await apis
      .api!.put(`/subject/update/${id}`, {
        title,
        code,
        description,
        credit,
      })
      .catch((err) => {});
    return res;
  };

  const deleteById = async (id: number) => {
    const res = await apis
      .api!.delete(`subject/disable/${id}`)
      .catch(() => null);
    if (res !== null) {
      const deletedItemIndex = subjects.value.findIndex(
        (item) => item.id === id
      );
      if (deletedItemIndex > -1) {
        subjects.value.splice(deletedItemIndex, 1);
      }
    }
  };

  // chapters
  const getChapters = async (code: string) => {
    const res = await apis.api!.get(`${code}/chapter/list `).catch((err) => {
      console.log(err);
      return null;
    });
    chapters.value = res?.data || [];
  };

  const createChapter = async (title: string, code: string, order: number) => {
    const res = await apis
      .api!.post(`${code}/chapter/add`, {
        title,
        code,
        order,
      })
      .catch((err) => {});
  };

  const updateChapterById = async (
    id: number,
    title: string,
    order: number
  ) => {
    const res = await apis
      .api!.put(`chapter/update/${id}`, {
        title,
        order,
      })
      .catch((err) => {});
    return res;
  };

  const deleteChapterById = async (id: number) => {
    const res = await apis
      .api!.delete(`chapter/disable/${id}`)
      .catch(() => null);
    if (res !== null) {
      const deletedItemIndex = chapters.value.findIndex(
        (item) => item.id === id
      );
      if (deletedItemIndex > -1) {
        chapters.value.splice(deletedItemIndex, 1);
      }
    }
  };

  return {
    subjects,
    chapters,
    getSubjects,
    create,
    updateById,
    deleteById,
    getChapters,
    createChapter,
    updateChapterById,
    deleteChapterById,
  };
});
