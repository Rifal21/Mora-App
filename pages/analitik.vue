<template>
    <div>
        <Navbar />

        <div class="container mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold text-mora-biru mb-6">Analisis Keuangan</h1>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-xl font-semibold text-mora-hitam mb-4">Pemasukan vs Pengeluaran</h2>
                    <AnalyticsChart type="income-expense" />
                </div>

                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-xl font-semibold text-mora-hitam mb-4">Kategori Pengeluaran</h2>
                    <AnalyticsChart type="expense-categories" />
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-xl font-semibold text-mora-hitam mb-4">Trend Bulanan</h2>
                <AnalyticsChart type="monthly-trend" />
            </div>
        </div>
    </div>
</template>