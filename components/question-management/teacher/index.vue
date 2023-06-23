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
  const topicImage = e.question.value.topicImage;

  const res = await questionStore.updateById(id, {
    chapterId,
    topicText,
    level,
    answers,
    topicImage,
  });

  if (res) {
    isEditQuestion.value = false;
    isShowSnack.value = true;
    titleSnack.value = "Sửa câu hỏi thành công!";
  }
};

const deleteQuestion = async (id: number) => {
  const res = await questionStore.deleteById(id);
};
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

  <h3 class="create-title" @click="toggleCreateForm">Tạo bài test random</h3>
  <div class="create-test-random" v-if="isShowCreateForm">
    <div class="wrapper">
      <v-text-field
        v-model="testDay"
        label="Nhập ngày mở đề"
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
        <tr v-for="question in questions" :key="question.id">
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
            <v-icon size="small" @click="deleteQuestion(question.id)">
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
</template>

<style scoped lang="scss">
.title {
  padding-bottom: 16px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 12px;
}

.search-question-list {
  display: flex;
  gap: 32px;
  margin: 24px 0;
  justify-content: start;
  align-items: center;
}

.create-title {
  cursor: pointer;
  color: #2196f3;
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
</style>
