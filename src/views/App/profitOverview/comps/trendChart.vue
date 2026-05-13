<template>
  <div class="h-full w-full">
    <div ref="chartDom" class="h-full w-full"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import type { TrendChartData } from '../api/index';

const props = defineProps<{
  chartData: TrendChartData;
}>();

const chartDom = ref<HTMLDivElement | null>(null);
let echart: echarts.ECharts | null = null;
let resizeObserver: ResizeObserver | null = null;

const initChart = () => {
  if (!chartDom.value) return;
  if (echart) {
    echart.dispose();
  }
  echart = markRaw(echarts.init(chartDom.value));
};

const handleResize = () => {
  if (!echart) return;

  requestAnimationFrame(() => {
    echart?.resize();
  });
};

onMounted(() => {
  nextTick(() => {
    initChart();
    renderCharts();
    handleResize();
  });

  if (chartDom.value) {
    resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(chartDom.value);
  }

  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
  window.removeEventListener('resize', handleResize);

  if (echart) {
    echart.dispose();
    echart = null;
  }
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
  handleResize();
};

const getChartOption = (data: TrendChartData): echarts.EChartsCoreOption => ({
  color: ['#6366f1'],
  grid: {
    top: 12,
    right: 16,
    bottom: 36,
    left: 12,
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: data.period,
    boundaryGap: false,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      color: '#94a3b8',
      fontSize: 12,
      margin: 16,
    },
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      color: '#94a3b8',
      fontSize: 12,
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.06)',
      },
    },
  },
  series: [
    {
      data: data.pnl,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 7,
      showSymbol: false,
      emphasis: {
        focus: 'series',
        scale: true,
      },
      lineStyle: {
        width: 3,
        color: '#6366f1',
      },
      itemStyle: {
        color: '#6366f1',
        borderColor: '#c7d2fe',
        borderWidth: 2,
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(99, 102, 241, 0.32)' },
          { offset: 1, color: 'rgba(99, 102, 241, 0)' },
        ]),
      },
      label: {
        show: false,
      },
    },
  ],
  tooltip: {
    trigger: 'axis',
    formatter: '{b}: {c}',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderRadius: 16,
    padding: [10, 12],
    textStyle: {
      color: '#f8fafc',
    },
    axisPointer: {
      type: 'line',
      lineStyle: {
        color: 'rgba(148, 163, 184, 0.35)',
      },
    },
  },
});
</script>
