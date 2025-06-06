<template>
  <div>
    <div v-if="transactions.length === 0" class="text-center py-4 text-gray-500">
      Tidak ada transaksi
    </div>
    
    <div v-else class="divide-y divide-gray-200">
      <div 
        v-for="transaction in transactions" 
        :key="transaction.id" 
        class="py-3 hover:bg-gray-50 transition px-1"
      >
        <div class="flex justify-between items-center">
          <div>
            <p class="font-medium">{{ transaction.description }}</p>
            <p class="text-xs text-gray-500 mt-1">
              {{ new Date(transaction.created_at).toLocaleDateString('id-ID', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
              }) }}
            </p>
          </div>
          <p 
            :class="`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`"
          >
            {{ transaction.type === 'income' ? '+' : '-' }}Rp {{ formatCurrency(transaction.amount) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  transactions: {
    type: Array,
    required: true
  }
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID').format(value)
}
</script>