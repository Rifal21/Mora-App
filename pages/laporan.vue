<template>
  <div>
    <Navbar />

    <div class="container mx-auto px-4 py-8">
      <!-- Header dengan breadcrumb -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <nav class="flex mb-2" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 md:space-x-2">
              <li class="inline-flex items-center">
                <NuxtLink to="/" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                  <svg class="w-3 h-3 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                  </svg>
                  Dashboard
                </NuxtLink>
              </li>
              <li aria-current="page">
                <div class="flex items-center">
                  <svg class="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                  </svg>
                  <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2">Laporan Keuangan</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 class="text-3xl font-bold text-mora-biru flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Laporan Keuangan
          </h1>
        </div>
        <div class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          <span class="font-medium">Terakhir diperbarui:</span> {{ new Date().toLocaleString('id-ID') }}
        </div>
      </div>

      <!-- Card Filter Laporan -->
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 class="text-xl font-semibold text-gray-800">Buat Laporan</h2>
            <p class="text-sm text-gray-600">Pilih periode laporan yang diinginkan</p>
          </div>

          <div class="flex flex-col md:flex-row gap-3">
            <div class="flex gap-2">
              <select v-model="reportType" class="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mora-kuning focus:border-mora-kuning text-sm">
                <option value="monthly">Bulanan</option>
                <option value="yearly">Tahunan</option>
                <option value="custom">Kustom</option>
              </select>

              <select v-if="reportType !== 'custom'" v-model="selectedPeriod" class="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mora-kuning focus:border-mora-kuning text-sm">
                <option v-for="period in availablePeriods" :key="period.value" :value="period.value">
                  {{ period.label }}
                </option>
              </select>
            </div>

            <div v-if="reportType === 'custom'" class="flex gap-2">
              <input type="date" v-model="startDate" class="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mora-kuning focus:border-mora-kuning text-sm">
              <input type="date" v-model="endDate" class="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mora-kuning focus:border-mora-kuning text-sm">
            </div>

            <button @click="generateReport" class="px-4 py-2 bg-mora-biru text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Buat Laporan
            </button>
          </div>
        </div>
      </div>

      <!-- Hasil Laporan -->
      <div v-if="reportData" class="space-y-6">
        <!-- Ringkasan Statistik -->
        <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            Ringkasan {{ reportType === 'monthly' ? 'Bulanan' : reportType === 'yearly' ? 'Tahunan' : 'Kustom' }}
            <span class="text-mora-biru">{{ reportPeriodLabel }}</span>
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 p-4 rounded-lg">
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-sm text-gray-600">Total Pemasukan</p>
                  <p class="text-2xl font-bold text-green-700 mt-1">Rp {{ formatCurrency(reportData.totalIncome) }}</p>
                </div>
                <span class="bg-green-200 text-green-800 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </span>
              </div>
            </div>

            <div class="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 p-4 rounded-lg">
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-sm text-gray-600">Total Pengeluaran</p>
                  <p class="text-2xl font-bold text-red-700 mt-1">Rp {{ formatCurrency(reportData.totalExpenses) }}</p>
                </div>
                <span class="bg-red-200 text-red-800 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                </span>
              </div>
            </div>

            <div class="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 p-4 rounded-lg">
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-sm text-gray-600">Saldo Bersih</p>
                  <p class="text-2xl font-bold text-blue-700 mt-1">Rp {{ formatCurrency(reportData.netBalance) }}</p>
                </div>
                <span class="bg-blue-200 text-blue-800 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Grafik Laporan -->
        <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-800">Grafik {{ reportType === 'monthly' ? 'Bulanan' : reportType === 'yearly' ? 'Tahunan' : 'Kustom' }}</h3>
            <select v-model="chartType" class="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-mora-kuning">
              <option value="bar">Batang</option>
              <option value="line">Garis</option>
            </select>
          </div>
          <div class="h-64">
            <ReportChart 
              :type="chartType" 
              :data="reportData.chartData" 
              :key="`${reportType}-${selectedPeriod}`"
            />
          </div>
        </div>

        <!-- Daftar Transaksi -->
        <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-800">Detail Transaksi</h3>
            <div class="text-sm text-gray-500">
              Total: {{ reportData.transactions.length }} transaksi
            </div>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="transaction in reportData.transactions" :key="transaction.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ new Date(transaction.date).toLocaleDateString('id-ID') }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ transaction.description }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span :class="`px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`">
                      {{ transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" 
                    :class="transaction.amount > 0 ? 'text-green-600' : 'text-red-600'">
                    {{ transaction.amount > 0 ? '+' : '' }}Rp {{ formatCurrency(transaction.amount) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-4 flex justify-between items-center">
            <div class="text-sm text-gray-500">
              Menampilkan {{ Math.min(reportData.transactions.length, 10) }} dari {{ reportData.transactions.length }} transaksi
            </div>
            <div class="flex space-x-2">
              <button @click="downloadPDF" class="px-4 py-2 bg-mora-biru text-white rounded-lg hover:bg-blue-700 transition flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Unduh PDF
              </button>
              <button @click="downloadExcel" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Unduh Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Belum ada laporan</h3>
        <p class="mt-1 text-sm text-gray-500">Pilih periode dan klik "Buat Laporan" untuk melihat laporan keuangan Anda.</p>
        <div class="mt-6">
          <button @click="generateSampleReport" class="px-4 py-2 bg-mora-biru text-white rounded-lg hover:bg-blue-700 transition inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Coba Laporan Contoh
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSupabaseClient } from '#imports'

const supabase = useSupabaseClient()
const reportType = ref('monthly')
const selectedPeriod = ref('')
const startDate = ref('')
const endDate = ref('')
const reportData = ref(null)
const chartType = ref('bar')
const isLoading = ref(false)

// Data periode yang tersedia
const availablePeriods = computed(() => {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1
  
  if (reportType.value === 'monthly') {
    // Generate 12 bulan terakhir
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      return {
        value: `${year}-${month.toString().padStart(2, '0')}`,
        label: `${getMonthName(month)} ${year}`
      }
    }).reverse()
  } else {
    // Generate 5 tahun terakhir
    return Array.from({ length: 5 }, (_, i) => ({
      value: (currentYear - i).toString(),
      label: (currentYear - i).toString()
    })).reverse()
  }
})

// Label periode laporan
const reportPeriodLabel = computed(() => {
  if (!reportData.value) return ''
  
  if (reportType.value === 'custom') {
    return `dari ${formatDate(reportData.value.startDate)} sampai ${formatDate(reportData.value.endDate)}`
  }
  
  if (reportType.value === 'monthly') {
    const [year, month] = selectedPeriod.value.split('-')
    return `${getMonthName(parseInt(month))} ${year}`
  }
  
  return `Tahun ${selectedPeriod.value}`
})

// Format mata uang
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID').format(value)
}

// Format tanggal
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Nama bulan
const getMonthName = (month) => {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]
  return months[month - 1]
}

// Generate laporan
const generateReport = async () => {
  try {
    isLoading.value = true
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    let start, end
    
    // Tentukan rentang tanggal berdasarkan jenis laporan
    if (reportType.value === 'monthly') {
      const [year, month] = selectedPeriod.value.split('-')
      start = new Date(year, month - 1, 1)
      end = new Date(year, month, 0) // Hari terakhir bulan tersebut
    } else if (reportType.value === 'yearly') {
      start = new Date(selectedPeriod.value, 0, 1)
      end = new Date(selectedPeriod.value, 11, 31)
    } else {
      start = new Date(startDate.value)
      end = new Date(endDate.value)
    }

    // Validasi tanggal
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Periode tanggal tidak valid')
    }

    // Ambil data transaksi dari Supabase
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', start.toISOString())
      .lte('date', end.toISOString())
      .order('date', { ascending: false })

    if (error) throw error

    // Hitung total pemasukan dan pengeluaran
    const summary = transactions.reduce((acc, tx) => {
      if (tx.type === 'income') {
        acc.totalIncome += tx.amount
      } else {
        acc.totalExpenses += tx.amount
      }
      return acc
    }, { totalIncome: 0, totalExpenses: 0 })

    // Siapkan data untuk chart
    const chartData = prepareChartData(transactions, start, end)

    // Format data laporan
    reportData.value = {
      ...summary,
      netBalance: summary.totalIncome - summary.totalExpenses,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      transactions: transactions,
      chartData: chartData
    }

  } catch (error) {
    console.error('Error generating report:', error)
    alert(`Gagal membuat laporan: ${error.message}`)
  } finally {
    isLoading.value = false
  }
}

// Siapkan data untuk chart
const prepareChartData = (transactions, startDate, endDate) => {
  const isMonthly = reportType.value === 'monthly'
  const daysInPeriod = isMonthly 
    ? new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate()
    : 12 // Untuk tahunan, 12 bulan
  
  const labels = []
  const incomeData = Array(daysInPeriod).fill(0)
  const expenseData = Array(daysInPeriod).fill(0)

  // Generate labels
  for (let i = 0; i < daysInPeriod; i++) {
    if (isMonthly) {
      labels.push(`${i + 1}`)
    } else {
      labels.push(getMonthName(i + 1))
    }
  }

  // Isi data
  transactions.forEach(tx => {
    const date = new Date(tx.date)
    const index = isMonthly 
      ? date.getDate() - 1 
      : date.getMonth()
    
    if (tx.type === 'income') {
      incomeData[index] += tx.amount
    } else {
      expenseData[index] += tx.amount
    }
  })

  return {
    labels,
    income: incomeData,
    expenses: expenseData
  }
}

// Generate laporan contoh
const generateSampleReport = () => {
  reportData.value = {
    totalIncome: 7500000,
    totalExpenses: 4800000,
    netBalance: 2700000,
    startDate: '2023-06-01',
    endDate: '2023-06-30',
    transactions: [
      { id: 1, description: 'Gaji Bulanan', amount: 7500000, type: 'income', date: '2023-06-01T00:00:00' },
      { id: 2, description: 'Belanja Bulanan', amount: -1500000, type: 'expense', date: '2023-06-05T00:00:00' },
      { id: 3, description: 'Bayar Listrik', amount: -500000, type: 'expense', date: '2023-06-10T00:00:00' },
      { id: 4, description: 'Makan di Luar', amount: -800000, type: 'expense', date: '2023-06-15T00:00:00' },
      { id: 5, description: 'Transportasi', amount: -2000000, type: 'expense', date: '2023-06-20T00:00:00' }
    ],
    chartData: {
      labels: ['1', '5', '10', '15', '20', '25', '30'],
      income: [7500000, 0, 0, 0, 0, 0, 0],
      expenses: [0, 1500000, 500000, 800000, 2000000, 0, 0]
    }
  }
}

// Unduh laporan PDF
const downloadPDF = async () => {
  try {
    // Implementasi nyata akan menggunakan library seperti jsPDF
    console.log('Generating PDF report...')
    alert('Fitur unduh PDF akan segera tersedia')
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Gagal membuat PDF')
  }
}

// Unduh laporan Excel
const downloadExcel = async () => {
  try {
    // Implementasi nyata akan menggunakan library seperti xlsx
    console.log('Generating Excel report...')
    alert('Fitur unduh Excel akan segera tersedia')
  } catch (error) {
    console.error('Error generating Excel:', error)
    alert('Gagal membuat Excel')
  }
}

// Set default selected period
selectedPeriod.value = availablePeriods.value[availablePeriods.value.length - 1]?.value || ''
</script>