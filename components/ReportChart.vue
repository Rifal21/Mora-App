<script>
import { Chart, registerables } from 'chart.js'
import { ref, onMounted, watch } from 'vue'

export default {
  props: {
    type: {
      type: String,
      default: 'bar',
      validator: value => ['bar', 'line'].includes(value)
    },
    data: {
      type: Object,
      required: true
    }
  },
  
  setup(props) {
    const chartCanvas = ref(null)
    let chartInstance = null

    const renderChart = () => {
      if (!props.data || !chartCanvas.value) return

      const ctx = chartCanvas.value.getContext('2d')

      if (chartInstance) {
        chartInstance.destroy()
      }

      chartInstance = new Chart(ctx, {
        type: props.type,
        data: {
          labels: props.data.labels,
          datasets: [
            {
              label: 'Pemasukan',
              data: props.data.income,
              backgroundColor: '#10B981',
              borderColor: '#10B981',
              tension: 0.1,
              borderRadius: props.type === 'bar' ? 4 : 0
            },
            {
              label: 'Pengeluaran',
              data: props.data.expenses,
              backgroundColor: '#EF4444',
              borderColor: '#EF4444',
              tension: 0.1,
              borderRadius: props.type === 'bar' ? 4 : 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: '#E5E7EB'
              },
              ticks: {
                callback: function(value) {
                  return 'Rp' + value.toLocaleString('id-ID')
                }
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || ''
                  if (label) {
                    label += ': '
                  }
                  label += 'Rp' + context.raw.toLocaleString('id-ID')
                  return label
                }
              }
            },
            legend: {
              position: 'top',
              align: 'end'
            }
          }
        }
      })
    }

    onMounted(() => {
      Chart.register(...registerables)
      renderChart()
    })

    watch(() => props.type, renderChart)
    watch(() => props.data, renderChart, { deep: true })

    return {
      chartCanvas
    }
  }
}
</script>

<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>