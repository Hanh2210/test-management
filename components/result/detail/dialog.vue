<script lang="ts" setup>
const props = defineProps<{
  isOpenDialog: boolean;
  closeDialog: () => void;
  resultDetailQuestion: any;
}>();

const answerKey = computed(() => props.resultDetailQuestion.answers);
const selectedAnswer = ref(true);
</script>

<template>
  <div class="dialog">
    <v-dialog :model-value="isOpenDialog" width="700px">
      <v-card>
        <v-card-text>
          <h3 class="header">
            Đáp án chi tiết câu {{ resultDetailQuestion.questionNo }}
          </h3>
          <div class="question">
            <div class="content">
              <span class="text"
                >Câu hỏi: {{ resultDetailQuestion.topicText }}
              </span>
              <div class="answers">
                <v-radio-group class="radio" v-model="selectedAnswer">
                  <div
                    class="answer"
                    v-for="answer in resultDetailQuestion.answers"
                    :key="answer.answerNo"
                  >
                    <span class="label">{{ answer.answerNo }}.</span>
                    <v-radio
                      :label="answer.content"
                      :value="answer.isSelected"
                    ></v-radio>
                  </div>
                </v-radio-group>
              </div>
            </div>
          </div>

          <span v-if="!resultDetailQuestion.isCorrected" class="title"
            >Đáp án đúng là: {{ resultDetailQuestion.correctedAnswer }}
          </span>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="closeDialog">Đóng</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
.header {
  margin-bottom: 16px;
}
.title {
  color: #3cb46e;
}

.answer {
  display: flex;
  align-items: center;
}
</style>
