<template>
  <div>
    <Navbar />

    <div class="container mx-auto px-4 py-8">
      <!-- Header Dashboard -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-bold text-mora-biru flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Dashboard Keuangan
          </h1>
          <p class="text-gray-600 mt-1">Ringkasan lengkap keuangan Anda</p>
        </div>
        <div class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          <span class="font-medium">Terakhir diperbarui:</span> {{ lastUpdated }}
        </div>
      </div>

      <!-- Ringkasan Cepat -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard 
          title="Saldo Saat Ini" 
          :amount="currentBalance" 
          icon="💰"
          trend="balance"
          :percentage="calculatePercentage(income, expenses)"
          color="bg-blue-50 border border-blue-200"
          text-color="text-blue-800"
        />
        <DashboardCard 
          title="Total Pemasukan" 
          :amount="income" 
          icon="📈" 
          trend="up"
          color="bg-green-50 border border-green-200"
          text-color="text-green-800"
        />
        <DashboardCard 
          title="Total Pengeluaran" 
          :amount="expenses" 
          icon="📉" 
          trend="down"
          color="bg-red-50 border border-red-200"
          text-color="text-red-800"
        />
      </div>

      <!-- Grafik dan Chart -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-800">Pemasukan vs Pengeluaran</h2>
            <select v-model="chartRange" class="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none">
              <option value="7">7 Hari</option>
              <option value="30">30 Hari</option>
              <option value="90">90 Hari</option>
            </select>
          </div>
          <AnalyticsChart 
            type="income-expense" 
            :range="chartRange"
            :key="chartRange" 
            class="h-64"
          />
        </div>
        <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Transaksi Terakhir</h2>
          <TransactionList :transactions="recentTransactions" />
          <NuxtLink 
            to="/transaksi" 
            class="text-sm text-blue-600 hover:text-blue-800 mt-3 inline-block"
          >
            Lihat semua transaksi →
          </NuxtLink>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Aksi Cepat</h2>
        <div class="flex flex-wrap gap-4">
          <NuxtLink 
            to="/transaksi/baru"
            class="px-4 py-2 bg-mora-biru text-white rounded-lg hover:bg-blue-700 transition flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Tambah Transaksi
          </NuxtLink>
          <NuxtLink 
            to="/laporan"
            class="px-4 py-2 bg-mora-kuning text-mora-hitam rounded-lg hover:bg-yellow-500 transition flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Lihat Laporan
          </NuxtLink>
          <button 
            @click="loadData"
            class="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Data
          </button>
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
const lastUpdated = ref(new Date().toLocaleDateString('id-ID'))
// Di script setup dashboard
const chartRange = ref('7')

const calculatePercentage = (income, expenses) => {
  if (expenses === 0) return 100
  return Math.round(((income - expenses) / expenses) * 100)
}

// Fungsi untuk memuat data
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
    lastUpdated.value = new Date().toLocaleString('id-ID')

  } catch (error) {
    console.error('Failed to load data:', error)
  }
}


// Muat data saat komponen muncul
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