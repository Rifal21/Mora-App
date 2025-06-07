<template>
  <div class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mt-2">
    <!-- Header with decorative accent -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-500 h-2 w-full"></div>
    
    <div class="p-6">
      <!-- Header with icon and title -->
      <div class="flex items-center mb-6">
        <div class="bg-blue-100 p-3 rounded-xl mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-800">Ringkasan Keuangan</h2>
      </div>

      <!-- Balance Card -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 mb-6 border border-blue-100 relative overflow-hidden">
        <div class="absolute -right-4 -bottom-4 opacity-20">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="relative z-10">
          <div class="flex items-center text-blue-600 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span class="text-sm font-medium">Saldo Bulan Ini</span>
          </div>
          <p class="text-3xl font-bold text-gray-900">Rp {{ formatCurrency(currentBalance) }}</p>
        </div>
      </div>

      <!-- Income & Expense Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <!-- Income Card -->
        <div class="bg-green-50 rounded-xl p-5 border border-green-100 relative overflow-hidden">
          <div class="absolute -right-4 -bottom-4 opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="relative z-10">
            <p class="text-sm text-green-600 mb-1">Total Pemasukan</p>
            <p class="text-2xl font-bold text-green-700">+Rp {{ formatCurrency(income) }}</p>
          </div>
        </div>

        <!-- Expense Card -->
        <div class="bg-red-50 rounded-xl p-5 border border-red-100 relative overflow-hidden">
          <div class="absolute -right-4 -bottom-4 opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="relative z-10">
            <p class="text-sm text-red-600 mb-1">Total Pengeluaran</p>
            <p class="text-2xl font-bold text-red-700">-Rp {{ formatCurrency(expenses) }}</p>
          </div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="border border-gray-200 rounded-xl overflow-hidden">
        <div class="bg-gray-50 px-5 py-3 border-b border-gray-200">
          <h3 class="font-medium text-gray-700">Transaksi Terakhir</h3>
        </div>
        
        <div class="divide-y divide-gray-100">
          <div 
            v-for="transaction in recentTransactions" 
            :key="transaction.id" 
            class="px-5 py-3 hover:bg-gray-50 transition-colors duration-150"
          >
            <div class="flex justify-between items-center">
              <div>
                <p class="font-medium text-gray-800">{{ transaction.description }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ formatDate(transaction.date) }}</p>
              </div>
              <span 
                :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                  transaction.type === 'income' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`"
              >
                {{ transaction.type === 'income' ? '+' : '-' }}Rp {{ formatCurrency(transaction.amount) }}
              </span>
            </div>
          </div>
          
          <div v-if="recentTransactions.length === 0" class="px-5 py-4 text-center">
            <p class="text-gray-500 text-sm">Belum ada transaksi</p>
          </div>
        </div>
        
        <div class="bg-gray-50 px-5 py-3 border-t border-gray-200 text-right">
          <NuxtLink 
            to="/transaksi" 
            class="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            Lihat semua transaksi
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  currentBalance: {
    type: Number,
    default: 0
  },
  income: {
    type: Number,
    default: 0
  },
  expenses: {
    type: Number,
    default: 0
  },
  recentTransactions: {
    type: Array,
    default: () => []
  },
  formatCurrency: {
    type: Function,
    required: true
  }
})

const formatDate = (dateString) => {
  const options = { day: 'numeric', month: 'short', year: 'numeric' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}
</script>

<style scoped>
/* Smooth transitions */
.transaction-enter-active,
.transaction-leave-active {
  transition: all 0.3s ease;
}
.transaction-enter-from,
.transaction-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

/* Hover effect for cards */
.bg-gradient-to-r:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}
</style>