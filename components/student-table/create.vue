<script lang="ts" setup>
import { Student } from "@/types";
import { useStudentStore } from "@/stores/student";

const studentStore = useStudentStore();

const fullName = ref("");
const code = ref("");
const username = ref("");
const password = ref("");
const birthday = ref("");
const gender = ref("");
const phoneNumber = ref("");
const course = ref(0);
const email = ref("");
const isCreateStudent = ref(false);
const titleSnack = ref("");
const isShowSnack = ref(false);
const isShowDialogImport = ref(false)

// TODO
const submit = async () => {
  const res = await studentStore.createStudent(
    fullName.value,
    code.value,
    username.value,
    password.value,
    birthday.value,
    gender.value,
    phoneNumber.value,
    +course.value,
    email.value
  );
  await studentStore.getStudents();
  isCreateStudent.value = false;
};
const createStudent = () => {
  isCreateStudent.value = true;
};

// import
const file = ref();
const formData = new FormData();

const uploadFile = async () => {
  formData.append("file", file.value[0]);
  try {
    const res = await studentStore.importStudents(formData);
    file.value = []
    isShowDialogImport.value = false
  } catch (err) {

  }


 
  // if (res) {
  //   isShowSnack.value = true;
  //   titleSnack.value = "import danh sách thành công";
  // }
  // console.log(file.value);
};
// export students
const exportStudents = async () => {
  await studentStore.exportStudents();
};
</script>

<template>
  <div class="student-management">
    <div class="action">
      <v-btn @click="createStudent"
        ><v-icon icon="mdi-plus" />Thêm sinh viên</v-btn
      >
      <v-spacer />
      <search />
      <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn
          color="primary"
          v-bind="props"
        >
          Action
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          key="1"
        >
          <v-list-item-title @click="exportStudents">Export Danh sách</v-list-item-title>
        </v-list-item>
        <v-list-item
          key="2"
        >
          <v-list-item-title @click="isShowDialogImport = true">Import danh sách</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    </div>
    <div class="dialog-create-student">
      <v-row justify="center">
        <v-dialog v-model="isCreateStudent" persistent width="1024">
          <v-card>
            <v-card-title>
              <span class="text-h5">Thêm mới sinh viên</span>
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
                      label="Nhập MSSV"
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
                      v-model="course"
                      label="Nhập khoá"
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
                @click="isCreateStudent = false"
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
              <span class="text-h5">Import danh sách sinh viên</span>
            </v-card-title>
            <v-card-text>
              <v-file-input
                v-model="file"
                clearable
                label="Import danh sách sinh viên"
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
.student-management {
  > .action {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 60px;
    overflow: hidden;
  }
}
</style>
