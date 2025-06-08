<template>
  <div class="h-screen bg-gray-100 flex flex-col lg:mb-10 md:mb-24">
    <Navbar />
    
    <!-- Main Chat Container -->
    <div class="flex-1 flex flex-col max-w-6xl w-full mx-auto p-4 md:p-6 lg:mt-20">
      <!-- Chat Header -->
      <div class="bg-white rounded-t-lg shadow-sm border-b border-gray-200 p-4 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="bg-blue-600 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-800">Mora AI Assistant</h1>
            <p class="text-xs text-gray-500 flex items-center">
              <span class="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              Online
            </p>
          </div>
        </div>
        <button @click="loadChatHistory" class="bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded cursor-pointer text-sm font-medium">
          Refresh Chat
        </button>
      </div>

      <!-- Chat Messages Area -->
      <div 
        class="flex-1 bg-white overflow-y-auto p-4 space-y-4 border-x border-gray-200 chat-container"
        ref="chatContainerRef"
      >
        <!-- Welcome Message -->
        <div v-if="chatHistory.length === 0" class="text-center py-6">
          <div class="inline-flex items-center justify-center bg-blue-100 text-blue-800 rounded-full p-3 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-gray-800 mb-1">Selamat datang di Mora AI</h2>
          <p class="text-gray-600 max-w-md mx-auto">Saya asisten keuangan Anda. Tanyakan apa saja atau catat transaksi Anda.</p>
        </div>

        <!-- Chat Messages -->
        <transition-group name="message" tag="div">
          <div 
            v-for="(message, index) in chatHistory" 
            :key="index" 
            class="transition-all duration-200"
            :class="{
              'flex justify-end': message.role === 'user',
              'flex justify-start': message.role !== 'user'
            }"
          >
            <!-- User Message -->
            <div 
              v-if="message.role === 'user'"
              class="max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl bg-blue-600 text-white rounded-xl rounded-tr-none px-4 py-2 shadow-sm mb-3"
            >
              <div v-html="formatMessage(message.content)"></div>
              <p class="text-xs text-blue-200 text-right mt-1">
                {{ formatTime(message.timestamp) }}
              </p>
            </div>

            <!-- AI Message -->
            <div 
              v-else-if="message.role === 'assistant'"
              class="max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl bg-gray-50 border border-gray-200 rounded-xl rounded-tl-none px-4 py-2 shadow-sm mb-3"
            >
              <div v-html="formatMessage(message.content)"></div>
              <div v-if="message.isTyping" class="typing-indicator flex space-x-1 mt-2">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
              </div>
              <p v-else class="text-xs text-gray-500 mt-1">
                {{ formatTime(message.timestamp) }}
              </p>
            </div>

            <!-- System Message -->
            <div 
              v-else
              class="max-w-md mx-auto bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-sm text-center"
            >
              <div v-html="formatMessage(message.content)"></div>
            </div>
          </div>
        </transition-group>
      </div>

      <!-- Chat Input Area -->
      <div class="bg-white rounded-b-lg shadow-sm border-t border-gray-200 p-4">
        <ChatInput 
          @send-message="handleSendMessage" 
          :is-loading="isAiResponding"
        />
      </div>
    </div>

    <!-- Confirmation Modal -->
    <ConfirmModal 
      v-if="showConfirmModal"
      :message="modalMessage"
      :transaction="pendingTransaction"
      :isProcessing="isProcessing"
      @cancel="showConfirmModal = false"
      @confirm="confirmSaveTransaction"
      :formatCurrency="formatCurrency"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import Groq from 'groq-sdk';
import { useSupabaseClient } from '#imports';

const supabase = useSupabaseClient();
const { data: { user } } = await supabase.auth.getUser();
const chatHistory = ref([]);
const chatContainerRef = ref(null);
const isAiResponding = ref(false);
const showConfirmModal = ref(false);
const pendingTransaction = ref(null);
const modalMessage = ref('');
const isProcessing = ref(false);
const groq = new Groq({
  apiKey: useRuntimeConfig().public.groqApiKey, 
  dangerouslyAllowBrowser: true
});

// Format message with basic markdown
const formatMessage = (content) => {
  if (!content) return '';
  
  // Handle bold (**text**)
  let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Handle italic (*text* or _text_)
  formatted = formatted.replace(/\*(.*?)\*|_(.*?)_/g, '<em>$1$2</em>');
  
  // Handle code blocks (`code`)
  formatted = formatted.replace(/`(.*?)`/g, '<code class="bg-gray-200 px-1 py-0.5 rounded text-sm">$1</code>');
  
  // Handle line breaks
  formatted = formatted.replace(/\n/g, '<br>');
  
  return formatted;
};

// Format time for messages
const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID').format(value);
};

// Load chat history from database
const loadChatHistory = async () => {
  try {
    const { data: chatData, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) throw error;

    chatHistory.value = chatData.flatMap(chat => [
      { 
        role: 'user', 
        content: chat.user_message,
        timestamp: chat.created_at
      },
      { 
        role: 'assistant', 
        content: chat.ai_response,
        timestamp: chat.created_at
      }
    ]);

    scrollToBottom();
  } catch (error) {
    console.error('Error loading chat history:', error);
    chatHistory.value.push({
      role: 'system',
      content: '⚠️ Gagal memuat riwayat chat. Silakan coba lagi.',
      timestamp: new Date().toISOString()
    });
  }
};

// Process message with Groq AI
const processWithGroqAI = async (message) => {
  try {
    const querySaldo = [
      'saldo sekarang',
      'berapa saldo saya',
      'berapa saldo saya sekarang',
      'berapa saldo saya saat ini',
      'tampilkan saldo saya',
      'tampilkan saldo saya sekarang',
      'hitung saldo saya',
      'cek saldo',
      'saldo saya'
    ];

    // Check if user is asking about balance
    const isSaldoQuery = querySaldo.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );

    if (isSaldoQuery) {
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('amount, type')
        .eq('user_id', user.id);

      if (error) throw error;

      const currentBalance = transactions.reduce((acc, tx) => {
        return tx.type === 'income' ? acc + tx.amount : acc - tx.amount;
      }, 0);

      return {
        reply: `Saldo Anda saat ini adalah **Rp ${formatCurrency(currentBalance)}**.`,
        transactionData: null
      };
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Anda adalah asisten keuangan bernama Mora. Bantu pengguna mencatat transaksi dan berikan analisis keuangan. 
          Gunakan format markdown sederhana untuk penekanan teks:
          - **teks tebal** untuk poin penting
          - *teks miring* untuk penekanan halus
          - ` + '`kode`' + ` untuk nilai numerik atau istilah teknis
          Berikan respons yang jelas dan terstruktur.`
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 1024
    });

    const response = completion.choices[0]?.message?.content || "Maaf, saya tidak bisa memproses permintaan Anda.";

    // Parse transaction data
    let transactionData = null;
    const amountMatch = message.match(/Rp?\s?(\d+(?:\.\d+)?)/i) || 
                message.match(/(\d+(?:\.\d+)?)\s?rupiah/i) || 
                message.match(/(\d+(?:\.\d+)?)/i);
    const amount = amountMatch ? parseFloat(amountMatch[1].replace('.', '')) : 0;

    if (amount > 0) {
      const description = message.match(/untuk\s(.+)/i)?.[1] || 
                       message.match(/beli\s(.+)/i)?.[1] || 
                       'Transaksi';
      transactionData = {
        amount,
        description: description.length > 50 ? description.substring(0, 50) + '...' : description,
        type: message.includes('pemasukan') || message.includes('income') ? 'income' : 'expense',
        date: new Date().toISOString()
      };
    }

    return {
      reply: response,
      transactionData
    };

  } catch (error) {
    console.error('Groq AI Error:', error);
    return {
      reply: 'Maaf, terjadi kesalahan saat memproses permintaan Anda.'
    };
  }
};

// Save chat message to database
const saveChatMessage = async (chatData) => {
  try {
    const { data, error } = await supabase
      .from('chat_history')
      .insert({
        user_id: user.id,
        ...chatData
      })
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to save chat:', error);
    throw error;
  }
};

// Save transaction to database
const saveTransaction = async (transactionData) => {
  try {
    // Check for duplicate transactions
    const { data: similarTx, error: similarError } = await supabase
      .from('transactions')
      .select('*')
      .eq('amount', transactionData.amount)
      .eq('description', transactionData.description)
      .gte('created_at', new Date(Date.now() - 60000).toISOString())
      .limit(1);

    if (similarError) throw similarError;
    if (similarTx?.length > 0) {
      throw new Error('Transaksi serupa sudah tercatat');
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        ...transactionData
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to save transaction:', error);
    throw error;
  }
};

// Scroll to bottom of chat
const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainerRef.value) {
      chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight;
    }
  });
};

// Handle sending messages
const handleSendMessage = async (message) => {
  if (!message.trim()) return;
  
  try {
    // Add user message
    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    chatHistory.value.push(userMessage);
    scrollToBottom();
    
    // Show typing indicator
    isAiResponding.value = true;
    const typingMessage = {
      role: 'assistant',
      content: '',
      isTyping: true,
      timestamp: new Date().toISOString()
    };
    chatHistory.value.push(typingMessage);
    scrollToBottom();

    // Process with AI
    const aiResponse = await processWithGroqAI(message);
    
    // Save chat to database
    await saveChatMessage({
      user_message: message,
      ai_response: aiResponse.reply,
      is_transaction: !!aiResponse.transactionData
    });
    
    // Replace typing indicator with actual response
    const lastIndex = chatHistory.value.length - 1;
    chatHistory.value[lastIndex] = {
      role: 'assistant',
      content: aiResponse.reply,
      isTyping: false,
      timestamp: new Date().toISOString()
    };
    isAiResponding.value = false;
    scrollToBottom();

    // Show confirmation modal if transaction detected
    if (aiResponse.transactionData) {
      pendingTransaction.value = aiResponse.transactionData;
      modalMessage.value = aiResponse.transactionData.type === 'income' 
        ? 'Konfirmasi Pemasukan Baru' 
        : 'Konfirmasi Pengeluaran Baru';
      showConfirmModal.value = true;
    }
    
  } catch (error) {
    console.error('Error processing message:', error);
    // Remove typing indicator if error occurs
    chatHistory.value = chatHistory.value.filter(m => !m.isTyping);
    isAiResponding.value = false;
    
    chatHistory.value.push({
      role: 'system',
      content: '⚠️ Gagal memproses pesan. Silakan coba lagi.',
      timestamp: new Date().toISOString()
    });
    scrollToBottom();
  }
};

// Confirm and save transaction
const confirmSaveTransaction = async () => {
  try {
    isProcessing.value = true;
    const savedTx = await saveTransaction(pendingTransaction.value);
    console.log('Transaction saved:', savedTx);
    
    // Add notification to chat
    chatHistory.value.push({
      role: 'system',
      content: `✅ Transaksi ${pendingTransaction.value.type === 'income' ? 'pemasukan' : 'pengeluaran'} sebesar Rp ${formatCurrency(pendingTransaction.value.amount)} berhasil dicatat`,
      timestamp: new Date().toISOString()
    });
    scrollToBottom();
  } catch (error) {
    console.error('Failed to save transaction:', error);
    chatHistory.value.push({
      role: 'system',
      content: `⚠️ Gagal menyimpan transaksi: ${error.message}`,
      timestamp: new Date().toISOString()
    });
    scrollToBottom();
  } finally {
    isProcessing.value = false;
    showConfirmModal.value = false;
    pendingTransaction.value = null;
  }
};

// Load initial data
onMounted(async () => {
  await loadChatHistory();
});
</script>

<style scoped>
/* Chat container scrollbar */
.chat-container {
    max-height: calc(100vh - 300px); /* Tinggi maksimal satu layar, dikurangi header dan footer */
  overflow-y: auto; 
  scrollbar-width: thin;
  scrollbar-color: #3B82F6 #F3F4F6;
}

.chat-container::-webkit-scrollbar {
  width: 6px;
}

.chat-container::-webkit-scrollbar-track {
  background: #F3F4F6;
}

.chat-container::-webkit-scrollbar-thumb {
  background-color: #3B82F6;
  border-radius: 3px;
}

/* Typing indicator animation */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-5px);
    opacity: 1;
  }
}

.typing-indicator div {
  animation: bounce 1.4s infinite ease-in-out;
}

/* Message transitions */
.message-enter-active,
.message-leave-active {
  transition: all 0.3s ease;
}

.message-enter-from,
.message-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.message-move {
  transition: transform 0.3s ease;
}
</style>