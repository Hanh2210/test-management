export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();
  const session = localStorage.getItem("session");

  if (session) {
    const { accessToken } = JSON.parse(session);
    if (accessToken) {
      await authStore.getCurrentUser();
      const role = authStore.currentUser?.roles[0];
      if (role) {
        switch (role) {
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
