<script lang="ts" setup>
import { VDataTable } from "vuetify/labs/VDataTable";
import { Student } from "@/types";
import { useStudentStore } from "@/stores/student";

const studentStore = useStudentStore();

//get students
const res = await studentStore.getStudents();
const students = computed(() => studentStore.students);

// export students
const exportStudents = async () => {
  await studentStore.exportStudents();
};

const headers = [
  { key: "fullName", title: "Họ và tên" },
  { key: "code", title: "MSSV" },
  { key: "birthday", title: "Năm sinh" },
  { key: "gender", title: "Giới tính" },
  { key: "course", title: "Khóa" },
  { key: "phoneNumber", title: "Điện thoại" },
  { key: "email", title: "Email" },
];

const itemsPerPageOptions = [
  { title: "5", value: 5 },
  { title: "10", value: 10 },
  { title: "20", value: 20 },
  { title: "50", value: 50 },
];

const search = ref("");
</script>

<template>
  <h2 class="title">Thông tin sinh viên</h2>
  <div class="student-info">
    <div class="action">
      <v-btn @click="exportStudents">Export danh sách </v-btn>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </div>

    <div class="list-students">
      <v-data-table
        :headers="headers"
        :items="students"
        fixed-header
        height="400px"
        :search="search"
        hover
        :items-per-page-options="itemsPerPageOptions"
        :items-per-page-text="'Số sinh viên mỗi trang'"
      ></v-data-table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.title {
  padding-bottom: 16px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 12px;
}
.student-info {
  > .action {
    width: 900px;
    display: flex;
    align-items: center;
    gap: 60px;
    overflow: hidden;
  }
}

.list-students {
  margin-top: 16px;
  cursor: pointer;
}

.wrap {
  display: flex;
  align-items: center;
}
</style>
