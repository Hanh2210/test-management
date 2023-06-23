<script lang="ts" setup>
import { useExamClassStore } from "@/stores/exam-class";
import { useTestStore } from "@/stores/test";
import { useSubjectStore } from "@/stores/subject";
import { useStudentStore } from "@/stores/student";

const examClassStore = useExamClassStore();
const testStore = useTestStore();
const subjectStore = useSubjectStore();
const studentStore = useStudentStore();

// get
await examClassStore.getExamClasses();
await testStore.getTests();
await subjectStore.getSubjects();
await studentStore.getStudents();

const examClasses = computed(() => examClassStore.examClasses);
const subjects = computed(() => subjectStore.subjects);
const tests = computed(() => testStore.tests);
const students = computed(() => studentStore.students);

const tab = ref(null);
const roomName = ref("");
const semester = ref("");
const code = ref("");
const studentIds = ref([]);
const testId = ref(0);
const isPublicExam = ref(false);
const isShowCreateExamClass = ref(false);

const openDialog = () => {
  isShowCreateExamClass.value = true;
};

const clear = () => {
  roomName.value = "";
  semester.value = "";
  code.value = "";
  studentIds.value = [];
  testId.value = 0;
  isShowCreateExamClass.value = false;
};

const submit = async (): Promise<void> => {
  const res = await examClassStore.createExamClass({
    roomName: roomName.value,
    semester: semester.value,
    code: code.value,
    studentIds: studentIds.value,
    testId: testId.value,
  });

  clear();
};

const cancel = () => clear();
</script>

<template>
  <h2 class="title">Quản lý lớp thi</h2>

  <div class="nav-info">
    <v-card class="card">
      <v-tabs v-model="tab" centered stacked class="tabs">
        <v-tab value="tab-1"> Tạo lớp thi </v-tab>
        <v-tab value="tab-2"> Import đề thi </v-tab>
        <v-tab value="tab-3"> Import danh sách sinh viên </v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item :value="'tab-1'">
          <h3 class="heading" @click="openDialog">Tạo lớp thi</h3>
          <div class="create-exam-class">
            <v-row justify="center">
              <v-dialog v-model="isShowCreateExamClass" persistent width="700">
                <v-card>
                  <v-card-text>
                    <v-container>
                      <div class="select-options">
                        <v-text-field
                          v-model="roomName"
                          label="Nhập tên lớp"
                          required
                        ></v-text-field>
                        <v-text-field
                          v-model="semester"
                          label="Nhập học kỳ"
                          required
                        ></v-text-field>
                        <v-select
                          label="--Chọn môn học--"
                          :items="subjects"
                          item-title="title"
                          item-value="code"
                          class="select"
                          v-model="code"
                          :variant="'outlined'"
                        ></v-select>
                        <v-select
                          label="--Chọn sinh viên--"
                          :items="students"
                          item-title="username"
                          item-value="id"
                          class="select"
                          multiple
                          v-model="studentIds"
                          :variant="'outlined'"
                        ></v-select>
                        <v-select
                          label="--Chọn bài kiểm tra--"
                          :items="tests"
                          item-title="subjectTitle"
                          item-value="id"
                          class="select"
                          v-model="testId"
                          :variant="'outlined'"
                        ></v-select>
                      </div>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="cancel">
                      Huỷ
                    </v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="submit">
                      Tạo
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-row>
          </div>

          <v-switch
            class="toggle"
            label="Public đề thi"
            color="primary"
            inset
            v-model="isPublicExam"
          ></v-switch>
        </v-window-item>
        <v-window-item :value="'tab-2'">
          <v-file-input
            clearable
            label="Chọn đề thi"
            class="file"
          ></v-file-input>
          <v-btn class="button">Import đề thi</v-btn>
        </v-window-item>
        <v-window-item :value="'tab-3'">
          <v-file-input
            clearable
            label="Chọn danh sách sinh viên"
            class="file"
          ></v-file-input>
          <v-btn class="button">Import danh sách sinh viên</v-btn>
        </v-window-item>
      </v-window>
    </v-card>
  </div>

  <div class="exam-class-list">
    <h3 class="header">Danh sách lớp thi</h3>
    <v-table fixed-header height="500px">
      <thead>
        <tr>
          <th class="text-center">ID</th>
          <th class="text-center">Tên lớp</th>
          <th class="text-center">Học kỳ</th>
          <th class="text-center">Mã lớp</th>
          <th class="text-center">Ngày tạo</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="examClass in examClasses" :key="examClass.id">
          <td class="text-center">{{ examClass.id }}</td>
          <td class="text-center">{{ examClass.roomName }}</td>
          <td class="text-center">{{ examClass.semester }}</td>
          <td class="text-center">{{ examClass.code }}</td>
          <td class="text-center">
            {{ examClass.createdDate }}
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<style lang="scss" scoped>
.title {
  padding-bottom: 16px;
  border-bottom: 1px solid $color-gray;
  margin-bottom: 12px;
}

.heading {
  margin: 16px;
  color: #9c27b0;
  cursor: pointer;
}

.file {
  :deep(.v-input__control) {
    overflow: hidden;
    width: 400px;
  }

  :deep(.v-input__prepend) {
    margin-left: 12px;
  }
}

.toggle {
  :deep(.v-input__control) {
    padding-left: 16px;
  }
}
.button {
  margin-bottom: 32px;
  margin-left: 16px;
}

.select-options {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.exam-class-list > .header {
  margin: 24px 0;
}
</style>
