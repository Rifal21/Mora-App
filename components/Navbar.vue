<template>
    <nav class="bg-blue-600 text-white shadow-lg">
        <div class="container mx-auto px-4">
            <div class="flex justify-between items-center py-4">
                <div class="flex items-center space-x-4">
                    <h1 class="text-2xl font-bold text-mora-kuning">MORA</h1>
                    <p class="hidden md:block">Pengelola Keuangan Pribadi</p>
                </div>

                <div class="hidden md:flex space-x-6">
                    <NuxtLink to="/" class="hover:text-mora-kuning transition">Beranda</NuxtLink>
                    <NuxtLink to="/dashboard" class="hover:text-mora-kuning transition"
                        active-class="text-mora-kuning font-bold">
                        Dashboard
                    </NuxtLink>
                    <NuxtLink to="/transaksi" class="hover:text-mora-kuning transition">Transaksi</NuxtLink>
                    <NuxtLink to="/analitik" class="hover:text-mora-kuning transition">Analitik</NuxtLink>
                    <NuxtLink to="/laporan" class="hover:text-mora-kuning transition">Laporan</NuxtLink>
                    <NuxtLink to="/pengaturan" class="hover:text-mora-kuning transition">Pengaturan</NuxtLink>
                </div>

                <div class="md:hidden">
                    <button @click="toggleMenu" class="text-white focus:outline-none">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Mobile Menu -->
            <div v-if="isMenuOpen" class="md:hidden pb-4">
                <NuxtLink to="/" class="block py-2 hover:text-mora-kuning">Beranda</NuxtLink>
                <NuxtLink to="/dashboard" class="hover:text-mora-kuning transition"
                    active-class="text-mora-kuning font-bold">
                    Dashboard
                </NuxtLink>
                <NuxtLink to="/transaksi" class="block py-2 hover:text-mora-kuning">Transaksi</NuxtLink>
                <NuxtLink to="/analitik" class="block py-2 hover:text-mora-kuning">Analitik</NuxtLink>
                <NuxtLink to="/laporan" class="block py-2 hover:text-mora-kuning">Laporan</NuxtLink>
                <NuxtLink to="/pengaturan" class="block py-2 hover:text-mora-kuning">Pengaturan</NuxtLink>
            </div>
        </div>
    </nav>
</template>

<script setup>
const isMenuOpen = ref(false);

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};
</script>