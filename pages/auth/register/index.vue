<script lang="ts" setup>
import { signUp } from "@/models/auth";

definePageMeta({
  layout: "auth",
});

const form = ref();
const username = ref("");
const email = ref("");
const password = ref("");
const showPassword = ref(false);

const onSubmit = async () => {
  if (!form) return;
  const res = await signUp(username.value, email.value, password.value);
};

const requiredName = (v: any) => !!v || `Full name is required`;
const requiredEmail = (v: any) => {
  //   if(!v ) return true
  //   if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(v)) return true
  //   return 'Must be a valid e-mail.'
  return true;
};
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
          label="Nhập họ và tên"
        ></v-text-field>
        <v-text-field
          v-model="email"
          :rules="[requiredEmail]"
          class="mb-2"
          clearable
          label="Nhập email"
        ></v-text-field>
        <v-text-field
          v-model="password"
          :rules="[requiredPassword]"
          clearable
          :type="showPassword ? 'text' : 'password'"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
          label="Nhập mật khẩu"
          placeholder="Nhập mật khẩu"
          class="pass"
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
          Đăng ký
        </v-btn>
      </v-form>
    </div>
  </v-sheet>
</template>

<style lang="scss" scoped>
.login-form {
  background-color: $color-white;

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
    border: 1px solid $color-gray;
    padding: 36px;
    border-radius: 4px;
  }
}

.pass {
  :deep(.v-input__append) {
    margin-left: -100px;
  }
}
</style>
