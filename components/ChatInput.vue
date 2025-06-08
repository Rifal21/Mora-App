<template>
  <div class="relative flex items-center">
    <input
      v-model="message"
      @keyup.enter="sendMessage"
      class="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Ketik pesan atau tekan tombol mic..."
    />
    <button
      @click="toggleVoiceInput"
      :class="{
        'bg-red-500 animate-pulse': isListening,
        'bg-blue-600': !isListening
      }"
      class="ml-2 p-2 rounded-full text-white hover:bg-blue-700 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    </button>
    <span v-if="isListening" class="ml-2 text-sm text-gray-600">Mendengarkan...</span>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  isLoading: Boolean
});

const emit = defineEmits(['send-message']);
const sendMessage = () => {
  if (message.value.trim() && !props.isLoading) {
    emit('send-message', message.value);
    message.value = '';
  }
};
const message = ref('');
const isListening = ref(false);
const recognition = ref(null);

const startVoiceRecognition = async () => {
  // Cek koneksi internet
  if (!navigator.onLine) {
    alert("Voice recognition membutuhkan internet!");
    return;
  }

  // Cek browser support
  if (!('webkitSpeechRecognition' in window)) {
    alert("Browser tidak mendukung fitur voice recognition!");
    return;
  }

  // Minta izin microphone
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (error) {
    alert("Izin microphone diperlukan untuk voice recognition!");
    return;
  }

  // Inisialisasi recognition
  recognition.value = new webkitSpeechRecognition();
  recognition.value.continuous = false;
  recognition.value.interimResults = false;
  recognition.value.lang = 'id-ID'; // Bahasa Indonesia

  recognition.value.onstart = () => {
    isListening.value = true;
  };

  recognition.value.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    message.value = transcript;
    emit('send-message', transcript);
  };

  recognition.value.onerror = (event) => {
    if (event.error === 'network') {
      alert("Gagal terhubung ke layanan suara. Cek internet Anda.");
    }
    isListening.value = false;
  };

  recognition.value.onend = () => {
    isListening.value = false;
  };

  recognition.value.start();
};

const stopVoiceRecognition = () => {
  if (recognition.value) {
    recognition.value.stop();
  }
  isListening.value = false;
};

const toggleVoiceInput = () => {
  if (isListening.value) {
    stopVoiceRecognition();
  } else {
    startVoiceRecognition();
  }
};
</script>