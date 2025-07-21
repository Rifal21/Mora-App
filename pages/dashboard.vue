<template>
  <div class="min-h-screen bg-gray-50 mt-16 mb-16 sm:mt-0 sm:mb-0">
    <Navbar />

    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <!-- Header with subtle gradient -->
      <div class="mb-5">
        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
        >
          <div>
            <div class="flex items-center mb-2">
              <div
                class="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mr-3"
              >
                <IconLayoutDashboardFilled class="text-white" />
              </div>
              <div>
                <h1 class="text-2xl md:text-3xl font-bold text-gray-800">
                  Dashboard
                </h1>
                <p class="text-gray-500 mt-1 text-sm">
                  Selamat datang, {{ user.identities[0].identity_data.name }}
                </p>
              </div>
            </div>
          </div>
          <div
            class="text-xs text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-xs flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-3.5 w-3.5 mr-1.5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Diperbarui: {{ lastUpdated }}</span>
          </div>
        </div>
      </div>

      <div class="border-b border-gray-200 mb-5">
        <nav class="-mb-px flex space-x-8 overflow-auto [&::-webkit-scrollbar]:hidden scrollbar-none">
          <button
            @click="activeTab = 'dashboard'"
            :class="[
              activeTab === 'dashboard'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
            ]"
          >
            <IconLayoutDashboardFilled class="inline-block mr-2" />Dashboard
          </button>
          <button
            @click="activeTab = 'inventory'"
            :class="[
              activeTab === 'inventory'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
            ]"
          >
            <IconBrandMinecraft class="inline-block mr-2" />Inventory
          </button>
        </nav>
      </div>
      <!-- Dashboard Content -->
      <div v-if="activeTab === 'dashboard'">
        <!-- Summary Cards - Elegant Design -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <!-- Balance Card -->
          <div
            class="bg-white rounded-xl p-5 border border-gray-100 shadow-xs hover:shadow-sm transition-all duration-200"
          >
            <div class="flex justify-between items-start">
              <div>
                <p
                  class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1"
                >
                  Saldo Saat Ini
                </p>
                <p class="text-2xl font-semibold text-gray-800 mb-2">
                  {{ formatCurrency(currentBalance) }}
                </p>
                <div class="flex items-center">
                  <span
                    :class="`text-xs px-2 py-1 rounded-full ${
                      calculatePercentage(income, expenses) >= 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`"
                  >
                    {{ calculatePercentage(income, expenses) >= 0 ? "↑" : "↓" }}
                    {{ Math.abs(calculatePercentage(income, expenses)) }}%
                  </span>
                  <span class="text-xs text-gray-500 ml-2">vs bulan lalu</span>
                </div>
              </div>
              <div class="p-2 bg-blue-50 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Income Card -->
          <div
            class="bg-white rounded-xl p-5 border border-gray-100 shadow-xs hover:shadow-sm transition-all duration-200"
          >
            <div class="flex justify-between items-start">
              <div>
                <p
                  class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1"
                >
                  Total Pemasukan
                </p>
                <p class="text-2xl font-semibold text-gray-800 mb-2">
                  {{ formatCurrency(income) }}
                </p>
                <div class="flex items-center">
                  <span
                    class="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800"
                  >
                    {{
                      calculatePercentage(income, expenses) >= 0 ? "↑" : "↓"
                    }}
                    {{ calculatePercentage(income, expenses) }}%
                  </span>
                  <span class="text-xs text-gray-500 ml-2">vs bulan lalu</span>
                </div>
              </div>
              <div class="p-2 bg-green-50 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Expense Card -->
          <div
            class="bg-white rounded-xl p-5 border border-gray-100 shadow-xs hover:shadow-sm transition-all duration-200"
          >
            <div class="flex justify-between items-start">
              <div>
                <p
                  class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1"
                >
                  Total Pengeluaran
                </p>
                <p class="text-2xl font-semibold text-gray-800 mb-2">
                  {{ formatCurrency(expenses) }}
                </p>
                <div class="flex items-center">
                  <span
                    class="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800"
                  >
                    {{
                      calculatePercentage(income, expenses) >= 0 ? "↑" : "↓"
                    }}
                    {{ calculatePercentage(income, expenses) }}%
                  </span>
                  <span class="text-xs text-gray-500 ml-2">vs bulan lalu</span>
                </div>
              </div>
              <div class="p-2 bg-red-50 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          <!-- Chart Section -->
          <div
            class="bg-white rounded-xl p-6 border border-gray-100 shadow-xs lg:col-span-3"
          >
            <div
              class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3"
            >
              <h2 class="text-lg font-semibold text-gray-800 flex items-center">
                <div
                  class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                Tren Keuangan
              </h2>
              <select
                v-model="chartRange"
                class="text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 bg-white"
              >
                <option value="5">5 Hari</option>
                <option value="7">7 Hari</option>
                <option value="30">30 Hari</option>
                <option value="90">90 Hari</option>
              </select>
            </div>
            <div class="h-72">
              <AnalyticsChart
                type="income-expense"
                :range="chartRange"
                :key="chartRange"
              />
            </div>
          </div>

          <!-- Recent Transactions & Budget -->
          <div class="grid grid-cols-1 gap-6 lg:col-span-2">
            <!-- Recent Transactions -->
            <div
              class="bg-white rounded-xl p-6 border border-gray-100 shadow-xs"
            >
              <div class="flex justify-between items-center mb-6">
                <h2
                  class="text-lg font-semibold text-gray-800 flex items-center"
                >
                  <div
                    class="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center mr-3"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 text-purple-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                      />
                    </svg>
                  </div>
                  Transaksi Terakhir
                </h2>
                <NuxtLink
                  to="/transaksi"
                  class="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                >
                  Lihat semua
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </NuxtLink>
              </div>
              <TransactionList :transactions="recentTransactions" />
            </div>
          </div>
        </div>
      </div>
       <!-- Inventory Content -->
      <div v-if="activeTab === 'inventory'">
        <div class="bg-white rounded-xl p-6 border border-gray-100 shadow-xs mb-6">
          <div class="flex flex-col items-start  mb-6">
            <h2 class="text-lg font-semibold text-gray-800 mb-5 text-start">Daftar Inventory</h2>
            <div class="flex justify-between items-center space-x-4 w-full">
              <div class="flex items-center">
                <label for="itemsPerPage" class="mr-2 text-sm text-gray-600">Items per page:</label>
                <select
                  id="itemsPerPage"
                  v-model="itemsPerPage"
                  class="text-xs border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300 bg-white"
                  @change="currentPage = 1"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
              <button 
                @click="openAddInventory"
                class="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Tambah Barang
              </button>
            </div>
          </div>
          
          <!-- Inventory Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Barang</th>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                  <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="paginatedInventory.length === 0">
                  <td colspan="5" class="px-4 py-4 text-center text-sm text-gray-500">
                    Belum ada data inventory
                  </td>
                </tr>
                <tr v-for="item in paginatedInventory" :key="item.id">
                  <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.name }}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ item.category }}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ item.quantity }}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ formatCurrency(item.price) }}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button @click="editInventoryItem(item)" class="text-blue-600 hover:text-blue-900 mr-3"><IconEdit class="w-6 h-6" /></button>
                    <button @click="confirmDeleteInventory(item.id)" class="text-red-600 hover:text-red-900"><IconTrash class="w-6 h-6" /></button>
                  </td>
                </tr>
                <tr v-if="inventory.length === 0">
                  <td colspan="5" class="px-4 py-4 text-center text-sm text-gray-500">Belum ada data inventory</td>
                </tr>
              </tbody>
            </table>
            <!-- Pagination Controls -->
            <div class="flex items-center justify-between mt-4 px-4 py-3 bg-white border-t border-gray-200 sm:px-6 rounded-b-lg">
              <div class="flex-1 flex justify-between sm:hidden">
                <button 
                  @click="currentPage = currentPage - 1"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  @click="currentPage = currentPage + 1"
                  :disabled="currentPage === totalPages"
                  class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
              <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm text-gray-700">
                    Showing
                    <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
                    to
                    <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, inventory.length) }}</span>
                    of
                    <span class="font-medium">{{ inventory.length }}</span>
                    results
                  </p>
                </div>
                <div>
                  <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      @click="currentPage = currentPage - 1"
                      :disabled="currentPage === 1"
                      class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span class="sr-only">Previous</span>
                      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </button>
                    <!-- Page numbers -->
                    <button
                      v-for="page in totalPages"
                      :key="page"
                      @click="currentPage = page"
                      :class="[page === currentPage ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50', 'relative inline-flex items-center px-4 py-2 border text-sm font-medium']"
                    >
                      {{ page }}
                    </button>
                    <button
                      @click="currentPage = currentPage + 1"
                      :disabled="currentPage === totalPages"
                      class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span class="sr-only">Next</span>
                      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Inventory Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <!-- Total Items Card -->
          <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-xs hover:shadow-sm transition-all duration-200">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Total Barang</p>
                <p class="text-2xl font-semibold text-gray-800">{{ inventory.length }}</p>
              </div>
              <div class="p-2 bg-blue-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Total Inventory Value -->
          <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-xs hover:shadow-sm transition-all duration-200">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Total Nilai Inventory</p>
                <p class="text-2xl font-semibold text-gray-800">{{ formatCurrency(totalInventoryValue) }}</p>
              </div>
              <div class="p-2 bg-green-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Low Stock Items -->
          <div class="bg-white rounded-xl p-5 border border-gray-100 shadow-xs hover:shadow-sm transition-all duration-200">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Barang Stok Rendah</p>
                <p class="text-2xl font-semibold text-gray-800">{{ lowStockItemsCount }}</p>
                <p class="text-xs text-gray-500 mt-1">(Stok < 5)</p>
              </div>
              <div class="p-2 bg-yellow-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

        <!-- Modal Tambah/Edit Inventory -->
        <Modal
          :show="showAddInventoryModal"
          @close="showAddInventoryModal = false"
        >
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              {{ editingInventory ? "Edit Barang" : "Tambah Barang Baru" }}
            </h3>
            <form @submit.prevent="saveInventory">
              <div class="space-y-4">
                <div>
                  <label
                    for="name"
                    class="block text-sm font-medium text-gray-700"
                    >Nama Barang</label
                  >
                  <input
                    type="text"
                    id="name"
                    v-model="inventoryForm.name"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label
                    for="category"
                    class="block text-sm font-medium text-gray-700"
                    >Kategori</label
                  >
                  <input
                    type="text"
                    id="category"
                    v-model="inventoryForm.category"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      for="quantity"
                      class="block text-sm font-medium text-gray-700"
                      >Jumlah Stok</label
                    >
                    <input
                      type="number"
                      id="quantity"
                      v-model.number="inventoryForm.quantity"
                      min="0"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label
                      for="price"
                      class="block text-sm font-medium text-gray-700"
                      >Harga Satuan</label
                    >
                    <input
                      type="number"
                      id="price"
                      v-model.number="inventoryForm.price"
                      min="0"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    for="description"
                    class="block text-sm font-medium text-gray-700"
                    >Deskripsi (Opsional)</label
                  >
                  <textarea
                    id="description"
                    v-model="inventoryForm.description"
                    rows="3"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  ></textarea>
                </div>
              </div>

              <div class="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  @click="showAddInventoryModal = false"
                  class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </Modal>

        <!-- Modal Konfirmasi Hapus -->
        <Modal
          :show="showDeleteConfirmModal"
          @close="showDeleteConfirmModal = false"
        >
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              Konfirmasi Hapus Barang
            </h3>
            <p class="text-sm text-gray-500 mb-6">
              Anda yakin ingin menghapus barang ini? Tindakan ini tidak dapat
              dibatalkan.
            </p>

            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="showDeleteConfirmModal = false"
                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Batal
              </button>
              <button
                type="button"
                @click="deleteInventoryItem"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Hapus
              </button>
            </div>
          </div>
        </Modal>
    </div>
  </div>
</template>

<style scoped>
.tab-enter-active,
.tab-leave-active {
  transition: opacity 0.3s ease;
}

.tab-enter-from,
.tab-leave-to {
  opacity: 0;
}
</style>

<script setup>
import { useSupabaseClient } from "#imports";
import { IconEdit, IconTrash, IconLayoutDashboardFilled, IconBrandMinecraft } from "@tabler/icons-vue";

const supabase = useSupabaseClient();
const currentBalance = ref(0);
const income = ref(0);
const expenses = ref(0);
const recentTransactions = ref([]);
const lastUpdated = ref(
  new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
);
const chartRange = ref("5");
const { data: { user } } = await supabase.auth.getUser();
console.log(user)

const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const calculatePercentage = (income, expenses) => {
  if (expenses === 0) return 100;
  return Math.round(((income - expenses) / expenses) * 100);
};

const loadData = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Hitung saldo secara real-time dari transaksi
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

    // 2. Update user_balance untuk caching
    await supabase.from("user_balance").upsert({
      user_id: user.id,
      balance: calculated.balance,
      income: calculated.income,
      expenses: calculated.expenses,
    });

    // 3. Ambil transaksi terakhir
    const { data: recent } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    recentTransactions.value = recent || [];
    lastUpdated.value = new Date().toLocaleString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Failed to load data:", error);
  }
};

onMounted(async () => {
  await loadData();
  await loadInventory();

  if (window.location.hash === '#inventory') {
    activeTab.value = 'inventory'
  }

  // Set up listener untuk perubahan auth
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN") {
      loadData();
      loadInventory();
    }
  });

  // Channel untuk transactions
  supabase
    .channel("transactions")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "transactions" },
      (payload) => {
        console.log("Realtime update transactions:", payload);
        loadData();
      }
    )
    .subscribe();

  // Channel terpisah untuk inventory
  supabase
    .channel("inventory")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "inventory" },
      (payload) => {
        console.log("Realtime update inventory:", payload);
        loadInventory();
      }
    )
    .subscribe();
});

// Tambahkan state untuk active tab
const activeTab = ref('dashboard')

// Computed properties untuk inventory summary
const totalInventoryValue = computed(() => {
  return inventory.value.reduce((total, item) => {
    return total + (item.price * item.quantity)
  }, 0)
})

const lowStockItemsCount = computed(() => {
  return inventory.value.filter(item => item.quantity < 5).length
})

// Tambahkan state untuk inventory
const inventory = ref([]);
const showAddInventoryModal = ref(false);
const showDeleteConfirmModal = ref(false);
const editingInventory = ref(false);
const inventoryToDelete = ref(null);

const inventoryForm = reactive({
  id: null,
  name: "",
  category: "",
  quantity: 0,
  price: 0,
  description: "",
});

// Fungsi untuk memuat data inventory
const loadInventory = async () => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!user) {
      console.log('User not authenticated');
      return;
    }

    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    console.log('Inventory data loaded:', data); // Debug log
    inventory.value = data || [];
  } catch (error) {
    console.error("Gagal memuat inventory:", error);
    inventory.value = []; // Reset jika error
  }
};

// Fungsi untuk membuka form tambah inventory
const openAddInventory = () => {
  resetInventoryForm();
  editingInventory.value = false;
  showAddInventoryModal.value = true;
};

// Fungsi untuk membuka form edit inventory
const editInventoryItem = (item) => {
  Object.assign(inventoryForm, {
    id: item.id,
    name: item.name,
    category: item.category,
    quantity: item.quantity,
    price: item.price,
    description: item.description,
  });
  editingInventory.value = true;
  showAddInventoryModal.value = true;
};

// Fungsi untuk mereset form
const resetInventoryForm = () => {
  Object.assign(inventoryForm, {
    id: null,
    name: "",
    category: "",
    quantity: 0,
    price: 0,
    description: "",
  });
};

// Fungsi untuk menyimpan inventory
const saveInventory = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    if (editingInventory.value) {
      // Update existing item
      const { error } = await supabase
        .from("inventory")
        .update({
          name: inventoryForm.name,
          category: inventoryForm.category,
          quantity: inventoryForm.quantity,
          price: inventoryForm.price,
          description: inventoryForm.description,
          updated_at: new Date().toISOString(),
        })
        .eq("id", inventoryForm.id);

      if (error) throw error;
    } else {
      // Add new item
      const { error } = await supabase.from("inventory").insert({
        user_id: user.id,
        name: inventoryForm.name,
        category: inventoryForm.category,
        quantity: inventoryForm.quantity,
        price: inventoryForm.price,
        description: inventoryForm.description,
      });

      if (error) throw error;
    }

    await loadInventory();
    showAddInventoryModal.value = false;
  } catch (error) {
    console.error("Gagal menyimpan inventory:", error);
  }
};

// Fungsi untuk konfirmasi hapus
const confirmDeleteInventory = (id) => {
  inventoryToDelete.value = id;
  showDeleteConfirmModal.value = true;
};

// Fungsi untuk menghapus inventory
const deleteInventoryItem = async () => {
  try {
    const { error } = await supabase
      .from("inventory")
      .delete()
      .eq("id", inventoryToDelete.value);

    if (error) throw error;

    await loadInventory();
    showDeleteConfirmModal.value = false;
    inventoryToDelete.value = null;
  } catch (error) {
    console.error("Gagal menghapus inventory:", error);
  }
};

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(5); // Jumlah item per halaman
const totalPages = computed(() => Math.ceil(inventory.value.length / itemsPerPage.value));

// Computed property untuk data yang ditampilkan
const paginatedInventory = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return inventory.value.slice(start, end);
});

watch(inventory, () => {
  currentPage.value = 1; // Kembali ke halaman 1 saat data berubah
});
</script>