<script lang="ts" setup>
import { signIn, SignInResponse } from "@/models/auth";
import { AUTH_USER, AUTH_USER_TYPE } from "@/types/index";

definePageMeta({
  layout: "auth",
});
const router = useRouter();
const form = ref();
const username = ref("");
const password = ref("");
const showPassword = ref(false);
const KEY_AUTH = "KEY_AUTH";

const onSubmit = async (): Promise<void> => {
  if (!form) return;
  try {
    const res = await signIn(username.value, password.value);
    const { data } = res;
    if (data) {
      localStorage.setItem(KEY_AUTH, JSON.stringify(data));
      // console.log("ok", data);
      const { roles } = data;
      handleRouter(roles);
    }
  } catch (error) {
    console.log(error);
  }
};

const handleRouter = (roles: AUTH_USER_TYPE[]): void => {
  roles.forEach((role) => {
    switch (role) {
      case "ROLE_ADMIN": {
        router.push("/admin/home");
        break;
      }
      case "ROLE_STUDENT": {
        router.push("/student/home");
        break;
      }
      case "ROLE_TEACHER": {
        router.push("/teacher/home");
        break;
      }
      default:
        break;
    }
  });
};

const requiredName = (v: any) => !!v || `Full name is required`;

const requiredPassword = (v: any) => !!v || `Password is required`;

onMounted(() => {
  try {
    const dataSignIn: string | null = localStorage.getItem(KEY_AUTH);
    // console.log(dataSignIn);
    if (dataSignIn) {
      const result: SignInResponse = JSON.parse(dataSignIn.toString());
      const { accessToken, roles } = result;
      if (accessToken && roles) {
        handleRouter(roles);
      }
    }
  } catch (error) {
    console.log(error);
  }
});
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
          :type="showPassword ? 'text' : 'password'"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
          label="Nhập mật khẩu"
          placeholder="Nhập mật khẩu"
          class="pass"
        >
        </v-text-field>

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
