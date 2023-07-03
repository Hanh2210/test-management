export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();
  const session = localStorage.getItem("session");

  if (session) {
    const { accessToken } = JSON.parse(session);
    if (accessToken) {
      await authStore.getCurrentUser();
      const roles = authStore.currentUser?.roles;
      if (roles?.length) {
        switch (roles[0]) {
          case "ROLE_ADMIN": {
            return navigateTo("/admin/home");
          }
          case "ROLE_STUDENT": {
            return navigateTo("/student/home");
          }
          case "ROLE_TEACHER": {
            return navigateTo("teacher/home");
          }
          default:
            break;
        }
      }
    }
  }
});
