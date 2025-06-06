<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const props = defineProps({
    type: String,
    data: Object,
    options: Object
});

const chartCanvas = ref(null);
let chartInstance = null;

onMounted(() => {
    chartInstance = new Chart(chartCanvas.value, {
        type: props.type,
        data: props.data,
        options: props.options
    });
});

onBeforeUnmount(() => {
    chartInstance?.destroy();
});
</script>

<template>
    <div class="chart-container">
        <canvas ref="chartCanvas"></canvas>
    </div>
</template>