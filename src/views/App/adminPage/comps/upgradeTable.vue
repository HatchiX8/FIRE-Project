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
          { size: 'small', color: 'success', onClick: () => openDialog(row.id) },
          { default: () => '通過' }
        ),
        h(
          baseButton,
          { size: 'small', color: 'danger', onClick: () => openDialog(row.id) },
          { default: () => '未通過' }
        ),
      ]),
  },
];

const fakeData: StockRow[] = [
  {
    id: 'uuid-1234',
    name: '陳大大',
    upgradeReason: '我想要申請成為正式會員',
    createdAt: '2025/07/28 10:32',
  },
  {
    id: 'uuid-2345',
    name: '張大大',
    upgradeReason: '你好，我想申請成為會員',
    createdAt: '2025/07/28 10:42',
  },
  {
    id: 'uuid-2345',
    name: '張大大',
    upgradeReason: '你好，我想申請成為會員',
    createdAt: '2025/07/28 10:42',
  },
  {
    id: 'uuid-2345',
    name: '張大大',
    upgradeReason: '你好，我想申請成為會員',
    createdAt: '2025/07/28 10:42',
  },
  {
    id: 'uuid-2345',
    name: '張大大',
    upgradeReason: '你好，我想申請成為會員',
    createdAt: '2025/07/28 10:42',
  },
  {
    id: 'uuid-2345',
    name: '張大大',
    upgradeReason: '你好，我想申請成為會員',
    createdAt: '2025/07/28 10:42',
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
