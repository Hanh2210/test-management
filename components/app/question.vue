<script lang="ts" setup>
import { Question } from '~/types';

const props = defineProps<{ question: Question, modelValue: string|null }>();
const selectedAnswer = ref(false);
const question = computed(() => props.question);

const emit = defineEmits<{(e: "update:modelValue", data: any): void;}>()

const updateValue = (val: any)=>{
  emit('update:modelValue', val)
}
</script>

<template>
  <div class="question-wrapper">
    <div class="order">{{ question.questionNo }}</div>
    <div class="content">
      <span class="text">
        {{ question.topicText }}
      </span>
      <div class="answers">
        <v-radio-group class="radio" :model-value="modelValue" @update:model-value="updateValue">
          <div
            class="answer"
            v-for="answer in question.answers"
            :key="answer.answerNo"
          >
            <span class="label">{{ answer.answerNo }}.</span>
            <v-radio :label="answer.content" :value="answer.answerNo"></v-radio>
          </div>
        </v-radio-group>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
