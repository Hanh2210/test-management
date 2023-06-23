<script lang="ts" setup>
import { VDataTable } from "vuetify/labs/VDataTable";
import { Teacher } from "@/types";
import { useTeacherStore } from "@/stores/teacher";

const isEditTeacher = ref(false);
const teacherStore = useTeacherStore();

const teacherById = ref({});
const titleSnack = ref("");
const isShowSnack = ref(false);

//get teachers
const res = await teacherStore.getTeachers();
const teachers = computed(() => teacherStore.teachers);

const openDialogEditTeacher = (teacher: any) => {
  teacherById.value = teacher.columns;
  isEditTeacher.value = true;
};

const closeDialog = () => {
  isEditTeacher.value = false;
};

const editTeacher = async (e: any) => {
  const id = e.teacher.value.id;
  const fullName = e.teacher.value.fullName;
  const code = e.teacher.value.code;
  const birthday = e.teacher.value.birthday;
  const gender = e.teacher.value.gender;
  const phoneNumber = e.teacher.value.phoneNumber;
  const email = e.teacher.value.email;
  const res = await teacherStore.updateById(
    id,
    fullName,
    code,
    birthday,
    gender,
    phoneNumber,
    email
  );

  if (res) {
    isShowSnack.value = true;
    titleSnack.value = "Sửa giáo viên thành công!";
    isEditTeacher.value = false;
  }
};

// delete
const deleteTeacher = async (item: any) => {
  const res = await teacherStore.deleteById(item.columns.id);
  isShowSnack.value = true;
  titleSnack.value = "Xoá thành công";
};

const headers = [
  { key: "id", title: "ID" },
  { key: "code", title: "Mã GV" },
  { key: "fullName", title: "Họ và tên" },
  { key: "birthday", title: "Năm sinh" },
  { key: "gender", title: "Giới tính" },
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
  <h2 class="title">DANH SÁCH GIÁO VIÊN</h2>
  <teacher-table-create />
  <div class="wrapper">
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Tìm kiếm giáo viên"
      single-line
      hide-details
      class="search"
    ></v-text-field>

    <v-data-table
      :headers="headers"
      :items="teachers"
      fixed-header
      height="400px"
      :search="search"
      hover
      :items-per-page-options="itemsPerPageOptions"
      :items-per-page-text="'Số giáo viên mỗi trang'"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon size="small" class="me-2" @click="openDialogEditTeacher(item)">
          mdi-pencil
        </v-icon>
        <v-icon size="small" @click="deleteTeacher(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
  </div>

  <teacher-table-edit
    :isEditTeacher="isEditTeacher"
    :teacherById="teacherById"
    @close="closeDialog"
    @edit="editTeacher"
  />
  <template>
    <div class="text-center ma-2">
      <v-snackbar v-model="isShowSnack" :timeout="1200" :color="'#2196F3'">
        {{ titleSnack }}
      </v-snackbar>
    </div>
  </template>
</template>

<style scoped lang="scss">
.title {
  padding-bottom: 16px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 12px;
}

.wrapper {
  margin-top: 32px;

  > .search {
    margin-bottom: 24px;
    width: 400px;
  }
}
</style>
