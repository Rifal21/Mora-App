<template>
  <div v-if="show" class="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
    <div class="animate-pulse">
      <img src="~/assets/images/logo/logo mora.png" alt="Mora" class="w-28 sm:w-40 h-10 sm:h-14 object-cover rounded-md">
    </div>
    <p class="text-[8px] sm:text-lg italic text-bold">"Cuan rapi, planning pasti!"</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const show = ref(true)

onMounted(() => {
  const splashShown = localStorage.getItem('splashShown')
  
  if (!splashShown) {
    setTimeout(() => {
      show.value = false
      localStorage.setItem('splashShown', 'true')
    }, 5000)
  } else {
    show.value = false
  }
})
</script>