<template>
  <div class="min-h-screen bg-gray-50 mt-16 mb-16 sm:mt-0 sm:mb-0">
    <Navbar />

    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <!-- Header with subtle gradient -->
      <div class="mb-5">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div class="flex items-center mb-2">
              <div class="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 class="text-2xl md:text-3xl font-bold text-gray-800">Dashboard Keuangan</h1>
                <p class="text-gray-500 mt-1 text-sm">Ringkasan lengkap aktivitas keuangan Anda</p>
              </div>
            </div>
          </div>
          <div class="text-xs text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-xs flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Diperbarui: {{ lastUpdated }}</span>
          </div>
        </div>
      </div>

      <!-- Summary Cards - Elegant Design -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <!-- Balance Card -->
        <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-xs hover:shadow-sm transition-all duration-200">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Saldo Saat Ini</p>
              <p class="text-2xl font-semibold text-gray-800 mb-2">{{ formatCurrency(currentBalance) }}</p>
              <div class="flex items-center">
                <span :class="`text-xs px-2 py-1 rounded-full ${calculatePercentage(income, expenses) >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`">
                  {{ calculatePercentage(income, expenses) >= 0 ? '↑' : '↓' }} 
                  {{ Math.abs(calculatePercentage(income, expenses)) }}%
                </span>
                <span class="text-xs text-gray-500 ml-2">vs bulan lalu</span>
              </div>
            </div>
            <div class="p-2 bg-blue-50 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Income Card -->
        <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-xs hover:shadow-sm transition-all duration-200">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Total Pemasukan</p>
              <p class="text-2xl font-semibold text-gray-800 mb-2">{{ formatCurrency(income) }}</p>
              <div class="flex items-center">
                <span class="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                  ↑ 12.5%
                </span>
                <span class="text-xs text-gray-500 ml-2">vs bulan lalu</span>
              </div>
            </div>
            <div class="p-2 bg-green-50 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Expense Card -->
        <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-xs hover:shadow-sm transition-all duration-200">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Total Pengeluaran</p>
              <p class="text-2xl font-semibold text-gray-800 mb-2">{{ formatCurrency(expenses) }}</p>
              <div class="flex items-center">
                <span class="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                  ↓ 8.3%
                </span>
                <span class="text-xs text-gray-500 ml-2">vs bulan lalu</span>
              </div>
            </div>
            <div class="p-2 bg-red-50 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <!-- Chart Section -->
        <div class="bg-white rounded-xl p-6 border border-gray-100 shadow-xs lg:col-span-3">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <h2 class="text-lg font-semibold text-gray-800 flex items-center">
              <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              Tren Keuangan
            </h2>
            <select 
              v-model="chartRange" 
              class="text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 bg-white"
            >
              <option value="7">7 Hari</option>
              <option value="30">30 Hari</option>
              <option value="90">90 Hari</option>
            </select>
          </div>
          <div class="h-72">
            <AnalyticsChart 
              type="income-expense" 
              :range="chartRange"
              :key="chartRange" 
            />
          </div>
        </div>

        <!-- Recent Transactions & Budget -->
        <div class="grid grid-cols-1 gap-6 lg:col-span-2">
          <!-- Recent Transactions -->
          <div class="bg-white rounded-xl p-6 border border-gray-100 shadow-xs">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-semibold text-gray-800 flex items-center">
                <div class="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                Transaksi Terakhir
              </h2>
              <NuxtLink 
                to="/transaksi" 
                class="text-xs text-blue-600 hover:text-blue-800 flex items-center"
              >
                Lihat semua
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </NuxtLink>
            </div>
            <TransactionList :transactions="recentTransactions" />
          </div>

          <!-- Budget Overview -->
          <div class="bg-white rounded-xl p-6 border border-gray-100 shadow-xs">
            <h2 class="text-lg font-semibold text-gray-800 flex items-center mb-6">
              <div class="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                </svg>
              </div>
              Ringkasan Anggaran
            </h2>
            <div class="space-y-4">
              <div v-for="category in budgetCategories" :key="category.name" class="flex flex-col">
                <div class="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{{ category.name }}</span>
                  <span>{{ category.used }}/{{ category.total }}</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-1.5">
                  <div 
                    :class="`h-1.5 rounded-full ${category.percentage >= 80 ? 'bg-red-500' : category.percentage >= 50 ? 'bg-yellow-500' : 'bg-green-500'}`" 
                    :style="`width: ${Math.min(category.percentage, 100)}%`"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSupabaseClient } from '#imports'

const supabase = useSupabaseClient()
const currentBalance = ref(0)
const income = ref(0)
const expenses = ref(0)
const recentTransactions = ref([])
const lastUpdated = ref(new Date().toLocaleDateString('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
}))
const chartRange = ref('30')

// Sample budget data
const budgetCategories = ref([
  { name: 'Makanan & Minuman', used: 1200000, total: 1500000, percentage: 80 },
  { name: 'Transportasi', used: 450000, total: 1000000, percentage: 45 },
  { name: 'Hiburan', used: 300000, total: 500000, percentage: 60 },
  { name: 'Tagihan', used: 1800000, total: 2000000, percentage: 90 }
])

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)
}

const calculatePercentage = (income, expenses) => {
  if (expenses === 0) return 100
  return Math.round(((income - expenses) / expenses) * 100)
}

const loadData = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // 1. Hitung saldo secara real-time dari transaksi
    const { data: transactions } = await supabase
      .from('transactions')
      .select('amount, type')
      .eq('user_id', user.id)

    const calculated = transactions.reduce((acc, tx) => {
      if (tx.type === 'income') {
        acc.balance += tx.amount
        acc.income += tx.amount
      } else {
        acc.balance -= tx.amount
        acc.expenses += tx.amount
      }
      return acc
    }, { balance: 0, income: 0, expenses: 0 })

    currentBalance.value = calculated.balance
    income.value = calculated.income
    expenses.value = calculated.expenses

    // 2. Update user_balance untuk caching
    await supabase
      .from('user_balance')
      .upsert({
        user_id: user.id,
        balance: calculated.balance,
        income: calculated.income,
        expenses: calculated.expenses
      })

    // 3. Ambil transaksi terakhir
    const { data: recent } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    recentTransactions.value = recent || []
    lastUpdated.value = new Date().toLocaleString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

  } catch (error) {
    console.error('Failed to load data:', error)
  }
}

onMounted(async () => {
  await loadData()

  // Set up listener untuk perubahan auth
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      loadData()
    }
  })
})
</script>