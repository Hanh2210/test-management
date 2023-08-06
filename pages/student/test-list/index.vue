<script lang="ts" setup>
import { Student } from "@/types";
import { useStudentStore } from "@/stores/student";

const studentStore = useStudentStore();

const res = await studentStore.getTestList();
const testList = computed(() => studentStore.testList);

const openTestDetail = async (studentTestId: number) => {
  const router = useRouter();
  await studentStore.getStudentTestDetail(studentTestId);
  router.push(`/student/test-result`);
};
</script>

<template>
  <h2 class="title">Danh sách bài thi</h2>
  <div class="exam-class">
    <v-table fixed-header height="450px" class="table">
      <thead>
        <tr>
          <th class="text-center">STT</th>
          <th class="text-center">Mã lớp</th>
          <th class="text-center">Mã đề</th>
          <th class="text-center">Trạng thái</th>
          <th class="text-center">Ngày thi</th>
          <th class="text-center">Điểm</th>
          <th class="text-center">Chi tiết</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(test, index) in testList" :key="test.id">
          <td class="text-center">{{ index + 1 }}</td>
          <td class="text-center">{{ test.examClassCode }}</td>
          <td class="text-center">{{ test.testNo }}</td>
          <td class="text-center">{{ test.state }}</td>
          <td class="text-center">
            {{ test.testDate }}
          </td>
          <td class="text-center">{{ test.grade }}</td>
          <td class="text-center detail" @click="openTestDetail(test.id)">
            [Chi tiết]
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<style lang="scss" scoped>
.title {
  padding-bottom: 16px;
  border-bottom: 1px solid $color-gray;
  margin-bottom: 12px;
}

.detail {
  color: $primary-color;
  cursor: pointer;
}
</style>
