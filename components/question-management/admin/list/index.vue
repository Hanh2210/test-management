<script lang="ts" setup>
import { Question, stringToBoolean } from "@/types";

const props = defineProps({
  questions: {
    type: Array<Question>,
    default: () => [{}],
  },
});
const { questions } = toRefs(props);
const questionItem = ref(null);
const isShowDetailQuestion = ref(false);

const detailQuestion = (question: any) => {
  isShowDetailQuestion.value = true;
  questionItem.value = question;
};
</script>

<template>
  <div class="list-questions">
    <v-table fixed-header height="500px">
      <thead>
        <tr>
          <th class="text-left" width="100px">ID</th>
          <th class="text-left">Câu hỏi</th>
          <th class="text-left">Độ khó</th>
          <th class="text-left" width="120px">Chi tiết</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="question in questions" :key="question.id">
          <td>{{ question.id }}</td>
          <td>{{ question.topicText }}</td>
          <td>{{ question.level }}</td>
          <td>
            <span class="detail" @click="detailQuestion(question)"
              >Xem chi tiết</span
            >
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>

  <div class="dialog-create-question">
    <v-row justify="center">
      <v-dialog v-model="isShowDetailQuestion" persistent width="1024">
        <v-card>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="6">
                  <span>ID</span>
                  <v-text-field>{{ questionItem.id }}</v-text-field>
                </v-col>
                <v-col cols="6">
                  <span>Mức độ</span>
                  <v-text-field>{{ questionItem.level }}</v-text-field>
                </v-col>
                <v-col cols="12">
                  <span>Câu hỏi</span>
                  <v-text-field>{{ questionItem.topicText }}</v-text-field>
                </v-col>
                <v-col cols="12" v-if="questionItem.topicImage">
                  <span>Hình ảnh</span>
                  <div class="image-wrap">
                    <img
                      :src="questionItem.topicImage"
                      alt="Ảnh từ S3"
                      class="img"
                    />
                  </div>
                </v-col>
                <v-col cols="12">Đáp án </v-col>
                <v-col
                  cols="12"
                  v-for="answer in questionItem.answers"
                  :key="answer.id"
                >
                  <div class="wrap">
                    <v-text-field class="answer">{{
                      answer.content
                    }}</v-text-field>
                    <v-checkbox
                      label="Đáp án đúng"
                      class="checkbox"
                      :model-value="answer.isCorrected"
                    ></v-checkbox>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue-darken-1"
              variant="text"
              @click="isShowDetailQuestion = false"
            >
              Đóng
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<style lang="scss" scoped>
.detail {
  color: #437ed0;
  cursor: pointer;
}

.wrap {
  display: flex;
  align-items: center;
  gap: 32px;

  > .answer {
    flex: 2;
  }
  > .checkbox {
    flex: 1;
  }
}

.image-wrap {
  width: 300px;
  height: 300px;

  > .img {
    width: 100%;
    height: 100%;
    object-fit: initial;
  }
}
:deep(.v-table__wrapper) {
  height: calc(100vh - 320px) !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.09), 0 4px 12px rgba(0, 0, 0, 0.09);
  border-radius: 4px;
}

:deep(.v-table.v-table--fixed-header > .v-table__wrapper > table) {
  border: 1px solid #ccc;
}

:deep(
    .v-table.v-table--fixed-header > .v-table__wrapper > table > thead > tr > th
  ) {
  background-color: #c2c2d6;
}
:deep(.v-data-table-footer) {
  margin-top: 28px;
}
</style>
