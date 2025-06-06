<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="max-w-md w-full p-6 bg-white rounded-lg shadow-md text-center">
            <h1 class="text-2xl font-bold text-mora-biru mb-4">Verifikasi Email</h1>
            <p class="mb-6">Kami telah mengirimkan link verifikasi ke email Anda. Silakan cek inbox Anda dan klik link
                tersebut untuk mengaktifkan akun.</p>
            <button @click="resendVerification"
                class="bg-mora-kuning text-mora-hitam px-4 py-2 rounded hover:bg-yellow-500 transition">
                Kirim Ulang Email
            </button>
            <p class="mt-4">
                <NuxtLink to="/login" class="text-mora-biru hover:underline">Kembali ke halaman login</NuxtLink>
            </p>
        </div>
    </div>
</template>

<script setup>
const supabase = useSupabaseClient()

const resendVerification = async () => {
    // Implementation for resending verification email
}
</script>