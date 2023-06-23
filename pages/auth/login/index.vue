<script lang="ts" setup>
import { signin } from "@/models/auth";
definePageMeta({
  layout: "auth",
});
const form = ref();
const username = ref("");
const password = ref("");

const onSubmit = async () => {
  if (!form) return;
  const res = await signin(username.value, password.value);
  console.log(res);
};

const requiredName = (v: any) => !!v || `Full name is required`;

const requiredPassword = (v: any) => !!v || `Password is required`;
</script>

<template>
  <v-sheet class="login-form" rounded :height="'100%'">
    <div class="wrapper">
      <h1 class="title">TEST MANAGEMENT</h1>
      <v-form v-model="form" @submit.prevent="onSubmit" class="form">
        <v-text-field
          v-model="username"
          :rules="[requiredName]"
          class="mb-2"
          clearable
          label="Nhập username"
          placeholder="Nhập username"
        ></v-text-field>

        <v-text-field
          v-model="password"
          :rules="[requiredPassword]"
          clearable
          label="Nhập mật khẩu"
          placeholder="Nhập mật khẩu"
        ></v-text-field>

        <br />

        <v-btn
          :disabled="!form"
          block
          color="success"
          size="large"
          type="submit"
          variant="elevated"
        >
          Đăng nhập
        </v-btn>
      </v-form>
    </div>
  </v-sheet>
</template>

<style lang="scss" scoped>
.login-form {
  background-color: #fff;

  > .wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  > .wrapper > .title {
    margin-bottom: 56px;
    color: $primary-color;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 400px;
    border: 1px solid #ccc;
    padding: 36px;
    border-radius: 4px;
  }
}
</style>
