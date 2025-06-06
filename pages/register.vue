<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-mora-biru">
                    Buat Akun Mora
                </h2>
            </div>
            <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
                <div class="rounded-md shadow-sm space-y-4">
                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                        <input v-model="form.name" id="name" name="name" type="text" required
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mora-biru focus:border-mora-biru">
                    </div>

                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                        <input v-model="form.email" id="email" name="email" type="email" autocomplete="email" required
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mora-biru focus:border-mora-biru">
                    </div>

                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                        <input v-model="form.password" id="password" name="password" type="password"
                            autocomplete="new-password" required
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mora-biru focus:border-mora-biru">
                    </div>

                    <div>
                        <label for="confirm-password" class="block text-sm font-medium text-gray-700">Konfirmasi
                            Password</label>
                        <input v-model="form.confirmPassword" id="confirm-password" name="confirm-password"
                            type="password" autocomplete="new-password" required
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mora-biru focus:border-mora-biru">
                    </div>
                </div>

                <div>
                    <button type="submit"
                        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mora-biru hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mora-biru transition"
                        :disabled="loading">
                        <span v-if="!loading">Daftar</span>
                        <span v-else>Mendaftarkan...</span>
                    </button>
                </div>
            </form>

            <div class="text-center">
                <p class="text-sm text-gray-600">
                    Sudah punya akun?
                    <NuxtLink to="/login" class="font-medium text-mora-biru hover:text-blue-700">
                        Masuk disini
                    </NuxtLink>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const router = useRouter()

const form = reactive({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
})

const loading = ref(false)
const error = ref(null)

const handleRegister = async () => {
    if (form.password !== form.confirmPassword) {
        error.value = 'Password dan konfirmasi password tidak cocok'
        return
    }

    try {
        loading.value = true
        error.value = null

        const { data, error: supabaseError } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: {
                data: {
                    name: form.name,
                }
            }
        })

        if (supabaseError) throw supabaseError

        // Redirect to email confirmation page or login page
        router.push('/verify-email')
    } catch (err) {
        error.value = err.message || 'Terjadi kesalahan saat mendaftar'
        console.error('Registration error:', err)
    } finally {
        loading.value = false
    }
}
</script>