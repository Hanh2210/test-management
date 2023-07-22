<script lang="ts" setup>
import { Teacher } from "@/types";
import { useTeacherStore } from "@/stores/teacher";

const teacherStore = useTeacherStore();

const fullName = ref("");
const code = ref("");
const username = ref("");
const password = ref("");
const birthday = ref("");
const gender = ref("");
const phoneNumber = ref("");
const email = ref("");
const isCreateTeacher = ref(false);
const titleSnack = ref("");
const isShowSnack = ref(false);
const isShowDialogImport = ref(false);

const cancelCreateForm = () => {
  fullName.value = "";
  code.value = "";
  username.value = "";
  password.value = "";
  birthday.value = "";
  gender.value = "";
  phoneNumber.value = "";
  email.value = "";
  isCreateTeacher.value = false;
};

// create
const submit = async () => {
  const res = await teacherStore.createTeacher(
    fullName.value,
    code.value,
    username.value,
    password.value,
    birthday.value,
    gender.value,
    phoneNumber.value,
    email.value
  );
  await teacherStore.getTeachers();
  cancelCreateForm();
};

const createTeacher = () => {
  isCreateTeacher.value = true;
};

// import
const file = ref();
const formData = new FormData();

const uploadFile = async () => {
  formData.append("file", file.value[0]);
  try {
    const res = await teacherStore.importTeachers(formData);
    file.value = [];
    isShowDialogImport.value = false;
  } catch (err) {}
};

// export teachers
const exportTeachers = async () => {
  await teacherStore.exportTeachers();
};
</script>

<template>
  <div class="teacher-management">
    <div class="action">
      <v-btn @click="createTeacher"
        ><v-icon icon="mdi-plus" />Thêm giáo viên</v-btn
      >
      <v-spacer />
      <v-menu class="menu-drop">
        <template v-slot:activator="{ props }">
          <v-btn color="indigo-darken-3" v-bind="props"> Actions </v-btn>
        </template>
        <v-list>
          <v-list-item key="1" class="menu">
            <v-list-item-title @click="exportTeachers"
              >Export danh sách</v-list-item-title
            >
          </v-list-item>
          <v-list-item key="2" class="menu">
            <v-list-item-title @click="isShowDialogImport = true"
              >Import danh sách</v-list-item-title
            >
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <div class="dialog-create-teacher">
      <v-row justify="center">
        <v-dialog v-model="isCreateTeacher" persistent width="800">
          <v-card>
            <v-card-title>
              <span class="text-h5">Thêm mới giáo viên</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="fullName"
                      label="Nhập họ và tên"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="code"
                      label="Nhập mã GV"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="username"
                      label="Nhập tên đăng nhập"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="password"
                      label="Nhập mật khẩu"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="birthday"
                      label="Nhập ngày sinh"
                      required
                      type="date"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="gender"
                      label="Nhập giới tính"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="phoneNumber"
                      label="Nhập số điện thoại"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="email"
                      label="Nhập email"
                      required
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
                @click="cancelCreateForm"
              >
                Huỷ
              </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="submit">
                Lưu
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <v-row justify="center">
        <v-dialog v-model="isShowDialogImport" persistent width="500">
          <v-card>
            <v-card-title>
              <span class="text-h5">Import danh sách giáo viên</span>
            </v-card-title>
            <v-card-text>
              <v-file-input
                v-model="file"
                clearable
                label="Import danh sách giáo viên"
                variant="underlined"
              ></v-file-input>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="isShowDialogImport = false"
              >
                Huỷ
              </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="uploadFile">
                Lưu
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </div>
  </div>
  <template>
    <div class="text-center ma-2">
      <v-snackbar v-model="isShowSnack" :timeout="1200" :color="'#2196F3'">
        {{ titleSnack }}
      </v-snackbar>
    </div>
  </template>
</template>
<style scoped lang="scss">
.teacher-management {
  > .action {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 60px;
    overflow: hidden;
  }
}
.menu-drop {
  cursor: pointer;
}
.menu:hover {
  background-color: #d9d9d9;
}
</style>
