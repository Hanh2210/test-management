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
  <v-table class="answer-table" fixed-header height="500px">
    <thead>
      <tr class="row-head">
        <th class="cell text-center">STT</th>
        <th class="cell text-center">Số báo danh</th>
        <th class="cell text-center">Mã đề</th>
        <th class="cell text-center">Câu</th>
        <th class="cell text-center">Điểm</th>
        <th class="cell text-center"></th>
      </tr>
    </thead>
  </v-table>
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
</style>
