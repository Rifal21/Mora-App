<template>
  <div class="mt-16 mb-16 sm:mt-0 sm:mb-0">
    <Navbar />

    <div class="container mx-auto px-4 pt-3 pb-5">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content (Financial Summary) -->
        <div class="lg:col-span-2 order-2 lg:order-1">
          <FinancialSummary
            :currentBalance="currentBalance"
            :income="income"
            :expenses="expenses"
            :recentTransactions="recentTransactions"
            :formatCurrency="formatCurrency"
          />
        </div>
        <div
          class="fixed bottom-24 right-3.5 lg:relative lg:bottom-auto lg:right-auto w-full max-w-md lg:max-w-none lg:order-2 lg:col-span-1 transition-all duration-300 ease-in-out z-50"
          :class="{
            'opacity-0 invisible translate-y-4 lg:translate-y-0 lg:opacity-100 lg:visible':
              !isChatOpen,
            'opacity-100 visible translate-y-0': isChatOpen,
          }"
          style="max-height: 80vh; width: calc(100% - 2rem)"
        >
          <div
            class="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 lg:rounded-lg lg:shadow-md"
          >
            <!-- Chat Header -->
            <div
              class="bg-blue-600 text-white p-4 flex justify-between items-center"
            >
              <h2 class="text-lg font-bold flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                Mora AI
              </h2>
              <div class="flex items-center space-x-2">
                <!-- Button to navigate to Chat Page -->
                <button
                  @click="$router.push('/chat')"
                  class="bg-white text-blue-600 text-bold px-3 py-1 rounded-lg shadow hover:bg-gray-100 transition cursor-pointer"
                  aria-label="Go to Chat Page"
                >
                  <IconHistory class="w-6 h-6" />
                </button>
                <!-- Button to toggle chat visibility -->
                <button
                  @click="isChatOpen = !isChatOpen"
                  class="lg:hidden text-white hover:text-blue-200 hover:bg-red-500 rounded-lg p-1 transition"
                  aria-label="Close Chat"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Chat Messages -->
            <div
              class="chat-container h-96 overflow-y-auto p-4 bg-gray-50"
              ref="chatContainerRef"
            >
              <div
                v-for="(message, index) in chatHistory"
                :key="index"
                class="mb-3 transition-all duration-200"
              >
                <!-- User Message -->
                <div v-if="message.role === 'user'" class="flex justify-end">
                  <div
                    class="max-w-xs lg:max-w-md bg-blue-600 text-white rounded-xl rounded-tr-none px-4 py-2 shadow-sm"
                  >
                    <div v-html="formatMessage(message.content)"></div>
                  </div>
                </div>

                <!-- System Message -->
                <div
                  v-else-if="message.role === 'system'"
                  class="flex justify-center"
                >
                  <div
                    class="max-w-md bg-gray-200 text-gray-800 rounded-lg px-3 py-2 text-sm text-center"
                  >
                    <div v-html="formatMessage(message.content)"></div>
                  </div>
                </div>

                <!-- AI Message -->
                <div v-else class="flex justify-start">
                  <div
                    class="max-w-xs lg:max-w-md bg-white border border-gray-200 rounded-xl rounded-tl-none px-4 py-2 shadow-sm"
                  >
                    <div v-html="formatMessage(message.content)"></div>
                    <div
                      v-if="message.isTyping"
                      class="typing-indicator flex space-x-1 mt-1"
                    >
                      <div
                        class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style="animation-delay: 0ms"
                      ></div>
                      <div
                        class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style="animation-delay: 150ms"
                      ></div>
                      <div
                        class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style="animation-delay: 300ms"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Chat Input -->
            <div class="border-t border-gray-200 p-3 bg-white">
              <ChatInput @send-message="handleSendMessage" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Konfirmasi -->
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
import { ref, onMounted, nextTick } from "vue";
import Groq from "groq-sdk";
import { IconHistory } from "@tabler/icons-vue";
import { useChatStore } from "~/stores/chat";
import { storeToRefs } from "pinia";

const supabase = useSupabaseClient();
const {
  data: { user },
} = await supabase.auth.getUser();
const chatHistory = ref([]);
const chatContainerRef = ref(null);
const currentBalance = ref(0);
const income = ref(0);
const expenses = ref(0);
const recentTransactions = ref([]);
const showConfirmModal = ref(false);
const pendingTransaction = ref(null);
const modalMessage = ref("");
const isProcessing = ref(false);
const showChat = ref(false); // Controls chat visibility on mobile
const groq = new Groq({
  apiKey: useRuntimeConfig().public.groqApiKey,
  dangerouslyAllowBrowser: true,
});

const chatStore = useChatStore();
const { isChatOpen } = storeToRefs(chatStore);

// Format message content with HTML tags
const formatMessage = (content) => {
  if (!content) return "";

  // Handle bold (**text**)
  let formatted = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Handle italic (*text* or _text_)
  formatted = formatted.replace(/\*(.*?)\*|_(.*?)_/g, "<em>$1$2</em>");

  // Handle code blocks (`code`)
  formatted = formatted.replace(
    /`(.*?)`/g,
    '<code class="bg-gray-100 px-1 py-0.5 rounded">$1</code>'
  );

  // Handle line breaks
  formatted = formatted.replace(/\n/g, "<br>");

  return formatted;
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID").format(value);
};

// Process message with Groq AI
const processWithGroqAI = async (message) => {
  try {
    const querySaldo = [
      "saldo sekarang",
      "berapa saldo saya",
      "berapa saldo saya sekarang",
      "berapa saldo saya saat ini",
      "tampilkan saldo saya",
      "tampilkan saldo saya sekarang",
      "hitung saldo saya",
      "cek saldo",
      "saldo saya",
    ];

    // Cek apakah pesan pengguna cocok dengan salah satu kata kunci saldo
    const isSaldoQuery = querySaldo.some((keyword) =>
      message.toLowerCase().includes(keyword.toLowerCase())
    );

    if (isSaldoQuery) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Ambil data transaksi dari database
      const { data: transactions, error } = await supabase
        .from("transactions")
        .select("amount, type")
        .eq("user_id", user.id);

      if (error) throw error;

      // Hitung saldo saat ini
      const currentBalance = transactions.reduce((acc, tx) => {
        return tx.type === "income" ? acc + tx.amount : acc - tx.amount;
      }, 0);

      return {
        reply: `Saldo Anda saat ini adalah Rp ${formatCurrency(
          currentBalance
        )}.`,
        transactionData: null, // Tidak ada transaksi baru
      };
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Anda adalah asisten keuangan bernama Mora. Ketika pengguna menyebutkan transaksi, WAJIB respons dengan format TEPAT berikut:
Jumlah: [angka] (contoh: 500000)
Jenis: [pemasukan/pengeluaran]
Kategori: [nama kategori]
Deskripsi: [deskripsi transaksi]

Gunakan format di atas secara konsisten tanpa tanda bintang atau backtick.
kemudian setelah format tersebut, tampilkan rekomendasi dan saran pengelolaan uang. jika pengguna tidak melakukan transaksi dan hanya meminta saran atau pendapat, jangan tampilkan format itu.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 1024,
    });

    const response =
      completion.choices[0]?.message?.content ||
      "Maaf, saya tidak bisa memproses permintaan Anda.";
    console.log("Raw AI Response:", response);

    // Parse transaction data dengan regex yang lebih sederhana
    let transactionData = null;

    // 1. Ekstrak jumlah (format: Jumlah: 5000000)
    const amountMatch = response.match(/Jumlah:\s*(\d+)/i);
    const amount = amountMatch ? parseInt(amountMatch[1]) : 0;
    console.log("Extracted amount:", amount);

    // 2. Ekstrak jenis transaksi
    const typeMatch = response.match(/Jenis:\s*(pemasukan|pengeluaran)/i);
    const type = typeMatch
      ? typeMatch[1].toLowerCase()
      : message.toLowerCase().includes("pemasukan")
      ? "income"
      : "expense";

    // 3. Ekstrak kategori
    const categoryMatch = response.match(/Kategori:\s*(.+)/i);
    const category = categoryMatch ? categoryMatch[1].trim() : "Lainnya";

    // 4. Ekstrak deskripsi
    const descriptionMatch = response.match(/Deskripsi:\s*(.+)/i);
    const description = descriptionMatch
      ? descriptionMatch[1].trim()
      : message.match(/untuk\s(.+)/i)?.[1] ||
        message.match(/beli\s(.+)/i)?.[1] ||
        "Transaksi";

    if (amount > 0) {
      transactionData = {
        amount,
        description:
          description.length > 50
            ? description.substring(0, 50) + "..."
            : description,
        category:
          category.length > 50 ? category.substring(0, 50) + "..." : category,
        type: type === "pemasukan" ? "income" : "expense",
        date: new Date().toISOString(),
      };
      console.log("Transaction Data:", transactionData);
    } else {
      console.log("No valid transaction data extracted");
    }

    return {
      reply: response,
      transactionData,
    };
  } catch (error) {
    console.error("Groq AI Error:", error);
    return {
      reply: "Maaf, terjadi kesalahan saat memproses permintaan Anda.",
    };
  }
};

// Save chat message
const saveChatMessage = async (chatData) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("chat_history")
      .insert({
        user_id: user.id,
        ...chatData,
      })
      .select();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Failed to save chat:", error);
    throw error;
  }
};

// Save transaction
const saveTransaction = async (transactionData) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  // Check for similar recent transactions
  const similarTx = await supabase
    .from("transactions")
    .select("*")
    .eq("amount", transactionData.amount)
    .eq("description", transactionData.description)
    .gte("created_at", new Date(Date.now() - 60000).toISOString())
    .limit(1);

  if (similarTx.data?.length > 0) {
    throw new Error("Transaksi serupa sudah tercatat");
  }

  const { data, error } = await supabase
    .from("transactions")
    .insert({
      user_id: user.id,
      ...transactionData,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Scroll to latest chat
const scrollToLatestChat = () => {
  nextTick(() => {
    if (chatContainerRef.value) {
      chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight;
    }
  });
};

// Handle sending message with typing indicator
const handleSendMessage = async (message) => {
  try {
    // Add user message
    const userMessage = {
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };
    chatHistory.value.push(userMessage);

    // Show chat on mobile if not visible
    if (!showChat.value) {
      showChat.value = true;
    }

    scrollToLatestChat();

    // Add typing indicator
    const typingMessage = {
      role: "assistant",
      content: "",
      isTyping: true,
      timestamp: new Date().toISOString(),
    };
    chatHistory.value.push(typingMessage);
    scrollToLatestChat();

    // Process with AI
    const aiResponse = await processWithGroqAI(message);

    // Save chat to database
    await saveChatMessage({
      user_message: message,
      ai_response: aiResponse.reply,
      is_transaction: !!aiResponse.transactionData,
    });

    // Replace typing indicator with actual response
    const lastIndex = chatHistory.value.length - 1;
    chatHistory.value[lastIndex] = {
      role: "assistant",
      content: aiResponse.reply,
      isTyping: false,
      timestamp: new Date().toISOString(),
    };

    scrollToLatestChat();

    // Show confirmation modal if transaction detected
    if (aiResponse.transactionData) {
      // Format transaction data for display
      const formattedTransaction = {
        ...aiResponse.transactionData,
        formattedAmount: formatCurrency(aiResponse.transactionData.amount),
      };

      pendingTransaction.value = formattedTransaction;
      modalMessage.value =
        aiResponse.transactionData.type === "income"
          ? "Konfirmasi Pemasukan Baru"
          : "Konfirmasi Pengeluaran Baru";
      showConfirmModal.value = true;

      // Add confirmation message to chat
      chatHistory.value.push({
        role: "system",
        content: `Silakan konfirmasi ${
          aiResponse.transactionData.type === "income"
            ? "pemasukan"
            : "pengeluaran"
        } sebesar Rp ${formattedTransaction.formattedAmount} untuk ${
          aiResponse.transactionData.description
        }`,
        timestamp: new Date().toISOString(),
      });
      scrollToLatestChat();
    }
  } catch (error) {
    console.error("Error processing message:", error);
    // Remove typing indicator if error occurs
    chatHistory.value = chatHistory.value.filter((m) => !m.isTyping);

    chatHistory.value.push({
      role: "system",
      content: "⚠️ Gagal memproses pesan. Silakan coba lagi.",
      timestamp: new Date().toISOString(),
    });
    scrollToLatestChat();
  }
};

const confirmSaveTransaction = async () => {
  try {
    isProcessing.value = true;

    // Pastikan kita menggunakan data mentah (tanpa formattedAmount) untuk disimpan
    const txToSave = {
      ...pendingTransaction.value,
      formattedAmount: undefined, // Hapus properti yang tidak diperlukan
    };

    const savedTx = await saveTransaction(txToSave);
    console.log("Transaction saved:", savedTx);

    await updateFinancialSummary();

    // Add notification to chat
    chatHistory.value.push({
      role: "system",
      content: `✅ Transaksi ${
        pendingTransaction.value.type === "income" ? "pemasukan" : "pengeluaran"
      } sebesar Rp ${pendingTransaction.value.formattedAmount} untuk "${
        pendingTransaction.value.description
      }" berhasil dicatat`,
      timestamp: new Date().toISOString(),
    });

    scrollToLatestChat();
  } catch (error) {
    console.error("Failed to save transaction:", error);
    chatHistory.value.push({
      role: "system",
      content: `⚠️ Gagal menyimpan transaksi: ${error.message}`,
      timestamp: new Date().toISOString(),
    });
    scrollToLatestChat();
  } finally {
    isProcessing.value = false;
    showConfirmModal.value = false;
    pendingTransaction.value = null;
  }
};

// Update financial summary
const updateFinancialSummary = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: transactions } = await supabase
      .from("transactions")
      .select("amount, type")
      .eq("user_id", user.id);

    const calculated = transactions.reduce(
      (acc, tx) => {
        if (tx.type === "income") {
          acc.balance += tx.amount;
          acc.income += tx.amount;
        } else {
          acc.balance -= tx.amount;
          acc.expenses += tx.amount;
        }
        return acc;
      },
      { balance: 0, income: 0, expenses: 0 }
    );

    currentBalance.value = calculated.balance;
    income.value = calculated.income;
    expenses.value = calculated.expenses;

    const { data: recent } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    recentTransactions.value = recent || [];
  } catch (error) {
    console.error("Failed to update summary:", error);
  }
  
};

// Load initial data
onMounted(async () => {
  const { data: authListener } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (event === "SIGNED_IN") {
        updateFinancialSummary();
      }
    }
  );

  if (user) {
    await updateFinancialSummary();
  }

  // Load chat history
  const { data: chatData } = await supabase
    .from("chat_history")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: true });

  if (chatData) {
    chatHistory.value = chatData.flatMap((chat) => [
      { role: "user", content: chat.user_message },
      { role: "assistant", content: chat.ai_response },
    ]);
  }

  // On desktop, show chat by default
  if (window.innerWidth >= 1024) {
    showChat.value = true;
  }

  scrollToLatestChat();

   // Realtime listener for transactions
  supabase
    .channel('transactions')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, payload => {
      console.log('Realtime update:', payload);

      // Update financial summary when transactions change
      updateFinancialSummary();
    })
    .subscribe();
});
</script>

<style scoped>
.chat-container {
  scrollbar-width: thin;
  scrollbar-color: #3b82f6 #f3f4f6;
}

.chat-container::-webkit-scrollbar {
  width: 6px;
}

.chat-container::-webkit-scrollbar-track {
  background: #f3f4f6;
}

.chat-container::-webkit-scrollbar-thumb {
  background-color: #3b82f6;
  border-radius: 3px;
}

/* Typing indicator animation */
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.typing-indicator div {
  animation: bounce 1s infinite ease-in-out;
}

/* Smooth transitions for chat */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Message animations */
.chat-message {
  transition: all 0.3s ease;
}

.chat-message-enter-active {
  transition: all 0.3s ease;
}

.chat-message-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

/* Responsive adjustments */
@media (max-width: 1023px) {
  .chat-container {
    max-height: 60vh;
  }
}
</style>
