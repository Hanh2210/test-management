<script lang="ts" setup>
import { useExamClassStore } from "@/stores/exam-class";
const examClassStore = useExamClassStore();
const classCode = ref("");
const examClasses = computed(() => examClassStore.examClasses);
// get exam class
const searchExamClass = async (code: string): Promise<void> => {
  await examClassStore.getExamClasses();
};
</script>
<template>
  <h2 class="title">Chấm điểm tự động</h2>
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
  <div class="input">
    <v-file-input
      class="file"
      label="File input"
      variant="filled"
      prepend-icon="mdi-camera"
    ></v-file-input>
    <v-btn>Chấm</v-btn>
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
.file {
  width: 400px;
  display: inline-grid;
  margin-right: 30px;
}
</style>
