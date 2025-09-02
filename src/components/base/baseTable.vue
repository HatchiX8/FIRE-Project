<template>
  <div>
    <n-data-table
      :columns="columns"
      :data="loading ? [] : paginatedData"
      :loading="loading"
      :pagination="false"
      :striped="striped"
      :bordered="bordered"
      :row-key="rowKey"
      v-model:expanded-row-keys="innerExpanded"
      @update:expanded-row-keys="$emit('update:expandedRowKeys', $event)"
    />

    <div v-if="pageCount > 1" class="mt-4 flex justify-center">
      <n-pagination
        v-model:page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-count="pageCount"
      />
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
// ----------import----------
// 套件
// 共用型別
import type { DataTableColumns } from 'naive-ui';
// 元件
// 商業邏輯

// ---------------------------

type Column<T extends Record<string, unknown>> = DataTableColumns<T>[number];

// ----------props&emit----------
const props = defineProps<{
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  striped?: boolean;
  bordered?: boolean;
  loading?: boolean;

  /* ✅ 新增：展開列需要 */
  rowKey: (row: T) => string | number;
  expandedRowKeys?: Array<string | number>;
}>();

// const emit = defineEmits<{
//   (e: 'emit', emitValue): void;
// }>();
// ------------------------------

// ----------分頁設定----------
const pagination = ref({
  page: 1,
  pageSize: props.pageSize ?? 10,
});

// 每頁顯示的資料
const paginatedData = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.pageSize;
  const end = start + pagination.value.pageSize;
  return props.data.slice(start, end);
});

// 計算需要幾頁
const pageCount = computed(() => Math.ceil(props.data.length / pagination.value.pageSize));

watch(
  () => props.data,
  () => {
    pagination.value.page = 1; // 資料變動時重設分頁
  }
);

// ---------------------------

// ---------- 展開列（受控 / 非受控皆可） ----------
const innerExpanded = ref<Array<string | number>>(props.expandedRowKeys ?? []);

watch(
  () => props.expandedRowKeys,
  (v) => {
    if (v) innerExpanded.value = v;
  }
);
</script>
