export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!to.path.includes("auth")) {
    const authStore = useAuthStore();
    if (!authStore.currentUser) {
      await authStore.getCurrentUser();
    }
    const roles = authStore.currentUser?.roles;
    if (roles?.length) {
      switch (roles[0]) {
        case "ROLE_ADMIN": {
          if (to.path.includes("admin")) return;
          return navigateTo("/admin/home");
        }
        case "ROLE_STUDENT": {
          if (to.path.includes("student")) return;
          return navigateTo("/student/home");
        }
        case "ROLE_TEACHER": {
          if (to.path.includes("teacher")) return;
          return navigateTo("teacher/home");
        }
        default:
          break;
      }
    }
    return navigateTo("/auth/login");
  }
});
