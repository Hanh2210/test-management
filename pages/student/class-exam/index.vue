<script lang="ts" setup>
import { VDataTable } from "vuetify/labs/VDataTable";
import { Student } from "@/types";
import { useStudentStore } from "@/stores/student";
import { formatDate } from "@/utils";
import { count } from "console";

const studentStore = useStudentStore();

const isOpenExamClassDetail = ref(false);
const classDetail = ref({});
const classCode = ref();
const examClassId = ref(0);
const onlineExamState = ref("");
const dateTimeOfTest = ref("");

//get class
const res = await studentStore.getExamClass();
const examClasses = computed(() => studentStore.examClass);
const examClassDetail = computed(() => studentStore.examClassDetail);
const testDetail = computed(() => studentStore.testDetail);
const countDownTime = ref(0);

const timer = ref<NodeJS.Timer>();
const currentTimer = ref<NodeJS.Timer>();

const now = ref(new Date().getTime());

const isDisabledButtonOnlineExam = computed(() => {
  //  disable những bài chưa tới hoặc đã quá hạn
  //return now < dateTimeOfTest || now > dateTimeOfTest;

  // chỉ disabled những bài đã quá hạn
  return (
    now.value >
    new Date(dateTimeOfTest.value).getTime() +
      examClassDetail.value.test.duration * 60 * 1000
  );
});

const disabledButtonOnlineExam = computed(
  () => isDisabledButtonOnlineExam.value || !!countDownTime.value
);

const formatTime = computed(() => {
  if (countDownTime.value <= 0) return "";
  const hours = Math.floor(countDownTime.value / 3600);
  const minutes = Math.floor((countDownTime.value - hours * 3600) / 60);
  const seconds = countDownTime.value % 60;

  return `${hours ? hours + ":" : ""}${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
});

const openExamClassDetail = async (classId: number, code: string) => {
  await studentStore.getExamClassDetail(classId);
  classDetail.value = examClassDetail.value;
  classCode.value = code;
  examClassId.value = classId;
  onlineExamState.value = examClassDetail.value.test.state;
  dateTimeOfTest.value = `${examClassDetail.value.test.testDay} ${examClassDetail.value.test.testTime}`;

  isOpenExamClassDetail.value = true;
  const time = new Date(dateTimeOfTest.value).getTime() - new Date().getTime();
  countDownTime.value =
    time > 0 && Math.floor(time / 1000) - 30 ? Math.floor(time / 1000) - 30 : 0;
  if (onlineExamState.value === "FINISHED") countDownTime.value = 0;
  countDown();
};

const countDown = () => {
  timer.value = setInterval(() => {
    if (countDownTime.value <= 0) clearInterval(timer.value);
    else {
      countDownTime.value -= 1;
    }
  }, 1000);
};

onMounted(() => {
  currentTimer.value = setInterval(() => {
    now.value += 1000;
  }, 1000);
});
onDeactivated(() => {
  clearInterval(timer.value);
  clearInterval(currentTimer.value);
});

watch(isOpenExamClassDetail, (newVal) => {
  if (!newVal) clearInterval(timer.value);
});

const testOnline = async () => {
  const router = useRouter();
  router.push(
    `/student/online-exam?examClassId=${examClassId.value}&classCode=${classCode.value}`
  );
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
          <th class="text-center">Chi tiết</th>
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
            [Chi tiết]
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
              <v-col cols="12" class="mt-4">
                <v-text-field
                  required
                  v-model="classDetail.test.state"
                  label="Trạng thái"
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
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="testOnline"
            :disabled="
              onlineExamState === 'FINISHED' || disabledButtonOnlineExam
            "
          >
            {{ formatTime }} Bắt đầu thi
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
