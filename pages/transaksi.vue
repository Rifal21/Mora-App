<template>
  <div class="min-h-screen bg-gray-50 mt-16 mb-16 sm:mt-0 sm:mb-0">
    <Navbar />

    <div class="container mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-mora-biru mb-2">Daftar Transaksi</h1>
          <p class="text-gray-600">Kelola semua catatan transaksi keuangan Anda</p>
        </div>
        
        <!-- <button @click="addTransaction"
          class="mt-4 md:mt-0 flex items-center justify-center space-x-2 bg-mora-kuning hover:bg-yellow-500 text-mora-hitam font-medium py-2 px-4 rounded-lg transition-all shadow-sm hover:shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Tambah Transaksi</span>
        </button> -->
      </div>

      <!-- Filters Card -->
      <div class="bg-white rounded-xl shadow-sm p-5 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Type Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Jenis Transaksi</label>
            <select v-model="filterType"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mora-biru focus:border-mora-biru transition">
              <option value="all">Semua Jenis</option>
              <option value="income">Pemasukan</option>
              <option value="expense">Pengeluaran</option>
            </select>
          </div>

          <!-- Date Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
            <input type="date" v-model="filterDate"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mora-biru focus:border-mora-biru transition">
          </div>

          <!-- Search Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Cari</label>
            <div class="relative">
              <input v-model="searchQuery" type="text" placeholder="Cari transaksi..."
                class="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mora-biru focus:border-mora-biru transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Summary -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500">Total Pemasukan</p>
              <p class="text-2xl font-bold text-gray-800">Rp {{ formatCurrency(totalIncome) }}</p>
            </div>
            <div class="bg-green-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-5 border-l-4 border-red-500">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500">Total Pengeluaran</p>
              <p class="text-2xl font-bold text-gray-800">Rp {{ formatCurrency(totalExpense) }}</p>
            </div>
            <div class="bg-red-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-500">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500">Saldo</p>
              <p class="text-2xl font-bold text-gray-800">Rp {{ formatCurrency(totalBalance) }}</p>
            </div>
            <div class="bg-blue-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Transactions Table -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="transaction in filteredTransactions" :key="transaction.id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(transaction.date) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ transaction.description }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                    :class="transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm" 
                  :class="transaction.type === 'income' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'">
                  {{ transaction.type === 'income'  ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <!-- <button @click="editTransaction(transaction)" class="text-mora-biru hover:text-blue-700 mr-3">Edit</button> -->
                  <button @click="deleteTransaction(transaction.id)" class="text-red-600 hover:text-red-900"><IconTrash class="w-6 h-6" /></button>
                </td>
              </tr>
              <tr v-if="filteredTransactions.length === 0">
                <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
                  Tidak ada transaksi yang ditemukan
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Menampilkan <span class="font-medium">{{ currentPage * itemsPerPage }}</span> dari <span class="font-medium">{{ totalTransactions }}</span> transaksi
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button 
                  @click="prevPage" 
                  :disabled="currentPage === 0"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  :class="{ 'opacity-50 cursor-not-allowed': currentPage === 0 }"
                >
                  <span class="sr-only">Previous</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                <button 
                  v-for="page in totalPages" 
                  :key="page"
                  @click="goToPage(page - 1)"
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium"
                  :class="currentPage === page - 1 ? 'text-mora-biru bg-blue-50' : 'text-gray-700 hover:bg-gray-50'"
                >
                  {{ page }}
                </button>
                <button 
                  @click="nextPage" 
                  :disabled="currentPage === totalPages - 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages - 1 }"
                >
                  <span class="sr-only">Next</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconTrash } from '@tabler/icons-vue';
const transactions = ref([]);
const filterType = ref('all');
const filterDate = ref('');
const searchQuery = ref('');
const currentPage = ref(0);
const itemsPerPage = 10;

// Fetch transactions from Supabase
const fetchTransactions = async () => {
  const { data, error } = await useSupabaseClient()
    .from('transactions')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching transactions:', error);
    // You might want to show a toast/alert here
  } else {
    transactions.value = data;
  }
};

// Computed properties
const filteredTransactions = computed(() => {
  let result = [...transactions.value];

  // Filter by type
  if (filterType.value !== 'all') {
    result = result.filter(t => 
      filterType.value === 'income' ? t.type === 'income' : t.ype === 'expense'
    );
  }

  // Filter by date
  if (filterDate.value) {
    const selectedDate = new Date(filterDate.value).toISOString().split('T')[0];
    result = result.filter(t => t.date.split('T')[0] === selectedDate);
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(t => 
      t.description.toLowerCase().includes(query) || 
      (t.category && t.category.toLowerCase().includes(query))
    );
  }

  // Pagination
  const start = currentPage.value * itemsPerPage;
  return result.slice(start, start + itemsPerPage);
});

const totalIncome = computed(() => {
  return transactions.value
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
});

const totalExpense = computed(() => {
  return transactions.value
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
});

const totalBalance = computed(() => {
  return transactions.value.reduce((acc, tx) => {
        return tx.type === "income" ? acc + tx.amount : acc - tx.amount;
      }, 0);
});

const totalTransactions = computed(() => {
  return transactions.value.length;
});

const totalPages = computed(() => {
  return Math.ceil(transactions.value.length / itemsPerPage);
});

// Helper functions
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID').format(value);
};

const formatDate = (dateString) => {
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

// Pagination functions
const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
  }
};

const goToPage = (page) => {
  currentPage.value = page;
};

// Transaction actions
const addTransaction = () => {
  // Open add transaction modal
  console.log('Add transaction');
};

const editTransaction = (transaction) => {
  // Open edit transaction modal
  console.log('Edit transaction', transaction);
};

const deleteTransaction = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
    const { error } = await useSupabaseClient()
      .from('transactions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting transaction:', error);
      alert('Gagal menghapus transaksi');
    } else {
      fetchTransactions();
    }
  }
};

// Initial fetch
onMounted(async () => {
  await fetchTransactions();
    const supabase = useSupabaseClient();
  supabase
    .channel('transactions')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, payload => {
      console.log('Realtime update:', payload);

      // Fetch updated transactions
      fetchTransactions();
    })
    .subscribe();
});
</script>

<style scoped>
/* Custom scrollbar for table */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Smooth transitions */
tr {
  transition: background-color 0.2s ease;
}

/* Hover effects */
button:not(:disabled):hover {
  transform: translateY(-1px);
}
</style>