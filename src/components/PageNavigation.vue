<template>
  <div class="q-pa-lg flex flex-center">
    <q-pagination
      v-model="current"
      color="black"
      :max="max"
      :max-pages="6"
      :boundary-numbers="true"
      @update:model-value="changePaginationDetail"
    ></q-pagination>
  </div>
</template>
<script setup lang="ts">
import { ref, defineProps } from 'vue';

const props = defineProps({
  pagination: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(['update-page']);
const max = ref(props.pagination.totalPages);
const current = ref(props.pagination.currentPage);
function changePaginationDetail(e) {
  emit('update-page', e);
}
</script>
