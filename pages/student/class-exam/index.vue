<script lang="ts" setup>
import { VDataTable } from "vuetify/labs/VDataTable";
import { Student } from "@/types";
import { useStudentStore } from "@/stores/student";
import { formatDate } from "@/utils";

const studentStore = useStudentStore();

const isOpenExamClassDetail = ref(false);
const classDetail = ref({});
const classCode = ref();

//get class
const res = await studentStore.getExamClass();
const examClasses = computed(() => studentStore.examClass);
const examClassDetail = computed(() => studentStore.examClassDetail);
const testDetail = computed(() => studentStore.testDetail);

const openExamClassDetail = async (classId: number, code: string) => {
  await studentStore.getExamClassDetail(classId);
  classDetail.value = examClassDetail.value;
  classCode.value = code;
  isOpenExamClassDetail.value = true;
};

const testOnline = async () => {
  const router = useRouter();
  router.push(`/student/online-exam?classCode=${classCode.value}`);
  console.log("đi tới màn thi");
};
</script>

<template>
  <h2 class="title">Danh sách lớp thi</h2>
  <div class="exam-class">
    <v-table fixed-header height="450px" class="table">
      <thead>
        <tr>
          <th class="text-center">ID</th>
          <th class="text-center">Mã lớp</th>
          <th class="text-center">Tên lớp thi</th>
          <th class="text-center">Học kỳ</th>
          <th class="text-center">Ngày tạo</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="examClass in examClasses" :key="examClass.id">
          <td class="text-center">{{ examClass.id }}</td>
          <td class="text-center">{{ examClass.code }}</td>
          <td class="text-center">{{ examClass.roomName }}</td>
          <td class="text-center">{{ examClass.semester }}</td>
          <td class="text-center">
            {{ formatDate(examClass.createdDate) || "-" }}
          </td>
          <td
            class="text-center detail"
            @click="openExamClassDetail(examClass.id, examClass.code)"
          >
            Chi tiết
          </td>
        </tr>
      </tbody>
    </v-table>

    <v-dialog v-model="isOpenExamClassDetail" persistent width="700">
      <v-card>
        <v-card-title>
          <span class="text-h5">Chi tiết lớp thi</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  required
                  v-model="classDetail.test.subjectCode"
                  label="Mã môn"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="mt-4">
                <v-text-field
                  required
                  v-model="classDetail.test.subjectTitle"
                  label="Tên môn"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="mt-4">
                <v-text-field
                  required
                  v-model="classDetail.test.testDay"
                  label="Ngày thi"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="mt-4">
                <v-text-field
                  required
                  v-model="classDetail.test.testTime"
                  label="Giờ thi"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="mt-4">
                <v-text-field
                  required
                  v-model="classDetail.test.duration"
                  label="Thời gian làm bài(phút)"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="isOpenExamClassDetail = false"
          >
            Đóng
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="testOnline">
            Bắt đầu thi
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
.title {
  padding-bottom: 16px;
  border-bottom: 1px solid $color-gray;
  margin-bottom: 12px;
}

.detail {
  color: $primary-color;
  cursor: pointer;
}
</style>
