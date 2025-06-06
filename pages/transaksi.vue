<template>
    <div>
        <Navbar />

        <div class="container mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold text-mora-biru mb-6">Daftar Transaksi</h1>

            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <h2 class="text-xl font-semibold text-mora-hitam">Semua Transaksi</h2>

                    <div class="mt-4 md:mt-0 flex space-x-2">
                        <select v-model="filterType"
                            class="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mora-kuning">
                            <option value="all">Semua Jenis</option>
                            <option value="income">Pemasukan</option>
                            <option value="expense">Pengeluaran</option>
                        </select>

                        <input type="date" v-model="filterDate"
                            class="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mora-kuning" />

                        <button @click="addTransaction"
                            class="bg-mora-kuning text-mora-hitam p-2 rounded-lg hover:bg-yellow-500 transition">
                            + Tambah
                        </button>
                    </div>
                </div>

                <TransactionList :transactions="filteredTransactions" @refresh="fetchTransactions" />
            </div>
        </div>
    </div>
</template>

<script setup>
const transactions = ref([]);
const filterType = ref('all');
const filterDate = ref('');

const filteredTransactions = computed(() => {
    let result = [...transactions.value];

    if (filterType.value !== 'all') {
        result = result.filter(t =>
            filterType.value === 'income' ? t.amount > 0 : t.amount < 0
        );
    }

    if (filterDate.value) {
        const selectedDate = new Date(filterDate.value).toISOString().split('T')[0];
        result = result.filter(t => t.date.split('T')[0] === selectedDate);
    }

    return result;
});

const fetchTransactions = async () => {
    const { data, error } = await useSupabaseClient()
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

    if (error) console.error('Error fetching transactions:', error);
    else transactions.value = data;
};

const addTransaction = () => {
    // Implementasi modal/tambah transaksi
    console.log('Tambah transaksi baru');
};

onMounted(async () => {
    await fetchTransactions();
});
</script>