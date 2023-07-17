<script lang="ts" setup>
import { useStudentStore } from "@/stores/student";
const studentStore = useStudentStore();
const testDetail = computed(() => studentStore.testDetail);
const examClassDetail = computed(() => studentStore.examClassDetail);

const selectedAnswer = ref(false);

const minutesInput = examClassDetail.value.test.duration;
const remainingTime = ref(minutesInput * 60);
const timer = ref();

// mm:ss
const formatTime = computed(() => {
  const minutes = Math.floor(remainingTime.value / 60);
  const seconds = remainingTime.value % 60;

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
});

const countdown = () => {
  remainingTime.value--;

  if (remainingTime.value <= 0) {
    stopCountdown();
  }
};

const startCountdown = () => {
  timer.value = setInterval(countdown, 1000);
};

const stopCountdown = () => {
  clearInterval(timer.value);
};

onMounted(() => {
  studentStore.fetchTestDetail(examClassDetail.value.examClass.code);
  startCountdown();
});

onUnmounted(() => {
  stopCountdown();
});

const submit = () => {
  console.log("nộp bài");
};
</script>

<template>
  <div class="heading">
    <h2 class="name">Mã đề : {{ testDetail.testNo }}</h2>
    <button class="button">Thoát <v-icon icon="mdi-arrow-right" /></button>
  </div>
  <div class="test-wrapper">
    <div class="test-content">
      <div
        class="question-wrapper"
        v-for="question in testDetail.questions"
        :key="question.id"
      >
        <div class="order">{{ question.questionNo }}</div>
        <div class="content">
          <span class="text">
            {{ question.topicText }}
          </span>
          <div class="answers">
            <v-radio-group
              class="radio"
              v-for="answer in question.answers"
              :key="answer.id"
              v-model="selectedAnswer"
            >
              <div class="answer">
                <span class="label">{{ answer.answerNo }}.</span>
                <v-radio
                  :label="answer.content"
                  :value="answer.content"
                ></v-radio>
              </div>
            </v-radio-group>
          </div>
        </div>
      </div>
    </div>
    <div class="test-navigation">
      <h3 class="timeleft">Thời gian làm bài:</h3>
      <div class="time">
        {{ formatTime }}
      </div>
      <button class="submit" @click="submit">Nộp bài</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.heading {
  display: flex;
  gap: 8px;
  padding-bottom: 16px;
  border-bottom: 1px solid $color-gray;
  margin-bottom: 12px;
  > .button {
    width: 80px;
    height: 34px;
    border: 1px solid $color-gray;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    color: #1e2022;
    background-color: #e8f2ff;
    border-color: #35509a;
  }
}

.test-wrapper {
  display: flex;
  flex-direction: row;
  position: relative;
  gap: 32px;
}

.test-content {
  flex: 5;
  background-color: $color-white;
  padding: 1rem;
  border-radius: 0.65rem;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 0 0 rgba(143, 156, 173, 0.2);
}

.test-navigation {
  text-align: center;
  position: fixed;
  height: 200px;
  right: 16px;
  top: 80px;
  border-radius: 4px;
  will-change: position, transform;
  padding: 1rem;
  background-color: $color-white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.08);

  > .time {
    font-weight: 600;
    font-size: 24px;
  }

  > .submit {
    height: 38px;
    width: 138px;
    border: 1px solid #35509a;
    color: #35509a;
    border-color: #35509a;
    font-size: 16px;
    border-radius: 4px;
    font-weight: 500;
    margin-top: 32px;
  }

  > .submit:hover {
    color: $color-white;
    background-color: #35509a;
    border-color: #35509a;
  }
}

.question-wrapper {
  display: flex;
  margin-bottom: 24px;

  > .order {
    margin-right: 8px;
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
  > .content {
    width: 100%;
  }
  > .content > .text {
    margin-bottom: 8px;
    margin-left: 12px;
    font-size: 16px;
  }
  > .content > .answers {
    position: relative;
    display: block;
  }
  > .content > .answers > .radio {
    :deep(.v-input__control) {
      font-size: 14px;
    }

    :deep(.v-selection-control .v-label) {
      font-size: 14px;
      color: $color-black;
    }
  }
}

.answer {
  display: flex;
  align-items: center;
  .label {
    font-weight: 600;
  }
}
</style>
