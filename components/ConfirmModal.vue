<template>
  <Transition name="modal">
    <div class="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h3 class="text-xl font-bold text-gray-800 mb-4">{{ message }}</h3>
        
        <div v-if="transaction" class="space-y-3 mb-6">
          <div class="flex justify-between">
            <span class="text-gray-600">Jumlah:</span>
            <span :class="`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`">
              {{ transaction.type === 'income' ? '+' : '-' }}Rp {{ formatCurrency(transaction.amount) }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Keterangan:</span>
            <span class="font-medium">{{ transaction.description }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Jenis:</span>
            <span class="capitalize">{{ transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Tanggal:</span>
            <span>{{ formatDate(transaction.date) }}</span>
          </div>
        </div>

        <div class="flex justify-end space-x-3">
          <button 
            @click="$emit('cancel')"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            :disabled="isProcessing"
          >
            Batal
          </button>
          <button 
            @click="$emit('confirm')"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center min-w-24"
            :disabled="isProcessing"
          >
            <span v-if="!isProcessing">Konfirmasi</span>
            <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  message: {
    type: String,
    required: true
  },
  transaction: {
    type: Object,
    default: null
  },
  isProcessing: {
    type: Boolean,
    default: false
  },
  formatCurrency: {
    type: Function,
    required: true
  }
})

defineEmits(['cancel', 'confirm'])

const formatDate = (dateString) => {
  const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Button loading state */
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>