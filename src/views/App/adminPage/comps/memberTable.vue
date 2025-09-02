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
// 元件
import { baseButton, baseTable } from '@/components/index';
// 商業邏輯
// ---------------------------

// ----------欄位設定----------
interface StockRow {
  id: string;
  name: string;
  memberAge: number;
  adminNote: string;
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
    key: 'adminNote',
    align: 'center',
    minWidth: 20,
    render: (row) => row.adminNote,
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
          { size: 'small', color: 'success', onClick: () => openDialog(row.id) },
          { default: () => '降階' }
        ),
        h(
          baseButton,
          { size: 'small', color: 'danger', onClick: () => openDialog(row.id) },
          { default: () => '封鎖' }
        ),
      ]),
  },
];

const fakeData: StockRow[] = [
  {
    id: 'uuid-1234',
    name: '陳大大',
    memberAge: 364,
    adminNote: '交易異常用戶',
  },
  {
    id: 'uuid-2345',
    name: '張大大',
    memberAge: 256,
    adminNote: '錯誤請求突然飆增',
  },
  {
    id: 'uuid-555',
    name: '陳大大',
    memberAge: 364,
    adminNote: '交易異常用戶',
  },
  {
    id: 'uuid-444',
    name: '張大大',
    memberAge: 256,
    adminNote: '錯誤請求突然飆增',
  },
  {
    id: 'uuid-333',
    name: '陳大大',
    memberAge: 364,
    adminNote: '交易異常用戶',
  },
  {
    id: 'uuid-222',
    name: '張大大',
    memberAge: 256,
    adminNote: '錯誤請求突然飆增',
  },
];

const expanded = ref<Array<string | number>>([]);
// ----------斷言----------
/** ✅ 這三個是「橋接變數」，把 TS 斷言放到 script */
const bridgedColumns = columns as unknown as DataTableColumns<Record<string, unknown>>;

const bridgedData = fakeData as unknown as Record<string, unknown>[];

const bridgedRowKey = (row: Record<string, unknown>) => (row as unknown as StockRow).id;
// ------------------------

const openDialog = (stockId: string) => {
  // 打開對話框的邏輯
  console.log('觸發點擊，ID為:', stockId);
};
</script>
