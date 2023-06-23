<script lang="ts" setup>
import hustImage1 from "@/assets/images/hust1.png";
import hustImage2 from "@/assets/images/hust2.png";
import hustImage3 from "@/assets/images/hust3.png";
import hustImage4 from "@/assets/images/hust4.png";

const pageContainer = ref<HTMLElement>();

const nuxtApp = useNuxtApp();
nuxtApp.hook("page:finish", () => {
  pageContainer.value?.scroll(0, 0);
});
const images = [
  {
    src: hustImage1,
  },
  {
    src: hustImage2,
  },
  {
    src: hustImage3,
  },
  {
    src: hustImage4,
  },
];
</script>
<template>
  <div class="app-layout">
    <div ref="pageContainer" class="page-container">
      <div class="slider-show">
        <v-carousel
          cycle
          :height="'100%'"
          hide-delimiter-background
          show-arrows="hover"
        >
          <v-carousel-item
            v-for="(image, i) in images"
            :key="i"
            :src="image.src"
            cover
          >
          </v-carousel-item>
        </v-carousel>
      </div>
      <div class="content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-layout {
  height: 100vh;
  overflow: hidden;

  > .page-container {
    font-size: 0.875rem;
    display: flex;
    flex-wrap: wrap;
    margin-right: -15px;
    margin-left: -15px;
    height: 100%;
  }

  > .page-container > .slider-show,
  > .page-container > .content {
    flex: 1;
  }
}
</style>
