<template>
  <div class="relative flex h-full min-h-[18rem] items-center justify-center">
    <div class="h-full min-h-[18rem] w-full" ref="chartDom"></div>
    <div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
      <span class="text-3xl font-light leading-none text-white">{{ positionRatioText }}</span>
      <span class="mt-1 text-[10px] font-bold uppercase tracking-widest text-textSecondary">
        已配置
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import * as echarts from 'echarts';

interface ChartData {
  totalInvest: number;
  cashInvest: number;
  stockCost: number;
  stockValue: number;
  positionRatio: number;
  stockProfit: number;
  profitRate: number;
}

const props = defineProps<{
  chartData: ChartData;
}>();

const positionRatioText = computed(() => {
  const stockCost = props.chartData.stockCost ?? 0;
  const cashInvest = props.chartData.cashInvest ?? 0;
  const total = stockCost + cashInvest;
  const ratio = total > 0 ? (stockCost / total) * 100 : 0;

  return `${ratio.toFixed(0)}%`;
});

const chartDom = ref<HTMLDivElement | null>(null);
let echart: echarts.ECharts | null = null;

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

onMounted(() => {
  initChart();
  renderCharts();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

watch(
  () => props.chartData,
  () => {
    nextTick(() => {
      renderCharts();
    });
  },
  { deep: true, immediate: true }
);

const renderCharts = () => {
  if (!echart) return;

  const option = getChartOption(props.chartData);
  echart.setOption(option, true);
};

const getChartOption = (data: ChartData): echarts.EChartsCoreOption => ({
  color: ['#6366f1', '#34d399'],
  series: [
    {
      name: '資金配置',
      type: 'pie',
      radius: ['68%', '92%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: true,
      padAngle: 5,
      itemStyle: {
        borderWidth: 0,
        borderRadius: 8,
      },
      data: [
        { value: data.stockCost ?? 0, name: '持股成本' },
        { value: data.cashInvest ?? 0, name: '現金' },
      ],
      label: {
        show: false,
      },
      labelLine: { show: false },
    },
  ],
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    textStyle: {
      color: '#f8fafc',
    },
    formatter: '{b}<br/>金額: {c}<br/>比例: {d}%',
  },
});
</script>
