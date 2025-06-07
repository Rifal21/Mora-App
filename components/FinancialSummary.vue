<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold text-blue-800 mb-4 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Ringkasan Keuangan
    </h2>

    <div class="space-y-4">
      <!-- Saldo Bulan Ini -->
      <div class="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
        <p class="text-gray-600 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Saldo Bulan Ini
        </p>
        <p class="text-2xl font-bold text-gray-900">Rp {{ formatCurrency(currentBalance) }}</p>
      </div>

      <!-- Pemasukan dan Pengeluaran -->
      <div class="grid grid-cols-2 gap-4">
        <div class="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
          <p class="text-gray-600">Total Pemasukan</p>
          <p class="text-xl font-bold text-green-700">Rp {{ formatCurrency(income) }}</p>
        </div>

        <div class="p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
          <p class="text-gray-600">Total Pengeluaran</p>
          <p class="text-xl font-bold text-red-700">Rp {{ formatCurrency(expenses) }}</p>
        </div>
      </div>

      <!-- Transaksi Terakhir -->
      <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p class="text-gray-600 mb-2">Transaksi Terakhir</p>
        <div v-if="recentTransactions.length > 0" class="space-y-2">
          <div 
            v-for="transaction in recentTransactions" 
            :key="transaction.id" 
            class="flex justify-between items-center p-2 hover:bg-gray-100 rounded transition"
          >
            <div>
              <p class="font-medium">{{ transaction.description }}</p>
              <p class="text-xs text-gray-500">{{ formatDate(transaction.date) }}</p>
            </div>
            <p :class="`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`">
              {{ transaction.type === 'income' ? '+' : '-' }}Rp {{ formatCurrency(transaction.amount) }}
            </p>
          </div>
        </div>
        <p v-else class="text-gray-500 text-sm">Belum ada transaksi</p>
      </div>
      <a href="/transaksi" class="block mt-4 text-blue-600 hover:underline text-end">Lihat semua transaksi →</a>
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
/* Animation for transaction items */
.transaction-enter-active,
.transaction-leave-active {
  transition: all 0.3s ease;
}
.transaction-enter-from,
.transaction-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>