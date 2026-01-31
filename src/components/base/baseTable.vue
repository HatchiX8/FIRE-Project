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
        :page="pagination.page"
        :page-size="pagination.pageSize"
        :page-count="pageCount"
        @update:page="handlePageChange"
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

  // 展開列需要
  rowKey: (row: T) => string | number;
  expandedRowKeys?: Array<string | number>;

  // 後端分頁資訊
  totalPage?: number;
  currentPage?: number;
}>();

const emit = defineEmits<{
  (e: 'update:expandedRowKeys', keys: Array<string | number>): void;
  /* ✅ 新增：分頁變動事件 */
  (e: 'pageChange', page: number): void;
}>();
// ------------------------------

// ----------分頁設定----------
const pagination = ref({
  page: props.currentPage ?? 1,
  pageSize: props.pageSize ?? 10,
});

// 當 API 回傳新的 currentPage 時，同步更新
watch(
  () => props.currentPage,
  (newPage) => {
    if (newPage) {
      pagination.value.page = newPage;
    }
  }
);

// 分頁變動時，發送事件給父層
const handlePageChange = (page: number) => {
  pagination.value.page = page;
  emit('pageChange', page);
};

// 如果有 totalPage，用它；否則前端計算
const pageCount = computed(
  () => props.totalPage ?? Math.ceil(props.data.length / pagination.value.pageSize)
);

// 前端分頁用（如果後端沒有分頁，才用 slice）
const paginatedData = computed(() => {
  if (props.totalPage) {
    // 後端分頁：直接用 API 回傳的資料
    return props.data;
  } else {
    // 前端分頁：自己切割資料
    const start = (pagination.value.page - 1) * pagination.value.pageSize;
    const end = start + pagination.value.pageSize;
    return props.data.slice(start, end);
  }
});

watch(
  () => props.data,
  () => {
    if (!props.totalPage) {
      // 只有前端分頁時才重設
      pagination.value.page = 1;
    }
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
