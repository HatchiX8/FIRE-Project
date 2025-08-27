<template>
  <div class="flex">
    <div class="bg-background w-1.5/3 h-70" ref="chartDom"></div>
    <!-- 右邊：自訂數值 -->
    <div class="text-textColor text-4 w-1.5/3 flex flex-col justify-center">
      <div class="mb-2 flex justify-between">
        <span>總資產</span>
        <span>{{ props.chartData.totalInvest }} </span>
      </div>
      <div class="mb-2 flex justify-between">
        <span>持股成本</span>
        <span>{{ props.chartData.stockCost }} </span>
      </div>
      <div class="mb-2 flex justify-between">
        <span>股票市值</span>
        <span>{{ props.chartData.stockValue }} </span>
      </div>
      <div class="mb-2 flex justify-between">
        <span>未實現損益</span>
        <span>{{ props.chartData.stockProfit }}({{ props.chartData.profitRate }}) </span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
// ----------import----------
// 套件
import { ref, markRaw, onMounted, onUnmounted, watch, nextTick } from 'vue';
import * as echarts from 'echarts';
// store
// 共用型別
// 元件
// 商業邏輯

// ---------------------------

// ----------type----------
interface ChartData {
  totalInvest: number;
  cashInvest: number;
  stockCost: number;
  stockValue: number;
  positionRatio: number;
  stockProfit: number;
  profitRate: number;
}
// ------------------------

// ----------props&emit----------
const props = defineProps<{
  chartData: ChartData;
}>();

// const emit = defineEmits<{
//   (e: 'chart-ready', instance: echarts.ECharts): void;
// }>();
// ------------------------------

// ----------趨勢圖初始化----------
const chartDom = ref<HTMLDivElement | null>(null); // DOM 容器
let echart: echarts.ECharts | null = null; // 圖表實例 (用 ref 會導致 tooltip 無法正常顯示)

// 初始化
const initChart = () => {
  if (!chartDom.value) return;
  if (echart) {
    echart.dispose();
  }
  echart = markRaw(echarts.init(chartDom.value));
};

const handleResize = () => {
  if (echart) echart.resize();
};

// 掛載元件
onMounted(() => {
  initChart(); // 初始化趨勢圖
  renderCharts(); // 更新趨勢圖
  window.addEventListener('resize', handleResize); // 處理自適應問題
});

// 卸載元件
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
// -------------------------------

// ----------watch----------
watch(
  () => props.chartData,
  () => {
    nextTick(() => {
      renderCharts();
    });
  },
  { deep: true, immediate: true }
);
// -------------------------

// ----------趨勢圖----------
// 更新趨勢圖
const renderCharts = () => {
  if (!echart) return;

  const option = getChartOption(props.chartData);
  echart.setOption(option, true);
};

// 可抽換趨勢圖內容
const getChartOption = (data: ChartData): echarts.EChartsCoreOption => ({
  series: [
    {
      name: '資金配置',
      type: 'pie',
      radius: '70%',
      center: ['42%', '45%'], // ⬅️ 這裡往上移，數字越小越上方
      avoidLabelOverlap: false,
      data: [
        { value: data.cashInvest ?? 0, name: '現金部位' },
        { value: data.stockCost ?? 0, name: '股票部位' },
        // { value: data.countG?.[0] ?? 0, name: '現金比重' },
        // { value: data.countR?.[0] ?? 0, name: '持股水位' },
      ],
      label: {
        show: false,
        formatter: '{b}\n{c} ({d}%)', // 顯示名稱 數值 百分比
      },

      labelLine: { show: false },
    },
  ],
  tooltip: {
    trigger: 'item',
    formatter: '{b}<br/>金額: {c}<br/>水位: {d}%',
  },
  legend: {
    show: false,
    orient: 'vertical',
    left: 'left',
    bottom: 8,
    textStyle: {
      color: '#A0A0A0', // 依你的 textSecondary 調
    },
  },
});
// -------------------------
</script>
