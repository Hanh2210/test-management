<script lang="ts" setup>
import blankAvatar from "@/assets/images/blank-avatar.png";
defineProps<{rail: boolean}>()

const authStore = useAuthStore()
const username = computed(()=> authStore.currentUser.username)

</script>

<template>
  <nav class="nav-bar">
    <v-app-bar-nav-icon variant="text" @click.stop="$emit('update:rail', !rail)"></v-app-bar-nav-icon>
    <h1 class="title">Test Management</h1>
    <div class="avatar">
      <p>{{ username }}</p>
      <img
        class="image"
        :src="blankAvatar"
        alt="avatar"
        width="40"
        height="40"
      />
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.nav-bar {
  height: 64px;
  width: 100%;
  background-color: $color-white;
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
  }
}
</style>
