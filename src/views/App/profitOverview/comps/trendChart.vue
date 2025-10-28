<template>
  <div class="overflow-auto rounded-2xl">
    <div class="h-full w-full bg-white" ref="chartDom"></div>
  </div>
</template>
<script setup lang="ts">
// ----------import----------
// 套件
import { ref, markRaw, onMounted, onUnmounted, watch, nextTick } from 'vue';
import * as echarts from 'echarts';
// 共用型別
import type { TrendChartData } from '../api/index';
// 元件
// 商業邏輯

// ---------------------------

// ----------props&emit----------
const props = defineProps<{
  chartData: TrendChartData;
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
const getChartOption = (data: TrendChartData): echarts.EChartsCoreOption => ({
  xAxis: {
    type: 'category',
    data: data.period, // 月度數據
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: data.pnl, // 模擬數據
      type: 'line',

      label: {
        show: true,
        position: 'top', // 數據點標籤
      },
    },
  ],
  tooltip: {
    trigger: 'axis', // 顯示軸提示
    formatter: '{b}: {c}',
  },
});
// -------------------------
</script>
