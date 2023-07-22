<script lang="ts" setup>
import { Test } from "@/types";
import { useTestStore } from "@/stores/test";
import { useSubjectStore } from "@/stores/subject";
import { formatDate } from "@/utils";

const subjectStore = useSubjectStore();
const testsStore = useTestStore();

const subjectCode = ref("");
const chapterOrders = ref([]);
const questionQuantity = ref(0);
const testDay = ref("");
const duration = ref(0);
const isOpenCreateForm = ref(false);
const titleSnack = ref("");
const isShowSnack = ref(false);
const testTime = ref("");
const isShowRandomTestSet = ref(false);
const testSetQuantity = ref(0);
const currentTestId = ref(0);
const isShowTestSetList = ref(false);
const testSetList = ref([]);
const isShowConfirmDelete = ref(false);
const testToDeleteId = ref(null);

//get subjects, chapters
const result = await subjectStore.getSubjects();
const subjects = computed(() => subjectStore.subjects);

const chapters = computed(() => {
  return subjectStore.chapters;
});
watch(subjectCode, () => {
  subjectStore.getChapters(subjectCode.value);
});

// get tests
const res = await testsStore.getTests();
const tests = computed(() => testsStore.tests);

// create test
const createNewTest = () => {
  isOpenCreateForm.value = true;
};

const submitCreateForm = async () => {
  const res = await testsStore.createTest(
    subjectCode.value,
    chapterOrders.value,
    +questionQuantity.value,
    testDay.value,
    +duration.value,
    testTime.value
  );
  await testsStore.getTests();
  isShowSnack.value = true;
  titleSnack.value = "Thêm bài test thành công";
  isOpenCreateForm.value = false;
};

const cancelCreateForm = () => {
  subjectCode.value = "";
  chapterOrders.value = [];
  questionQuantity.value = 0;
  testDay.value = "";
  duration.value = 0;
  isOpenCreateForm.value = false;
};

const getTestDetailRoutePath = async (testNo: number) => {
  console.log("currentTestId", currentTestId.value);
  await testsStore.getTestDetail(currentTestId.value, +testNo);
};

const deleteTest = async (testId: number) => {
  isShowConfirmDelete.value = false;
  const res = await testsStore.deleteById(testId);
};

// random test-set
const openCreateTestSetDialog = async (testId: number) => {
  isShowRandomTestSet.value = true;
  currentTestId.value = testId;
};

const createTestSet = async () => {
  await testsStore.createTestSet(+currentTestId.value, +testSetQuantity.value);
  isShowRandomTestSet.value = false;
  await testsStore.getTests();
};

const openTestSetList = (testId: number, testSet: any) => {
  testSetList.value = testSet;
  isShowTestSetList.value = true;
  currentTestId.value = testId;
  console.log("testSetList", testSetList.value);
};

//export
const exportTestSet = async (testSetId: number) => {
  await testsStore.exportTest(currentTestId.value, testSetId);
};
</script>

<template>
  <h2 class="title">QUẢN LÝ ĐỀ THI</h2>

  <div class="create-tests">
    <v-btn @click="createNewTest" :disabled="isOpenCreateForm"
      ><v-icon icon="mdi-plus" />Thêm mới đề thi</v-btn
    >

    <div class="dialog-create-question">
      <v-row justify="center">
        <v-dialog v-model="isOpenCreateForm" persistent width="800">
          <v-card>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" class="mb-4">
                    <v-autocomplete
                      clearable
                      label="Nhập tên môn"
                      :items="subjects"
                      item-title="title"
                      item-value="code"
                      v-model="subjectCode"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" class="mb-4">
                    <v-select
                      label="Chương"
                      :items="chapters"
                      item-title="order"
                      item-value="id"
                      class="select"
                      multiple
                      v-model="chapterOrders"
                      :variant="'outlined'"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" class="mb-4">
                    <v-text-field
                      label="Nhập số lượng câu"
                      required
                      :placeholder="'Nhập số lượng câu'"
                      v-model="questionQuantity"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" class="mb-4">
                    <v-text-field
                      required
                      label="Nhập ngày kiểm tra"
                      type="date"
                      :placeholder="'Nhập ngày kiểm tra'"
                      v-model="testDay"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" class="mb-4">
                    <v-text-field
                      required
                      label="Nhập giờ kiểm tra"
                      type="time"
                      :placeholder="'Nhập giờ kiểm tra'"
                      v-model="testTime"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      label="Nhập thời gian làm bài"
                      required
                      :placeholder="'Nhập thời gian làm bài'"
                      v-model="duration"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="cancelCreateForm">Huỷ</v-btn>
              <v-btn @click="submitCreateForm">Thêm</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </div>
  </div>
  <v-table fixed-header height="450px" class="test-table">
    <thead>
      <tr>
        <th class="text-center">ID</th>
        <th class="text-center">Môn học</th>
        <th class="text-center">Ngày tạo</th>
        <th class="text-center">Ngày mở đề</th>
        <th class="text-center">Giờ mở đề</th>
        <!-- <th class="text-center">Tổng điểm</th> -->
        <th class="text-center">Thời gian làm bài (phút)</th>
        <th class="text-center">Random mã đề</th>
        <th class="text-center">Chi tiết mã đề</th>
        <th class="text-center">Hành động</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="test in tests" :key="test.id">
        <td class="text-center">{{ test.id }}</td>
        <td class="text-center">{{ test.subjectTitle }}</td>
        <td class="text-center">{{ formatDate(test.createdAt) || "-" }}</td>
        <td class="text-center">{{ test.testDay }}</td>
        <td class="text-center">{{ test.testTime }}</td>
        <!-- <td class="text-center">{{ test.totalPoint }}</td> -->
        <td class="text-center">{{ test.duration }}</td>
        <td
          class="text-center random"
          @click="openCreateTestSetDialog(test.id)"
        >
          Random
        </td>
        <td
          class="text-center random"
          @click="openTestSetList(test.id, test.testSetNos)"
        >
          Chi tiết
        </td>
        <td class="action text-center">
          <v-icon
            size="small"
            class="me-2"
            @click="
              isShowConfirmDelete = true;
              testToDeleteId = test.id;
            "
          >
            mdi-delete
          </v-icon>
        </td>
      </tr>
    </tbody>
  </v-table>
  <template>
    <div class="text-center ma-2">
      <v-snackbar v-model="isShowSnack" :timeout="1200" :color="'#2196F3'">
        {{ titleSnack }}
      </v-snackbar>
    </div>
  </template>

  <v-dialog v-model="isShowRandomTestSet" persistent width="400" height="400">
    <v-card>
      <v-container>
        <div class="test-set">
          <v-text-field
            label="Nhập số lượng mã đề"
            v-model="testSetQuantity"
          ></v-text-field>
          <v-btn @click="createTestSet">Lưu</v-btn>
        </div>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="isShowRandomTestSet = false"
        >
          Đóng
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="isShowTestSetList" persistent width="400" height="400">
    <v-card>
      <v-container>
        <h3>Chi tiết đề thi</h3>
        <div class="test-set-list">
          <div
            class="test-set-item"
            v-for="(testSet, index) in testSetList"
            :key="index"
          >
            <span class="code">{{ testSet }}</span>
            <span class="export" @click="exportTestSet(testSet)">export</span>
            <span class="detail" @click="getTestDetailRoutePath(testSet)"
              ><nuxt-link to="/teacher/tests/detail" class="link"
                >xem chi tiết</nuxt-link
              ></span
            >
          </div>
        </div>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="isShowTestSetList = false"
        >
          Đóng
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowConfirmDelete" persistent width="400" height="400">
    <v-card>
      <v-container>
        <h3>Bạn có muốn xóa đề thi này không?</h3>
      </v-container>
      <v-card-actions>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="deleteTest(testToDeleteId ?? 0)"
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

<style lang="scss" scoped>
.title {
  padding-bottom: 16px;
  border-bottom: 1px solid $color-gray;
  margin-bottom: 12px;
}

.create-tests {
  margin-bottom: 26px;
}

.test-table {
  cursor: pointer;
  text-align: center;
}

.form-create {
  margin-bottom: 16px;

  > .form {
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    display: flex;
    margin: 16px 0;
  }
  > .action {
    display: flex;
    gap: 24px;
    color: $color-white;
  }
}

.link {
  text-decoration: none;
}

.random {
  color: $primary-color;
}

.test-set {
  display: flex;
  margin: 16px;
  align-items: center;
  gap: 32px;
}

.test-set-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;

  > .test-set-item {
    display: flex;
    gap: 16px;
    cursor: pointer;
  }

  > .test-set-item > .export {
    color: $primary-color;
  }
}

:deep(.v-table__wrapper) {
  height: calc(100vh - 350px) !important;
}
</style>
