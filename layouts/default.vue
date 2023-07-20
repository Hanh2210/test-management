<script lang="ts" setup>
const pageContainer = ref<HTMLElement>();

const nuxtApp = useNuxtApp();
nuxtApp.hook("page:finish", () => {
  pageContainer.value?.scroll(0, 0);
});

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
    title: "Quản lý đề thi",
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

const rail = ref(true);
</script>
<template>
  <div class="app-layout">
    <layout-header v-model:rail="rail" />
    <!-- <layout-navigation /> -->
    <!-- <v-card> -->
    <v-layout>
      <v-navigation-drawer
        permanent
        location="left"
        :rail="rail"
        @click="rail = false"
      >
        <v-list density="compact" nav>
          <v-list-item
            v-for="item in menus"
            :key="item.title"
            @click.stop="handleRedirect(item.path)"
            :prepend-icon="item.icon"
            :title="item.title"
            :value="item.title"
          >
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main
        ><div class="page-container"><slot /></div
      ></v-main>
    </v-layout>
    <!-- </v-card> -->

    <!-- <div ref="pageContainer" class="page-container">
      <slot />
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
.app-layout {
  height: 100vh;
  overflow: hidden;
}
.page-container {
  font-size: $font-sm;
  padding: 16px;
  overflow-y: scroll;
  height: calc(100% - #{$header-height});
  // margin-left: 60px;
}

.user {
  :deep(.v-list-item-subtitle) {
    font-size: 18px;
    font-weight: 600;
  }
}

:deep(.v-list-item) {
  color: #fff;
}

:deep(.v-navigation-drawer) {
  margin-top: 64px;
  background-color: #021c34;
}

:deep(.v-layout) {
  height: 100%;
}
</style>
