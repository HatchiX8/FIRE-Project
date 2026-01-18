<template>
  <baseTable
    :columns="bridgedColumns"
    :data="bridgedData"
    :row-key="bridgedRowKey"
    v-model:expanded-row-keys="expanded"
    :page-size="3"
    class="mt-4"
  />
</template>
<script setup lang="ts">
// ----------import----------
// 套件
// 共用型別
import type { DataTableColumns } from 'naive-ui';
import type { MemberAction } from '../api/index';
// 元件
import { baseButton, baseTable } from '@/components/index';
// 商業邏輯
// ---------------------------

// ----------type----------
// type ReviewAction = 'DOWNGRADE' | 'BAN';
// ------------------------

// ----------props&emit----------
const props = defineProps<{
  tableData: StockRow[];
}>();

const emit = defineEmits<{
  (e: 'review', payload: { id: string; action: MemberAction }): void;
}>();
// ------------------------------

// ----------欄位設定----------
interface StockRow {
  id: string;
  name: string;
  memberAge: number;
  userNote: string;
}

const columns: DataTableColumns<StockRow> = [
  {
    title: '申請者姓名',
    key: 'name',
    align: 'center',
    minWidth: 20,
  },
  {
    title: '會員資歷(day)',
    key: 'memberAge',
    align: 'center',
    minWidth: 20,
    render: (row) => row.memberAge,
  },
  {
    title: '註記',
    key: 'userNote',
    align: 'center',
    minWidth: 20,
    render: (row) => row.userNote,
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
          { size: 'small', color: 'success', onClick: () => requestReview(row.id, 'downgrade') },
          { default: () => '降階' }
        ),
        h(
          baseButton,
          { size: 'small', color: 'danger', onClick: () => requestReview(row.id, 'ban') },
          { default: () => '封鎖' }
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

const requestReview = (id: string, action: MemberAction) => {
  emit('review', { id, action });
  console.log('送出審核', { id, action });
};
</script>
