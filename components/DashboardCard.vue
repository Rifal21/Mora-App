<template>
  <div class="p-6 rounded-xl transition-all duration-300 hover:shadow-md" :class="color">
    <div class="flex justify-between items-start">
      <div>
        <p class="text-sm font-medium text-gray-600">{{ title }}</p>
        <p class="text-2xl font-bold mt-2" :class="textColor">
          Rp {{ formatCurrency(amount) }}
        </p>
        <div v-if="percentage !== undefined" class="mt-2 flex items-center">
          <span class="text-xs" :class="percentage >= 0 ? 'text-green-600' : 'text-red-600'">
            {{ percentage >= 0 ? '+' : '' }}{{ Math.abs(percentage) }}%
          </span>
          <svg 
            v-if="trend"
            xmlns="http://www.w3.org/2000/svg" 
            class="h-4 w-4 ml-1" 
            :class="percentage >= 0 ? 'text-green-600' : 'text-red-600'"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              :d="percentage >= 0 ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'" 
            />
          </svg>
        </div>
      </div>
      <span class="text-3xl p-3 rounded-full bg-white bg-opacity-50">{{ icon }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  amount: Number,
  icon: String,
  color: String,
  textColor: {
    type: String,
    default: 'text-gray-800'
  },
  trend: {
    type: String,
    validator: value => ['up', 'down', 'balance'].includes(value)
  },
  percentage: Number
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID').format(value)
}
</script>