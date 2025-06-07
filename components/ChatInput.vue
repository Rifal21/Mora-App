<template>
    <div class="flex items-center">
        <input v-model="message" @keyup.enter="sendMessage" type="text"
            placeholder="ex:'Catat pengeluaran Rp 200.000 untuk makan siang'"
            class="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
        <button @click="sendMessage" class="bg-blue-600 text-white p-3 rounded-r-lg hover:bg-blue-700 transition">
            Kirim
        </button>
    </div>
</template>

<script setup>
const message = ref('');

const emit = defineEmits(['send-message']);

const sendMessage = () => {
    if (message.value.trim()) {
         console.log("Mengirim pesan:", message.value) // 👈 debug
        emit('send-message', message.value);
        message.value = '';
    }
};
</script>1