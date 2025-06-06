<template>
    <div>
        <Navbar />

        <div class="container mx-auto px-4 py-8">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Panel Chat -->
                <div class="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-2xl font-bold text-blue-600 mb-4">Chat Mora</h2>

<div class="chat-container max-h-[500px] overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg" ref="chatContainerRef">
  <div 
    v-for="(message, index) in chatHistory" 
    :key="index"
    :class="`mb-3 p-3 rounded-lg chat-message ${
      message.role === 'user' 
        ? 'bg-yellow-500 text-black ml-auto max-w-xs' 
        : message.role === 'system'
          ? 'bg-gray-200 text-gray-800 mx-auto max-w-md text-sm'
          : 'bg-blue-600 text-white mr-auto max-w-xs'
    }`"
  >
    {{ message.content }}
  </div>
</div>

                    <ChatInput @send-message="handleSendMessage" />
                </div>

                <!-- Ringkasan Keuangan -->
<div class="bg-white rounded-lg shadow-md p-6">
  <h2 class="text-2xl font-bold text-blue-800 mb-4 flex items-center">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    Ringkasan Keuangan
  </h2>

  <div class="space-y-4">
    <div class="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
      <p class="text-gray-600 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        Saldo Bulan Ini
      </p>
      <p class="text-2xl font-bold text-gray-900">Rp {{ formatCurrency(currentBalance) }}</p>
    </div>

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
            <p class="text-xs text-gray-500">{{ new Date(transaction.date).toLocaleDateString('id-ID') }}</p>
          </div>
          <p :class="`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`">
            {{ transaction.type === 'income' ? '+' : '-' }}Rp {{ formatCurrency(transaction.amount) }}
          </p>
        </div>
      </div>
      <p v-else class="text-gray-500 text-sm">Belum ada transaksi</p>
    </div>
  </div>
</div>
            </div>
        </div>
        <!-- Modal Konfirmasi -->
<Transition name="fade">
  <div v-if="showConfirmModal" class="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
      <h3 class="text-xl font-bold text-gray-800 mb-4">{{ modalMessage }}</h3>
      
      <div v-if="pendingTransaction" class="space-y-3 mb-6">
        <div class="flex justify-between">
          <span class="text-gray-600">Jumlah:</span>
          <span :class="`font-semibold ${pendingTransaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`">
            {{ pendingTransaction.type === 'income' ? '+' : '-' }}Rp {{ formatCurrency(pendingTransaction.amount) }}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Keterangan:</span>
          <span class="font-medium">{{ pendingTransaction.description }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Jenis:</span>
          <span class="capitalize">{{ pendingTransaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran' }}</span>
        </div>
      </div>

      <div class="flex justify-end space-x-3">
        <button 
          @click="showConfirmModal = false"
          class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          :disabled="isProcessing"
        >
          Batal
        </button>
        <button 
          @click="confirmSaveTransaction"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
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
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Groq from 'groq-sdk'

const supabase = useSupabaseClient()
const { data: { user } } = await supabase.auth.getUser()
const chatHistory = ref([])
const chatContainerRef = ref(null); 
const currentBalance = ref(0)
const income = ref(0)
const expenses = ref(0)
const recentTransactions = ref([])
const showConfirmModal = ref(false)
const pendingTransaction = ref(null)
const modalMessage = ref('')
const isProcessing = ref(false)
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})

const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID').format(value)
}

// Fungsi untuk memproses pesan dengan Groq AI
const processWithGroqAI = async (message) => {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Anda adalah asisten keuangan bernama Mora. Bantu pengguna mencatat transaksi dan berikan analisis keuangan."
                },
                {
                    role: "user",
                    content: message
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
            max_tokens: 1024
        })

        const response = completion.choices[0]?.message?.content || "Maaf, saya tidak bisa memproses permintaan Anda."

        // Logika parsing transaksi
        let transactionData = null
        const amountMatch = message.match(/Rp?\s?(\d+(?:\.\d+)?)/i) || 
                    message.match(/(\d+(?:\.\d+)?)\s?rupiah/i) || 
                    message.match(/(\d+(?:\.\d+)?)/i)
        const amount = amountMatch ? parseFloat(amountMatch[1].replace('.', '')) : 0

        if (amount > 0) {
            const description = message.match(/untuk\s(.+)/i)?.[1] || 'Transaksi'
            transactionData = {
                amount,
                description,
                type: message.includes('pemasukan') ? 'income' : 'expense',
                date: new Date().toISOString()
            }
        }

        return {
            reply: response,
            transactionData
        }

    } catch (error) {
        console.error('Groq AI Error:', error)
        return {
            reply: 'Maaf, terjadi kesalahan saat memproses permintaan Anda.'
        }
    }
}

// Fungsi untuk menyimpan chat (diperbarui)
const saveChatMessage = async (chatData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('User not authenticated')
    
    const { data, error } = await supabase
      .from('chat_history')
      .insert({
        user_id: user.id,
        ...chatData
      })
      .select()
      
    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Failed to save chat:', error)
    throw error
  }
}

// Fungsi untuk menyimpan transaksi (diperbarui)
const saveTransaction = async (transactionData) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Tambahkan pengecekan duplikasi sederhana
  const similarTx = await supabase
    .from('transactions')
    .select('*')
    .eq('amount', transactionData.amount)
    .eq('description', transactionData.description)
    .gte('created_at', new Date(Date.now() - 60000).toISOString()) // Cek 1 menit terakhir
    .limit(1);

  if (similarTx.data?.length > 0) {
    throw new Error('Transaksi serupa sudah tercatat');
  }

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: user.id,
      ...transactionData
    })
    .select() // Penting untuk mendapatkan data yang baru disimpan
    .single();

  if (error) throw error;
  return data;
};

// Fungsi untuk auto-scroll ke chat terbaru
const scrollToLatestChat = () => {
    nextTick(() => {
        if (chatContainerRef.value) {
            chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight;
        }
    });
};

// Update handleSendMessage
const handleSendMessage = async (message) => {
  try {
    // 1. Tambahkan pesan user ke UI
    const userMessage = { 
      role: 'user', 
      content: message,
      timestamp: new Date().toISOString() 
    }
    chatHistory.value.push(userMessage)

    // 2. Proses dengan AI
    const aiResponse = await processWithGroqAI(message)
    
    // 3. Simpan chat ke database
    await saveChatMessage({
      user_message: message,
      ai_response: aiResponse.reply,
      is_transaction: !!aiResponse.transactionData
    })
    
    // 4. Tambahkan respon AI ke UI
    chatHistory.value.push({
      role: 'assistant',
      content: aiResponse.reply,
      timestamp: new Date().toISOString()
    })

    scrollToLatestChat();

    // 5. Jika ada transaksi, tampilkan modal konfirmasi
    if (aiResponse.transactionData) {
      pendingTransaction.value = aiResponse.transactionData
      modalMessage.value = aiResponse.transactionData.type === 'income' 
        ? 'Konfirmasi Pemasukan Baru' 
        : 'Konfirmasi Pengeluaran Baru'
      showConfirmModal.value = true
    }
    
  } catch (error) {
    console.error('Error processing message:', error)
    chatHistory.value.push({
      role: 'system',
      content: '⚠️ Gagal memproses pesan. Silakan coba lagi.',
      timestamp: new Date().toISOString()
    })
    scrollToLatestChat();
  }
}

const confirmSaveTransaction = async () => {
  try {
    isProcessing.value = true
    
    console.log('Attempting to save transaction:', pendingTransaction.value)
    const savedTx = await saveTransaction(pendingTransaction.value)
    console.log('Transaction saved:', savedTx)
    
    await updateFinancialSummary()
    
    // Tambahkan notifikasi ke chat
    chatHistory.value.push({
      role: 'system',
      content: `✅ Transaksi ${pendingTransaction.value.type === 'income' ? 'pemasukan' : 'pengeluaran'} sebesar Rp ${formatCurrency(pendingTransaction.value.amount)} berhasil dicatat`,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Failed to save transaction:', error)
    chatHistory.value.push({
      role: 'system',
      content: `⚠️ Gagal menyimpan transaksi: ${error.message}`,
      timestamp: new Date().toISOString()
    })
  } finally {
    isProcessing.value = false
    showConfirmModal.value = false
    pendingTransaction.value = null
  }
}

// Fungsi untuk memperbarui ringkasan keuangan
const updateFinancialSummary = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Gunakan transaksi untuk menghitung saldo secara real-time
    const { data: transactions } = await supabase
      .from('transactions')
      .select('amount, type')
      .eq('user_id', user.id);

    const calculated = transactions.reduce((acc, tx) => {
      if (tx.type === 'income') {
        acc.balance += tx.amount;
        acc.income += tx.amount;
      } else {
        acc.balance -= tx.amount;
        acc.expenses += tx.amount;
      }
      return acc;
    }, { balance: 0, income: 0, expenses: 0 });

    currentBalance.value = calculated.balance;
    income.value = calculated.income;
    expenses.value = calculated.expenses;

    // Ambil 5 transaksi terakhir untuk ditampilkan
    const { data: recent } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    recentTransactions.value = recent || [];
    
  } catch (error) {
    console.error('Failed to update summary:', error);
  }
};

// Muat riwayat chat saat komponen dimuat
onMounted(async () => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
            updateFinancialSummary()
        }
    })

    // Panggil pertama kali jika sudah login
    if (user) {
        await updateFinancialSummary()
    }

    // Jangan lupa unsubscribe saat komponen di-unmount
    onBeforeUnmount(() => {
        authListener?.unsubscribe()
    })

    // Muat riwayat chat dari database
    const { data: chatData } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true })

    if (chatData) {
        chatHistory.value = chatData.flatMap(chat => [
            { role: 'user', content: chat.user_message },
            { role: 'assistant', content: chat.ai_response }
        ])
    }

    scrollToLatestChat();
})
</script>
<style scoped>
.chat-container {
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Animasi untuk pesan chat */
.chat-message {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>