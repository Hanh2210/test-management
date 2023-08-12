<script lang="ts" setup>
import { useExamClassStore } from "@/stores/exam-class";

const examClassStore = useExamClassStore();
const studentStore = useStudentStore();
const layoutStore = useLayoutStore();
const classCode = ref("");
const fileImages = ref([]);
const titleSnack = ref("");
const isShowSnack = ref(false);
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
  layoutStore.changeShowLoading(true);
  const res = await studentStore.readImages(classCode.value);
  layoutStore.changeShowLoading(false);
  isShowSnack.value = true;
  titleSnack.value = "Đọc ảnh thành công!";
};
const studentTests = computed(() => studentStore.examClass);
const isShowAnswer = ref(false);
const answers = ref([]);
const openAnswerDialog = async (answer: []) => {
  isShowAnswer.value = true;
  answers.value = answer;
  console.log("answer", answers.value);
};
const markTest = async () => {
  // const mark = [
  //   {
  //     classCode: "200789",
  //     studentCode: "20203478",
  //     testNo: 102,
  //     answers: [
  //       {
  //         questionNo: 1,
  //         isSelected: "B",
  //       },
  //     ],
  //   },
  // ];
  console.log("Test", studentTests.value);
  layoutStore.changeShowLoading(true);
  await studentStore.markTest(studentTests.value);
  layoutStore.changeShowLoading(false);
};
const markTests = computed(() => studentStore.examClassMark);
const check = async () => {
  console.log("final", markTests.value);
};
//convert answer
const convertSelection = (isSelected: string) => {
  switch (isSelected) {
    case "1000":
      return "A";
    case "0100":
      return "B";
    case "0010":
      return "C";
    case "0001":
      return "D";
    case "0000":
      return "null";
    default:
      return "";
  }
};
const showIsCorrected = (isCorrected: boolean) => {
  switch (isCorrected) {
    case true:
      return "true";
    case false:
      return "false";
    default:
      return "";
  }
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
    <v-btn @click="markTest">Chấm</v-btn>
    <!-- <v-btn @click="check">Check</v-btn> -->
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
          <th class="cell text-center">Tổng điểm</th>
          <th class="cell text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <!-- <tr v-for="(studentTest, index) in studentTests" :key="index">
          <td class="cell text-center">{{ index + 1 }}</td>
          <td class="cell text-center">{{ studentTest.studentCode }}</td>
          <td class="cell text-center">{{ studentTest.testNo }}</td>
          <td class="cell text-center">{{ markTests[0].mark }}</td>
          <td class="cell text-center">{{ markTests[0].grade }}</td>
          <td class="cell text-center">{{ markTests[0].totalPoint }}</td>
          <td class="cell text-center details" @click="openAnswerDialog()">
            Chi tiết
          </td>
        </tr> -->
        <tr v-for="(markTest, index) in markTests" :key="index">
          <td class="cell text-center">{{ index + 1 }}</td>
          <td class="cell text-center">{{ markTest.studentCode }}</td>
          <td class="cell text-center">{{ markTest.testNo }}</td>
          <td class="cell text-center">{{ markTest.mark }}</td>
          <td class="cell text-center">{{ markTest.grade }}</td>
          <td class="cell text-center">{{ markTest.totalPoint }}</td>
          <td
            class="cell text-center details"
            @click="openAnswerDialog(markTest.answers)"
          >
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
              <th class="text-center">Câu</th>
              <th class="text-center">Câu trả lời</th>
              <th class="text-center">Đáp án</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(answer, index) in answers"
              :key="index"
              class="text-center"
            >
              <td>
                {{ answer.questionNo }}
              </td>
              <td :class="showIsCorrected(answer.isCorrected)">
                {{ convertSelection(answer.isSelected) }}
              </td>
              <td>
                {{ answer.corrected }}
              </td>
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
  <template>
    <div class="text-center ma-2">
      <v-snackbar v-model="isShowSnack" :timeout="1200" :color="'#2196F3'">
        {{ titleSnack }}
      </v-snackbar>
    </div>
  </template>
</template>

<style lang="scss" scoped>
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
.true {
  color: green;
  font-weight: bold;
}
.false {
  color: red;
  font-weight: bold;
}
:deep(.v-btn) {
  margin-right: 16px;
}

:deep(.v-table__wrapper) {
  height: calc(100vh - 320px) !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.09), 0 4px 12px rgba(0, 0, 0, 0.09);
  border-radius: 4px;
}

:deep(.v-table.v-table--fixed-header > .v-table__wrapper > table) {
  border: 1px solid #ccc;
}

:deep(
    .v-table.v-table--fixed-header > .v-table__wrapper > table > thead > tr > th
  ) {
  background-color: #c2c2d6;
}
:deep(.v-data-table-footer) {
  margin-top: 28px;
}
</style>
