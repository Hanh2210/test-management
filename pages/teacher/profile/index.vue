<script lang="ts" setup>
import blankAvatar from "@/assets/images/blank-avatar.png";
const authStore = useAuthStore();
const teacherStore = useTeacherStore();
const authUser = computed(() => authStore.currentUser);

const updateTeacherProfile = async (
  email: string,
  fullName: string,
  birthday: string,
  gender: string,
  phoneNumber: string
) => {
  const res = await teacherStore.updateProfile({
    email,
    fullName,
    birthday,
    gender,
    phoneNumber,
  });
};
</script>

<template>
  <h2 class="title">THÔNG TIN CÁ NHÂN</h2>
  <div class="user-information">
    <div class="avatar">
      <img
        class="image"
        :src="blankAvatar"
        alt="avatar"
        width="200"
        height="200"
      />
      <v-btn variant="outlined" class="button"
        ><v-icon icon="mdi-camera" /> Chọn ảnh mới
      </v-btn>
    </div>

    <div class="wrap">
      <div class="info">
        <div class="detail">
          <v-text-field
            v-model="authUser.username"
            :rules="nameRules"
            disabled
            :counter="10"
            label="Tên đăng nhập"
            required
          ></v-text-field>
          <v-text-field
            v-model="authUser.code"
            :rules="nameRules"
            disabled
            :counter="10"
            label="Mã giáo viên"
            required
          ></v-text-field>
          <v-text-field
            v-model="authUser.fullName"
            :rules="nameRules"
            :counter="10"
            label="Họ và tên"
            required
          ></v-text-field>
          <v-text-field
            v-model="authUser.gender"
            :rules="nameRules"
            :counter="10"
            label="Giới tính"
            required
          ></v-text-field>
        </div>
        <div class="detail">
          <v-text-field
            type="date"
            v-model="authUser.birthday"
            :rules="nameRules"
            :counter="10"
            label="Năm sinh"
            required
          ></v-text-field>
          <v-text-field
            v-model="authUser.phoneNumber"
            :rules="nameRules"
            :counter="10"
            label="Điện thoại"
            required
          ></v-text-field>
          <v-text-field
            v-model="authUser.email"
            :rules="emailRules"
            :counter="10"
            label="Email"
            required
          ></v-text-field>
        </div>
      </div>
      <v-btn
        variant="outlined"
        class="action"
        @click="
          updateTeacherProfile(
            authUser.email,
            authUser.fullName,
            authUser.birthday,
            authUser.gender,
            authUser.phoneNumber
          )
        "
        >Cập nhật
      </v-btn>
    </div>
  </div>
</template>

<style scoped lang="scss">
.title {
  padding-bottom: 16px;
  border-bottom: 1px solid $color-gray;
  margin-bottom: 12px;
}

.user-information {
  display: flex;
  margin-top: 32px;
  > .avatar {
    display: flex;
    flex-direction: column;
    width: 200px;
    height: 200px;
    border: 1px solid $color-gray;
  }
  > .avatar > .button {
    margin-top: 12px;
  }

  > .wrap {
    margin-left: 32px;
    width: 40%;
  }
}
:deep(.v-table__wrapper) {
  height: calc(100vh - 320px) !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.09), 0 4px 12px rgba(0, 0, 0, 0.09);
  border-radius: 4px;
}

:deep(.v-table.v-table--fixed-header > .v-table__wrapper > table) {
  border: 1px solid #ccc;
}

:deep(
    .v-table.v-table--fixed-header > .v-table__wrapper > table > thead > tr > th
  ) {
  background-color: #c2c2d6;
}
:deep(.v-data-table-footer) {
  margin-top: 28px;
}
</style>
