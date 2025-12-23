<template>
  <baseTable
    :columns="bridgedColumns"
    :data="bridgedData"
    :row-key="bridgedRowKey"
    v-model:expanded-row-keys="expanded"
    :page-size="2"
    class="mt-4"
  />
</template>
<script setup lang="ts">
// ----------import----------
// 套件
// 共用型別
import type { DataTableColumns } from 'naive-ui';
// 元件
import { baseButton, baseTable } from '@/components/index';
// 商業邏輯
// ---------------------------

// ----------type----------
type ReviewAction = 'Cleared' | 'Rejected';
// ------------------------

// ----------props&emit----------
const props = defineProps<{
  tableData: StockRow[];
}>();

const emit = defineEmits<{
  (e: 'review', payload: { id: string; action: ReviewAction }): void;
}>();
// ------------------------------

// ----------欄位設定----------
interface StockRow {
  id: string;
  name: string;
  upgradeReason: string;
  createdAt: string;
}

const columns: DataTableColumns<StockRow> = [
  {
    title: '申請者姓名',
    key: 'name',
    align: 'center',
    minWidth: 20,
  },
  {
    title: '申請原因',
    key: 'upgradeReason',
    align: 'center',
    minWidth: 20,
    render: (row) => row.upgradeReason,
  },
  {
    title: '申請時間',
    key: 'createdAt',
    align: 'center',
    minWidth: 20,
    render: (row) => row.createdAt,
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    minWidth: 20,
    render: (row) =>
      h('div', { class: 'mt-2 ml-auto flex flex-col gap-2' }, [
        h(
          baseButton,
          { size: 'small', color: 'success', onClick: () => requestReview(row.id, 'Cleared') },
          { default: () => '通過' }
        ),
        h(
          baseButton,
          { size: 'small', color: 'danger', onClick: () => requestReview(row.id, 'Rejected') },
          { default: () => '未通過' }
        ),
      ]),
  },
];

const expanded = ref<Array<string | number>>([]);
// ----------斷言----------
/** ✅ 這三個是「橋接變數」，把 TS 斷言放到 script */
const bridgedColumns = columns as unknown as DataTableColumns<Record<string, unknown>>;

const bridgedData = computed(() => props.tableData as unknown as Record<string, unknown>[]);

const bridgedRowKey = (row: Record<string, unknown>) => (row as unknown as StockRow).id;
// ------------------------

const requestReview = (id: string, action: ReviewAction) => {
  emit('review', { id, action });
  console.log('送出審核', { id, action });
};
</script>
