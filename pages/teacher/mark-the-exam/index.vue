<script lang="ts" setup>
import { useExamClassStore } from "@/stores/exam-class";

const examClassStore = useExamClassStore();
const studentStore = useStudentStore();
const classCode = ref("");
const fileImages = ref([]);
const examClasses = computed(() => examClassStore.examClasses);
// get exam class
await examClassStore.getExamClasses();
const formData = ref(new FormData());

const uploadImages = async () => {
  formData.value.append("files", fileImages.value[0]);
  try {
    const res = await studentStore.uploadImages(
      classCode.value,
      formData.value
    );
    fileImages.value = [];
  } catch (err) {
    console.error(err);
  }
};

const readImages = async () => {
  const res = await studentStore.readImages(classCode.value);
};
const studentTests = computed(() => studentStore.examClass);
const isShowAnswer = ref(false);
const openAnswerDialog = async () => {
  isShowAnswer.value = true;
};
</script>
<template>
  <h2 class="title">CHẤM ĐIỂM TỰ ĐỘNG</h2>
  <div class="select-options">
    <v-select
      label="--Chọn lớp thi--"
      :items="examClasses"
      item-title="roomName"
      item-value="code"
      class="select"
      v-model="classCode"
      :variant="'outlined'"
    ></v-select>
  </div>
  <div class="upload-image">
    <v-file-input
      class="file"
      label="Chọn ảnh"
      variant="filled"
      v-model="fileImages"
      multiple
      prepend-icon="mdi-camera"
    ></v-file-input>
    <v-btn @click="uploadImages">upload ảnh</v-btn>
    <v-btn @click="readImages">đọc ảnh</v-btn>
  </div>
  <div class="table-container">
    <v-table class="answer-table" fixed-header height="500px">
      <thead>
        <tr class="row-head">
          <th class="cell text-center">STT</th>
          <th class="cell text-center">Số báo danh</th>
          <th class="cell text-center">Mã đề</th>
          <th class="cell text-center">Số Câu Đúng</th>
          <th class="cell text-center">Điểm</th>
          <th class="cell text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(studentTest, index) in studentTests" :key="index">
          <td class="cell text-center">{{ index + 1 }}</td>
          <td class="cell text-center">{{ studentTest.studentCode }}</td>
          <td class="cell text-center">{{ studentTest.testNo }}</td>
          <td class="cell text-center">{{ studentTest.testNo }}</td>
          <td class="cell text-center">{{ studentTest.testNo }}</td>
          <td class="cell text-center details" @click="openAnswerDialog()">
            Chi tiết
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
  <v-row justify="center">
    <v-dialog v-model="isShowAnswer" width="600">
      <v-card>
        <v-card-title>
          <span class="text-h5">Chi tiết bài làm</span>
        </v-card-title>
        <v-table fixed-header height="300px">
          <thead>
            <tr>
              <th class="text-left">Câu</th>
              <th class="text-left">Đáp án</th>
            </tr>
          </thead>
          <tbody v-for="(studentTest, index) in studentTests" :key="index">
            <tr v-for="answer in studentTest.answers" :key="answer.questionNo">
              <td>{{ answer.questionNo }}</td>
              <td>{{ answer.isSelected }}</td>
            </tr>
          </tbody>
        </v-table>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="details" variant="text" @click="isShowAnswer = false">
            ĐÓNG
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style lang="scss" scoped>
:deep(.v-table__wrapper) {
  height: calc(100vh - 350px) !important;
}
.title {
  padding-bottom: 16px;
  border-bottom: 1px solid $color-gray;
  margin-bottom: 12px;
}

.select-options {
  width: 400px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.upload-image {
  margin-left: 16px;

  > .file {
    :deep(.v-input__control) {
      width: 328px;
      height: 50px;
      overflow: hidden;
    }
  }
}

.file {
  width: 400px;
  display: inline-grid;
  margin-right: 30px;
}

.answer-test {
  overflow: auto;
}
/* Thêm CSS để tạo container cho bảng và kéo thanh scroll ngang */
.table-container {
  width: 100%;
  overflow-x: auto;
  margin-top: 16px;
}

/* Điều chỉnh kích thước cột câu */
.answer-table .cell.text-center:nth-child(4) {
  min-width: 200px;
  overflow: auto;
}

/* Điều chỉnh kích thước các cột khác nếu cần thiết */
.answer-table .cell.text-center:not(:nth-child(4)) {
  min-width: 100px;
}

/* Thiết lập chiều rộng tổng cộng của bảng */
.answer-table {
  min-width: 600px;
}
.details {
  color: $primary-color;
  cursor: pointer;
}
</style>
