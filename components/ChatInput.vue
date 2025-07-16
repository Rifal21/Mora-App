<template>
    <div class="flex items-center">
        <input v-model="message" @keyup.enter="sendMessage" type="text"
            placeholder="ex:'Catat pengeluaran Rp 200.000 untuk makan siang'"
            class="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
        <button @click="toggleVoiceRecognition" 
            :class="['p-3 transition', 
                    isListening 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700']"
            type="button"
            title="Voice input">
            <IconMicrophone class="h-6 w-6" />
        </button>
        <button @click="sendMessage" 
            :disabled="isLoading"
            :class="['bg-blue-600 text-white p-3 rounded-r-lg hover:bg-blue-700 transition',
                    {'opacity-50 cursor-not-allowed': isLoading}]">
            <IconSend class="h-6 w-6" />
        </button>
    </div>
    <div v-if="isListening" class="mt-2 text-sm text-gray-600 flex items-center">
        <div class="w-3 h-3 rounded-full bg-red-500 animate-pulse mr-2"></div>
        Listening... Speak now
    </div>
</template>

<script setup>
import { IconSend, IconMicrophone } from '@tabler/icons-vue';
import { ref, onMounted, onUnmounted } from 'vue';

const message = ref('');
const isListening = ref(false);
const recognition = ref(null);
const isLoading = ref(false);

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

const toggleVoiceRecognition = () => {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Your browser doesn't support speech recognition. Try Chrome or Edge.");
    return;
  }

  if (isListening.value) {
    stopVoiceRecognition();
  } else {
    startVoiceRecognition();
  }
};

const startVoiceRecognition = () => {
  isListening.value = true;
  recognition.value = new webkitSpeechRecognition();
  recognition.value.continuous = false;
  recognition.value.interimResults = false;
  recognition.value.lang = 'id-ID'; // Set to Indonesian, change as needed

  recognition.value.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    message.value += (message.value ? ' ' : '') + transcript;
    stopVoiceRecognition();
    sendMessage();
  };

  recognition.value.onerror = (event) => {
    console.error('Speech recognition error', event.error);
    stopVoiceRecognition();
    if (event.error === 'not-allowed') {
      alert('Please allow microphone access to use voice input.');
    }
  };

  recognition.value.onend = () => {
    if (isListening.value) {
      // If still listening, restart recognition (happens after short pause)
      recognition.value.start();
    }
  };

  recognition.value.start();
};

const stopVoiceRecognition = () => {
  if (recognition.value) {
    recognition.value.stop();
  }
  isListening.value = false;
};

onUnmounted(() => {
  stopVoiceRecognition();
});
</script>