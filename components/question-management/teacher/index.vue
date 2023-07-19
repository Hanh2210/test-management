<script lang="ts" setup>
import { Question, stringToBoolean } from "@/types";
import { useQuestionStore } from "@/stores/question";
import { useSubjectStore } from "@/stores/subject";
import { useTestStore } from "@/stores/test";

const isEditQuestion = ref(false);
const titleSnack = ref("");
const isShowSnack = ref(false);

const questionStore = useQuestionStore();
const subjectStore = useSubjectStore();
const testsStore = useTestStore();

const subjectCode = ref("");
const questions = computed(() => questionStore.questions);

const questionById = ref({});
const isShowConfirmDelete = ref(false);
const questionToDeleteId = ref(null);
//get subjects
const res = await subjectStore.getSubjects();
const subjects = computed(() => subjectStore.subjects);

// get questions
const fetchQuestionsBySubject = async (code: string): Promise<void> => {
  await questionStore.getQuestions(code);
};

const chapterBySubject = ref([]);

// create test by checkbox questions
const isShowCreateForm = ref(false);
const checkedIds = ref<number[]>([]);
const testDay = ref("");
const testTime = ref("");
const duration = ref(0);

const toggleCreateForm = () => {
  isShowCreateForm.value = !isShowCreateForm.value;
};

const getCheckedId = (id: number): boolean => {
  return Boolean(checkedIds.value.find((itemId) => itemId === id));
};

const onCheckedId = (id: number) => {
  const isChecked = checkedIds.value.find((itemId) => itemId === id);

  if (isChecked) {
    // remove no trong mang ids
    checkedIds.value = checkedIds.value.filter((itemId) => itemId !== id);
  } else {
    // push vo mang checkids
    checkedIds.value = [...checkedIds.value, id];
  }
};

const createTestByCheckbox = async (): Promise<void> => {
  const res = await testsStore.createTestCheckbox({
    questionIds: checkedIds.value.map((id) => id),
    testDay: testDay.value,
    duration: +duration.value,
    testTime: testTime.value,
  });
  isShowCreateForm.value = false;
};

const openDialogEditQuestion = async (question: any) => {
  chapterBySubject.value = await subjectStore.getChapters(question.subjectCode);
  questionById.value = question;
  isEditQuestion.value = true;
};

const closeDialog = () => {
  isEditQuestion.value = false;
};

// TODO

const editQuestion = async (e: any) => {
  const id = e.question.value.id;
  const chapterId = e.question.value.chapter.id;
  const topicText = e.question.value.topicText;
  const level = e.question.value.level;
  const answers = e.question.value.answers.map((item: any) => ({
    ...item,
    isCorrected: item.isCorrected ? "true" : "false",
  }));

  try {
    const data = {
      chapterId,
      topicText,
      level,
      answers,
    };
    const formData = new FormData();
    formData.append("jsonRequest", JSON.stringify(data));

    if (e.file) {
      formData.append("file", e.file);
    }

    const res = await questionStore.updateById(id, formData);
    //   isEditQuestion.value = false;
    //   isShowSnack.value = true;
    //   titleSnack.value = "Sửa câu hỏi thành công!";
  } catch (error) {
    // Handle the error
    console.error(error);
  }
};

const deleteQuestion = async (id: number) => {
  isShowConfirmDelete.value = false;
  const res = await questionStore.deleteById(id);
};

// Search field
const searchText = ref("");
const filteredQuestions = computed(() => {
  const search = searchText.value.toLowerCase();
  return questions.value.filter((question) => {
    if (question.topicText) {
      return (
        question.id.toString().includes(search) ||
        question.topicText.toLowerCase().includes(search) ||
        question.level.toLowerCase().includes(search)
      );
    }
    return false;
  });
});
</script>

<template>
  <h2 class="title">Ngân hàng câu hỏi</h2>

  <question-management-teacher-create :subjects="subjects" />

  <div class="search-question-list">
    <v-autocomplete
      clearable
      label="Nhập tên môn"
      :items="subjects"
      item-title="title"
      item-value="code"
      v-model="subjectCode"
    ></v-autocomplete>
    <v-btn @click="fetchQuestionsBySubject(subjectCode)">Tìm kiếm</v-btn>
  </div>
  <div class="search-question">
    <v-text-field
      v-model="searchText"
      append-icon="mdi-magnify"
      label="Tìm kiếm câu hỏi"
      single-line
      hide-details
    ></v-text-field>
  </div>

  <h3 class="create-title" @click="toggleCreateForm">Tạo bài test random</h3>
  <div class="create-test-random" v-if="isShowCreateForm">
    <div class="wrapper">
      <v-text-field
        v-model="testDay"
        type="date"
        label="Nhập ngày mở đề"
        required
      ></v-text-field>
      <v-text-field
        v-model="testTime"
        type="time"
        label="Nhập giờ mở đề"
        required
      ></v-text-field>
      <v-text-field
        v-model="duration"
        label="Nhập thời gian làm bài"
        required
      ></v-text-field>
      <v-btn @click="createTestByCheckbox">Tạo đề thi</v-btn>
    </div>
  </div>
  <div class="list-questions">
    <v-table fixed-header height="400px">
      <thead>
        <tr>
          <th class="text-left">Tạo bài test</th>
          <th class="text-left">ID</th>
          <th class="text-left">Câu hỏi</th>
          <th class="text-left">Độ khó</th>
          <th class="text-left">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="question in filteredQuestions" :key="question.id">
          <td>
            <v-checkbox-btn
              :model-value="getCheckedId(question.id)"
              @change="onCheckedId(question.id)"
            />
          </td>
          <td>{{ question.id }}</td>
          <td>{{ question.topicText }}</td>
          <td>{{ question.level }}</td>
          <td class="action">
            <v-icon
              size="small"
              class="me-2"
              @click="openDialogEditQuestion(question)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              size="small"
              @click="
                isShowConfirmDelete = true;
                questionToDeleteId = question.id;
              "
            >
              mdi-delete
            </v-icon>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>

  <question-management-teacher-edit
    :isEditQuestion="isEditQuestion"
    :subjects="subjects"
    :questionById="questionById"
    @close="closeDialog"
    @edit="editQuestion"
  />
  <template>
    <div class="text-center ma-2">
      <v-snackbar v-model="isShowSnack" :timeout="1200" :color="'#2196F3'">
        {{ titleSnack }}
      </v-snackbar>
    </div>
  </template>

  <v-dialog v-model="isShowConfirmDelete" persistent width="400" height="400">
    <v-card>
      <v-container>
        <h3>Bạn có muốn xóa câu hỏi này không?</h3>
      </v-container>
      <v-card-actions>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="deleteQuestion(questionToDeleteId ?? 0)"
        >
          Xác nhận
        </v-btn>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="isShowConfirmDelete = false"
        >
          Hủy
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
.title {
  padding-bottom: 16px;
  border-bottom: 1px solid $color-gray;
  margin-bottom: 12px;
}

.search-question-list {
  display: flex;
  gap: 32px;
  margin: 24px 0;
  justify-content: flex-start;
  align-items: center;
}

.create-title {
  cursor: pointer;
  color: $primary-color;
  margin-bottom: 16px;
}
.create-test-random {
  margin: 24px 0;

  > .wrapper {
    margin-top: 16px;
    display: flex;
    justify-content: center;
    gap: 32px;
    align-items: center;
  }
}
.search-question {
  width: 400px;
  padding-bottom: 16px;
}
:deep(.v-table__wrapper) {
  height: calc(100vh - 350px) !important;
}
</style>
