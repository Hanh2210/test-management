<script lang="ts" setup>
import { MenuItem, AUTH_USER } from "@/types";
import blankAvatar from "@/assets/images/blank-avatar.png";

const authStore = useAuthStore();

const authUser = computed(() => authStore.currentUser.roles[0]);

const currentUser = computed(() => {
  return authStore.currentUser;
});

const menuByAdmin: MenuItem[] = [
  {
    title: "Trang chủ",
    icon: "mdi-home-city",
    path: "/admin/home",
  },
  {
    title: "Quản lý học sinh",
    icon: "mdi-account-group-outline",
    path: "/admin/students",
  },
  {
    title: "Quản lý giáo viên",
    icon: "mdi-account-group-outline",
    path: "/admin/teachers",
  },
  {
    title: "Quản lý ngân hàng câu hỏi",
    icon: "mdi-book-open-page-variant",
    path: "/admin/questions-management",
  },
  {
    title: "Quản lý tài khoản",
    icon: "mdi-account-circle",
    path: "/admin/profile",
  },
];

const menuByStudent: MenuItem[] = [
  {
    title: "Trang chủ",
    icon: "mdi-home-city",
    path: "/student/home",
  },
  {
    title: "Thư viện đề thi",
    icon: "mdi-book-open",
    path: "/student/tests",
  },
  {
    title: "Danh sách lớp thi",
    icon: "mdi-google-classroom",
    path: "/student/class-exam",
  },
  {
    title: "Quản lý tài khoản",
    icon: "mdi-account-circle",
    path: "/student/profile",
  },
];

const menuByTeacher: MenuItem[] = [
  {
    title: "Trang chủ",
    icon: "mdi-home-city",
    path: "/teacher/home",
  },
  {
    title: "Quản lý học sinh",
    icon: "mdi-account-group-outline",
    path: "/teacher/students",
  },
  {
    title: "Quản lý câu hỏi",
    icon: "mdi-comment-question-outline",
    path: "/teacher/questions-management",
  },
  {
    title: "Quản lý môn học",
    icon: "mdi-book-open-page-variant",
    path: "/teacher/subjects",
  },
  {
    title: "Quản lý bài thi",
    icon: "mdi-book-open",
    path: "/teacher/tests",
  },
  {
    title: "Tạo lớp thi",
    icon: "mdi-calendar-clock",
    path: "/teacher/create-class",
  },
  {
    title: "Chấm bài thi offline",
    icon: "mdi-lead-pencil",
    path: "/teacher/mark-the-exam",
  },
  {
    title: "Quản lý tài khoản",
    icon: "mdi-account-circle",
    path: "/teacher/profile",
  },
];

const menus = computed(() => {
  if (authUser.value === AUTH_USER.ROLE_ADMIN) return menuByAdmin;
  else if (authUser.value === AUTH_USER.ROLE_STUDENT) return menuByStudent;
  return menuByTeacher;
});
const router = useRouter();
const route = useRoute();

const activeMenu = computed(() => {
  return route.path;
});

const handleRedirect = (path: string) => {
  if (activeMenu.value !== path) {
    router.push(path);
  }
};
</script>

<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer permanent location="left">
        <template v-slot:prepend>
          <v-list-item
            class="user"
            lines="two"
            :prepend-avatar="blankAvatar"
            v-bind:subtitle="currentUser.username"
          ></v-list-item>
        </template>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item
            v-for="item in menus"
            :key="item.title"
            @click.stop="handleRedirect(item.path)"
            :prepend-icon="item.icon"
            :title="item.title"
            :value="item.title"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-layout>
  </v-card>
</template>

<style lang="scss" scoped>
.user {
  :deep(.v-list-item-subtitle) {
    font-size: 18px;
    font-weight: 600;
  }
}
</style>
