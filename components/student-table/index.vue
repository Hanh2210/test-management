<script lang="ts" setup>
import { Student } from "@/types";
import { VDataTable } from "vuetify/labs/VDataTable";
import { useStudentStore } from "@/stores/student";

const isEditStudent = ref(false);
const studentStore = useStudentStore();

const studentById = ref({});
const titleSnack = ref("");
const isShowSnack = ref(false);
const isShowConfirmDelete = ref(false);
const studentToDeleteId = ref(null);
//get students
const res = await studentStore.getStudents();
const students = computed(() => studentStore.students);

const openDialogEditStudent = (student: any) => {
  studentById.value = student.columns;
  isEditStudent.value = true;
};

const closeDialog = () => {
  isEditStudent.value = false;
};

const editStudent = async (e: any) => {
  const id = e.student.value.id;
  const fullName = e.student.value.fullName;
  const code = e.student.value.code;
  const birthday = e.student.value.birthday;
  const gender = e.student.value.gender;
  const phoneNumber = e.student.value.phoneNumber;
  const course = e.student.value.course;
  const email = e.student.value.email;
  const res = await studentStore.updateById(
    id,
    fullName,
    code,
    birthday,
    gender,
    phoneNumber,
    course,
    email
  );

  if (res) {
    isShowSnack.value = true;
    titleSnack.value = "Sửa sinh viên thành công!";
    isEditStudent.value = false;
  }
};

// delete
const deleteStudent = async (item: any) => {
  isShowConfirmDelete.value = false;
  const res = await studentStore.deleteById(item.columns.id);
  isShowSnack.value = true;
  titleSnack.value = "Xoá thành công";
};

const headers = [
  { key: "id", title: "ID" },
  { key: "fullName", title: "Họ và tên" },
  { key: "code", title: "MSSV" },
  { key: "birthday", title: "Năm sinh" },
  { key: "gender", title: "Giới tính" },
  { key: "course", title: "Khóa" },
  { key: "phoneNumber", title: "Điện thoại" },
  { key: "email", title: "Email" },
  { key: "actions", title: "Hành động", sortable: false },
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
  <h2 class="title">DANH SÁCH SINH VIÊN</h2>
  <student-table-create />
  <div class="wrapper">
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Tìm kiếm sinh viên"
      single-line
      hide-details
      class="search"
    ></v-text-field>

    <v-data-table
      :headers="headers"
      :items="students"
      fixed-header
      height="400px"
      :search="search"
      hover
      :items-per-page-options="itemsPerPageOptions"
      :items-per-page-text="'Số sinh viên mỗi trang'"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon size="small" class="me-2" @click="openDialogEditStudent(item)">
          mdi-pencil
        </v-icon>
        <v-icon
          size="small"
          @click="
            isShowConfirmDelete = true;
            studentToDeleteId = item;
          "
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </div>

  <student-table-edit
    :isEditStudent="isEditStudent"
    :studentById="studentById"
    @close="closeDialog"
    @edit="editStudent"
  />
  <template>
    <div class="text-center ma-2">
      <v-snackbar v-model="isShowSnack" :timeout="1200" :color="'#2196F3'">
        {{ titleSnack }}
      </v-snackbar>
    </div>
  </template>
  <v-dialog v-model="isShowConfirmDelete" persistent width="400" height="400">
    <v-card>
      <v-container>
        <h3>Bạn có muốn xóa sinh viên này không?</h3>
      </v-container>
      <v-card-actions>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="deleteStudent(studentToDeleteId ?? 0)"
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

<style scoped lang="scss">
.title {
  padding-bottom: 16px;
  border-bottom: 1px solid $color-gray;
  margin-bottom: 12px;
}

.wrapper {
  margin-top: 32px;

  > .search {
    margin-bottom: 24px;
    width: 400px;
  }
}

:deep(.v-table__wrapper) {
  height: calc(100vh - 350px) !important;
}
</style>
