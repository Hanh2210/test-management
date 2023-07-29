<script lang="ts" setup>
import { LEVEL, Subject } from "@/types";
import { useSubjectStore } from "@/stores/subject";
const subjectStore = useSubjectStore();

const titleSnack = ref("");
const isShowSnack = ref(false);
const props = defineProps({
  isEditQuestion: {
    type: Boolean,
    default: false,
  },
  questionById: {
    type: Object,
    default: () => ({}),
  },
  subjects: {
    type: Array<Subject>,
    default: () => [{}],
  },
});
const { questionById, subjects } = toRefs(props);
const subjectCode = ref("");
const file = ref("");

const question = computed(() => props.questionById);

watch(subjectCode, () => {
  subjectStore.getChapters(subjectCode.value);
});

const chapters = computed(() => {
  return subjectStore.chapters;
});

const emit = defineEmits<{
  (e: "edit", data: any): void;
  (e: "close"): void;
}>();

const levels = computed(() => {
  return LEVEL;
});

const closeDialog = () => {
  emit("close");
};

const editQuestion = () => {
  console.log("file trc emit", file.value);
  emit("edit", { question, file: file.value[0] });
  closeDialog();
  isShowSnack.value = true;
  titleSnack.value = "Sửa câu hỏi thành công!";
};
</script>

<template>
  <div class="dialog-edit-question">
    <v-row justify="center">
      <v-dialog :model-value="isEditQuestion" persistent width="1024">
        <v-card>
          <v-card-title>
            <span class="text-h5">Sửa thông tin câu hỏi</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-select
                    :value="question.subjectTitle"
                    class="select"
                    :variant="'outlined'"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-select
                    label="Chương"
                    :items="chapters"
                    item-title="order"
                    item-value="id"
                    v-model="question.chapter.id"
                    class="select"
                    :variant="'outlined'"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-select
                    label="Độ khó"
                    :items="levels"
                    item-title="label"
                    item-value="key"
                    class="select"
                    v-model="question.level"
                    :variant="'outlined'"
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    required
                    v-model="question.topicText"
                    :placeholder="'Nhập câu hỏi'"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" v-if="question.topicImage">
                  <span>Hình ảnh</span>
                  <div class="image-wrap">
                    <img
                      :src="question.topicImage"
                      alt="Ảnh từ S3"
                      class="img"
                    />
                  </div>
                </v-col>
                <v-col cols="12" class="mt-4">
                  <v-file-input
                    clearable
                    v-model="file"
                    label="Chọn ảnh mới"
                    class="file"
                  ></v-file-input>
                </v-col>
                <v-col cols="12">Đáp án </v-col>
                <v-col cols="12">
                  <div
                    class="wrap"
                    v-for="answer in question.answers"
                    :key="answer.id"
                  >
                    <v-text-field
                      v-model="answer.content"
                      required
                      :placeholder="'Nhập đáp án'"
                    ></v-text-field>
                    <v-checkbox
                      v-model="answer.isCorrected"
                      label="Đáp án đúng"
                    ></v-checkbox>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="closeDialog">
              Huỷ
            </v-btn>
            <v-btn color="blue-darken-1" variant="text" @click="editQuestion">
              Lưu
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
  <template>
    <div class="text-center ma-2">
      <v-snackbar v-model="isShowSnack" :timeout="1200" :color="'#2196F3'">
        {{ titleSnack }}
      </v-snackbar>
    </div>
  </template>
</template>

<style lang="scss" scoped>
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
</style>
