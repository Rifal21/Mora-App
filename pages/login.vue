<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
            <h1 class="text-2xl font-bold text-center text-mora-biru mb-6">Login ke Mora</h1>

            <button @click="signInWithGithub"
                class="w-full bg-gray-800 text-white p-3 rounded-lg mb-3 hover:bg-gray-700 transition">
                Login dengan GitHub
            </button>

            <button @click="signInWithGoogle"
                class="w-full bg-red-500 text-white p-3 rounded-lg mb-3 hover:bg-red-600 transition">
                Login dengan Google
            </button>

            <div class="relative my-6">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="px-2 bg-white text-gray-500">Atau</span>
                </div>
            </div>

            <form @submit.prevent="signInWithEmail" class="space-y-4">
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input v-model="email" type="email" id="email"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-mora-biru focus:border-mora-biru"
                        required>
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <input v-model="password" type="password" id="password"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-mora-biru focus:border-mora-biru"
                        required>
                </div>

                <button type="submit"
                    class="w-full bg-mora-biru text-white p-3 rounded-lg hover:bg-blue-700 transition">
                    Login
                </button>
            </form>

            <p class="mt-4 text-center text-sm text-gray-600">
                Belum punya akun?
                <NuxtLink to="/register" class="text-mora-biru hover:underline">Daftar disini</NuxtLink>
            </p>
        </div>
    </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const email = ref('')
const password = ref('')

const signInWithEmail = async () => {
    try {
        const { error } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value
        })
        if (error) throw error
        navigateTo('/dashboard')
    } catch (error) {
        alert(error.message)
    }
}

const signInWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github'
    })
    if (error) alert(error.message)
}

const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google'
    })
    if (error) alert(error.message)
}
</script>