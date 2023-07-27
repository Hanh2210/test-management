<script lang="ts" setup>
import logoHust from "@/assets/images/logo-hust.png";
import blankAvatar from "@/assets/images/blank-avatar.png";
defineProps<{ rail: boolean }>();

const authStore = useAuthStore();
const username = computed(() => authStore.currentUser.username);
const roles = computed(() => authStore.currentUser.roles);
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push("/auth/login");
};

const navigateToProfile = () => {
  roles.value.forEach(async (role: string) => {
    switch (role) {
      case "ROLE_ADMIN": {
        router.push("/admin/profile");
        break;
      }
      case "ROLE_STUDENT": {
        await navigateTo("/student/profile");
        break;
      }
      case "ROLE_TEACHER": {
        router.push("/teacher/profile");
        break;
      }
      default:
        break;
    }
  });
};
</script>

<template>
  <nav class="nav-bar">
    <v-app-bar-nav-icon
      variant="text"
      @click.stop="$emit('update:rail', !rail)"
    ></v-app-bar-nav-icon>
    <img class="logo" :src="logoHust" width="26" height="18" />
    <span class="logo-text"
      >ĐẠI HỌC BÁCH KHOA HÀ NỘI <br />TRƯỜNG ĐIỆN - ĐIỆN TỬ</span
    >
    <div class="avatar">
      <v-menu>
        <template v-slot:activator="{ props }">
          <p class="text">{{ username }}</p>
          <img
            class="image"
            :src="blankAvatar"
            alt="avatar"
            width="40"
            height="40"
            v-bind="props"
          />
        </template>
        <v-list>
          <v-list-item value="0" @click="navigateToProfile">
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>
          <v-list-item value="1" @click="logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.nav-bar {
  height: 64px;
  width: 100%;
  background-color: #08539c;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ccc;

  > .title {
    color: $color-black;
    text-align: left;
    padding-left: 24px;
    font-weight: normal;
    font-size: 24px;
    font-weight: 600;
  }

  > .avatar {
    position: absolute;
    right: 24px;
    display: flex;
    align-items: center;
    gap: 10px;
    > p {
      font-weight: bold;
    }
  }

  > .avatar > .image {
    border-radius: 50%;
    cursor: pointer;
  }
}
.text {
  color: #fff;
}
.logo-text {
  color: #fff;
  font-size: 12px;
  padding-left: 10px;
  font-family: Roboto, "Open Sans", "Helvetica Neue", sans-serif;
}
</style>
