<script lang="ts" setup>
import { useStudentStore } from "@/stores/student";
const studentStore = useStudentStore();
const testDetail = computed(() => studentStore.studentTestDetail);

const isOpenDialog = ref(false);

const resultDetailQuestion = ref(null);

const openResultDetail = (result: any) => {
  resultDetailQuestion.value = result;
  isOpenDialog.value = true;
};

const closeDialog = () => {
  isOpenDialog.value = false;
};
</script>

<template>
  <h2 class="title">Mã đề: {{ testDetail.testNo }}</h2>

  <h2 class="grade">Điểm: {{ testDetail.grade }}</h2>

  <h3 class="header">Phân tích chi tiết</h3>
  <div class="result-detail">
    <div class="result-answers-list">
      <div
        class="result-answers-item"
        v-for="question in testDetail.questions"
        :key="question.questionNo"
      >
        <span class="number">{{ question.questionNo }}</span>
        <!-- <span class="resultkey">{{ result.resultKey }}</span> -->
        <span
          class="answerkey"
          :class="{ '-wrong': !question.isCorrected }"
        ></span>
        <v-icon
          v-if="question.isCorrected"
          icon="mdi-check"
          class="correct"
        ></v-icon>
        <v-icon
          v-if="!question.isCorrected"
          icon="mdi-close"
          class="wrong"
        ></v-icon>
        <span class="detail" @click="openResultDetail(question)"
          >[Chi tiết]</span
        >
      </div>
    </div>
  </div>
  <result-detail-dialog
    :isOpenDialog="isOpenDialog"
    :close-dialog="closeDialog"
    :resultDetailQuestion="resultDetailQuestion"
  />
</template>
<style lang="scss" scoped>
.title {
  padding-bottom: 16px;
  border-bottom: 1px solid $color-gray;
  margin-bottom: 12px;
}

.result-wrapper {
  display: flex;
  margin-top: 32px;
}

.navigation {
  font-size: 16px;
  gap: 12px;
  padding: 1.5rem 1rem;
  background-color: #f8f9fa;
  border: 1px solid #efefef;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  border-radius: 4px;

  > .item {
    display: flex;
    align-items: center;
    gap: 6px;
    justify-content: space-between;
  }

  > .item > .score {
    font-weight: bold;
  }
}

.score-box {
  display: flex;
  gap: 60px;
  margin-left: 32px;
  > .item {
    width: 160px;
    background-color: $color-white;
    padding: 8px;
    border: 1px solid #efefef;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }

  > .item > .text.-correct {
    color: green;
    font-size: 16px;
  }
  > .item > .text.-wrong {
    color: red;
    font-size: 16px;
  }
  > .item > .text.-disabled {
    color: gray;
    font-size: 16px;
  }

  > .item > .count {
    font-size: 20px;
    font-weight: 600;
  }
}
.item > .icon.-correct {
  color: green;
}
.item > .icon.-wrong {
  color: red;
}
.item > .icon.-disabled {
  color: gray;
}

.header {
  margin-top: 32px;
}
.result-detail {
  columns: 2;
  -webkit-columns: 2;
}

.result-answers-list {
  display: flex;
  margin-top: 16px;
  flex-direction: column;
  gap: 12px;
}

.result-answers-item {
  display: flex;
  gap: 10px;
  align-items: center;
  > .number {
    border-radius: 50%;
    background-color: #e8f2ff;
    color: #35509a;
    width: 35px;
    height: 35px;
    line-height: 35px;
    font-size: 15px;
    text-align: center;
    display: inline-block;
  }

  > .answerkey {
    font-style: italic;
  }

  > .answerkey.-wrong {
    text-decoration: line-through;
  }
  > .detail {
    color: #35509a;
    cursor: pointer;
  }
}

.correct {
  color: green;
}

.wrong {
  color: red;
}
</style>
