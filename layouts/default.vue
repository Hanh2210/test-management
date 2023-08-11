<script lang="ts" setup>
const pageContainer = ref<HTMLElement>();

const nuxtApp = useNuxtApp();
nuxtApp.hook("page:finish", () => {
  pageContainer.value?.scroll(0, 0);
});

import { MenuItem, AUTH_USER } from "@/types";
import blankAvatar from "@/assets/images/blank-avatar.png";

const authStore = useAuthStore();
const layoutStore = useLayoutStore();
const isShowLoading = computed(() => layoutStore.isShowLoading);

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
  // {
  //   title: "Quản lý tài khoản",
  //   icon: "mdi-account-circle",
  //   path: "/admin/profile",
  // },
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
    title: "Danh sách bài thi",
    icon: "mdi-book-open-page-variant",
    path: "/student/test-list",
  },
  // {
  //   title: "Quản lý tài khoản",
  //   icon: "mdi-account-circle",
  //   path: "/student/profile",
  // },
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
  // {
  //   title: "Quản lý tài khoản",
  //   icon: "mdi-account-circle",
  //   path: "/teacher/profile",
  // },
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
      <v-main>
        <div class="page-container">
          <slot /></div
      ></v-main>
      <div class="loading" v-if="isShowLoading">
        <div class="lds-default">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </v-layout>
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
// loading
.loading {
  width: 100%;
  height: 100%;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  background-color: #ccc;
  opacity: 0.4;
}
.lds-default {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-default div {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #1a0d00;
  border-radius: 50%;
  animation: lds-default 1.2s linear infinite;
}
.lds-default div:nth-child(1) {
  animation-delay: 0s;
  top: 37px;
  left: 66px;
}
.lds-default div:nth-child(2) {
  animation-delay: -0.1s;
  top: 22px;
  left: 62px;
}
.lds-default div:nth-child(3) {
  animation-delay: -0.2s;
  top: 11px;
  left: 52px;
}
.lds-default div:nth-child(4) {
  animation-delay: -0.3s;
  top: 7px;
  left: 37px;
}
.lds-default div:nth-child(5) {
  animation-delay: -0.4s;
  top: 11px;
  left: 22px;
}
.lds-default div:nth-child(6) {
  animation-delay: -0.5s;
  top: 22px;
  left: 11px;
}
.lds-default div:nth-child(7) {
  animation-delay: -0.6s;
  top: 37px;
  left: 7px;
}
.lds-default div:nth-child(8) {
  animation-delay: -0.7s;
  top: 52px;
  left: 11px;
}
.lds-default div:nth-child(9) {
  animation-delay: -0.8s;
  top: 62px;
  left: 22px;
}
.lds-default div:nth-child(10) {
  animation-delay: -0.9s;
  top: 66px;
  left: 37px;
}
.lds-default div:nth-child(11) {
  animation-delay: -1s;
  top: 62px;
  left: 52px;
}
.lds-default div:nth-child(12) {
  animation-delay: -1.1s;
  top: 52px;
  left: 62px;
}
@keyframes lds-default {
  0%,
  20%,
  80%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
}
</style>
