<template>
  <div>
    <canvas ref="chartCanvas" class="w-full"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

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
    let chartInstance = null

    const fetchChartData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const date = new Date()
      date.setDate(date.getDate() - parseInt(props.range))

      const { data: transactions } = await supabase
        .from('transactions')
        .select('amount, type, created_at')
        .eq('user_id', user.id)
        .gte('created_at', date.toISOString())
        .order('created_at', { ascending: true })

      if (!transactions) return null

      // Format data untuk chart
      if (props.type === 'income-expense') {
        const days = [...Array(parseInt(props.range)).keys()].map(i => {
          const d = new Date()
          d.setDate(d.getDate() - i)
          return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
        }).reverse()

        const incomeData = Array(parseInt(props.range)).fill(0)
        const expenseData = Array(parseInt(props.range)).fill(0)

        transactions.forEach(tx => {
          const dayIndex = Math.floor(
            (new Date(tx.created_at) - date) / (1000 * 60 * 60 * 24)
          )
          if (tx.type === 'income') {
            incomeData[dayIndex] += tx.amount
          } else {
            expenseData[dayIndex] += tx.amount
          }
        })

        return {
          labels: days,
          income: incomeData,
          expenses: expenseData
        }
      }

      return null
    }

    const renderChart = async () => {
      const chartData = await fetchChartData()
      if (!chartData) return

      const ctx = chartCanvas.value.getContext('2d')

      if (chartInstance) {
        chartInstance.destroy()
      }

      if (props.type === 'income-expense') {
        chartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: chartData.labels,
            datasets: [
              {
                label: 'Pemasukan',
                data: chartData.income,
                backgroundColor: '#10B981',
                borderRadius: 4
              },
              {
                label: 'Pengeluaran',
                data: chartData.expenses,
                backgroundColor: '#EF4444',
                borderRadius: 4
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
    }

    onMounted(async () => {
      await renderChart()
    })

    watch(() => props.range, async () => {
      await renderChart()
    })

    return {
      chartCanvas
    }
  }
}
</script>