<template>
  <div class="chart-container relative h-72 w-full">
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
    <div v-if="noData" class="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-center">Belum ada data transaksi<br>Mulai catat transaksi Anda untuk melihat grafik</p>
      <NuxtLink 
        to="/transaksi/baru" 
        class="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Tambah Transaksi
      </NuxtLink>
    </div>
    <canvas ref="chartCanvas" v-show="!noData"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'
import { useSupabaseClient } from '#imports'

export default {
  props: {
    type: {
      type: String,
      required: true,
      validator: value => ['income-expense', 'expense-categories'].includes(value)
    },
    range: {
      type: String,
      default: '7'
    }
  },

  setup(props) {
    const supabase = useSupabaseClient()
    const chartCanvas = ref(null)
    const loading = ref(true)
    const noData = ref(false)
    let chartInstance = null

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'IDR', 
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value)
    }

    const getDateRange = () => {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - parseInt(props.range))
      
      return { startDate, endDate }
    }

    const generateEmptyData = () => {
      const days = [...Array(parseInt(props.range)).keys()].map(i => {
        const d = new Date()
        d.setDate(d.getDate() - (parseInt(props.range) - 1 - i))
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
      })
      
      return {
        labels: days,
        income: Array(parseInt(props.range)).fill(0),
        expenses: Array(parseInt(props.range)).fill(0)
      }
    }

    const fetchChartData = async () => {
      try {
        loading.value = true
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return generateEmptyData()

        const { startDate, endDate } = getDateRange()

        const { data: transactions } = await supabase
          .from('transactions')
          .select('amount, type, created_at, category')
          .eq('user_id', user.id)
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())
          .order('created_at', { ascending: true })

        // Generate empty data structure first
        const chartData = generateEmptyData()
        
        if (!transactions || transactions.length === 0) {
          noData.value = true
          return chartData
        }

        noData.value = false

        // Fill with actual transaction data
        transactions.forEach(tx => {
          const txDate = new Date(tx.created_at)
          const dayIndex = Math.floor(
            (txDate - startDate) / (1000 * 60 * 60 * 24)
          )
          
          if (dayIndex >= 0 && dayIndex < parseInt(props.range)) {
            if (tx.type === 'income') {
              chartData.income[dayIndex] += tx.amount
            } else {
              chartData.expenses[dayIndex] += tx.amount
            }
          }
        })

        return chartData
      } catch (error) {
        console.error('Error fetching chart data:', error)
        return generateEmptyData()
      } finally {
        loading.value = false
      }
    }

    const renderChart = async () => {
      const chartData = await fetchChartData()
      if (!chartData) return

      const ctx = chartCanvas.value?.getContext('2d')
      if (!ctx) return

      if (chartInstance) {
        chartInstance.destroy()
      }

      if (props.type === 'income-expense') {
        const gradientIncome = ctx.createLinearGradient(0, 0, 0, 300)
        gradientIncome.addColorStop(0, 'rgba(16, 185, 129, 0.2)')
        gradientIncome.addColorStop(1, 'rgba(16, 185, 129, 0)')

        const gradientExpense = ctx.createLinearGradient(0, 0, 0, 300)
        gradientExpense.addColorStop(0, 'rgba(239, 68, 68, 0.2)')
        gradientExpense.addColorStop(1, 'rgba(239, 68, 68, 0)')

        chartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: chartData.labels,
            datasets: [
              {
                label: 'Pemasukan',
                data: chartData.income,
                borderColor: '#10B981',
                backgroundColor: gradientIncome,
                borderWidth: 2,
                tension: 0.3,
                fill: true,
                pointBackgroundColor: '#10B981',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
              },
              {
                label: 'Pengeluaran',
                data: chartData.expenses,
                borderColor: '#EF4444',
                backgroundColor: gradientExpense,
                borderWidth: 2,
                tension: 0.3,
                fill: true,
                pointBackgroundColor: '#EF4444',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              intersect: false,
              mode: 'index'
            },
            scales: {
              x: {
                grid: {
                  display: false,
                  drawBorder: false
                },
                ticks: {
                  color: '#6B7280'
                }
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: '#F3F4F6',
                  drawBorder: false
                },
                ticks: {
                  color: '#6B7280',
                  callback: function(value) {
                    if (value >= 1000000) {
                      return 'Rp' + (value / 1000000).toFixed(1) + 'jt'
                    } else if (value >= 1000) {
                      return 'Rp' + (value / 1000).toFixed(0) + 'rb'
                    }
                    return 'Rp' + value
                  }
                }
              }
            },
            plugins: {
              tooltip: {
                backgroundColor: '#1F2937',
                titleColor: '#F9FAFB',
                bodyColor: '#F9FAFB',
                borderColor: '#374151',
                borderWidth: 1,
                padding: 12,
                usePointStyle: true,
                callbacks: {
                  label: function(context) {
                    let label = context.dataset.label || ''
                    if (label) {
                      label += ': '
                    }
                    label += formatCurrency(context.raw)
                    return label
                  },
                  labelColor: function(context) {
                    return {
                      borderColor: context.dataset.borderColor,
                      backgroundColor: context.dataset.borderColor,
                      borderWidth: 2
                    }
                  }
                }
              },
              legend: {
                position: 'top',
                align: 'end',
                labels: {
                  usePointStyle: true,
                  pointStyle: 'circle',
                  padding: 20,
                  color: '#374151'
                }
              }
            }
          }
        })
      }
    }

    onMounted(async () => {
      await renderChart()
    })

    watch(() => props.range, async () => {
      await renderChart()
    })

    return {
      chartCanvas,
      loading,
      noData
    }
  }
}
</script>

<style scoped>
.chart-container {
  min-height: 18rem;
}
</style>