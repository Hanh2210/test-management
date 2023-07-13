<script lang="ts" setup>
import { useTestStore } from "@/stores/test";

const testsStore = useTestStore();
const testDetail = computed(() => testsStore.testDetail);
</script>
<template>
  <h2 class="title">Chi tiết đề thi</h2>
  <div class="test-detail">
    <div class="tab-content">
      <div class="item">
        <h3 class="label">Tên môn học:</h3>
        <h3 class="content">{{ testDetail?.testSet?.subjectTitle }}</h3>
      </div>
      <div class="detail">
        <v-icon icon="mdi-clock"></v-icon>
        <span class="label">Thời gian làm bài:</span>
        <span class="content">{{ testDetail?.testSet?.duration }} phút</span>
      </div>
      <div class="detail">
        <v-icon icon="mdi-pencil"></v-icon>
        <span class="label">Mã đề:</span>
        <span class="content">{{ testDetail?.testSet?.testNo }}</span>
      </div>
      <div class="detail">
        <v-icon icon="mdi-calendar"></v-icon>
        <span class="label">Ngày thi:</span>
        <span class="content">{{ testDetail?.testSet?.testDay }}</span>
      </div>
    </div>
    <div class="question-content">
      <div
        class="item"
        v-for="question in testDetail.questions"
        :key="question.id"
      >
        <div class="question">
          <span class="order">{{ question.questionNo }}.</span>
          <span class="topictext">{{ question.topicText }} </span>
        </div>
        <div class="image-wrap" v-if="question.topicImage">
          <img :src="question.topicImage" alt="Ảnh từ S3" class="img" />
        </div>
        <div
          class="answers"
          v-for="answer in question.answers"
          :key="answer.id"
        >
          <span class="label">{{ answer.answerNo }}.</span>
          <span class="content">{{ answer.content }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.title {
  padding-bottom: 16px;
  border-bottom: 1px solid $color-gray;
  margin-bottom: 12px;
}

.tab-content {
  border-bottom: 1px solid $color-gray;
  padding-bottom: 16px;

  > .item {
    display: flex;
    gap: 12px;
    margin-top: 20px;
    margin-bottom: 12px;
  }
  > .detail {
    display: flex;
    gap: 12px;
    margin-top: 8px;
  }
}

.question-content {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  > .item > .question {
    display: flex;
    gap: 16px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  > .item > .answers {
    display: flex;
    gap: 8px;
  }

  > .item > .answers > .label {
    font-weight: 600;
  }

  > .item > .image-wrap {
    width: 300px;
    height: 300px;
    margin: 4px 0;
  }
  > .item > .image-wrap > .img {
    width: 100%;
    height: 100%;
    object-fit: initial;
  }
}
</style>
