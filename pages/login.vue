<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
      <!-- Header with Logo -->
      <div class="bg-mora-biru py-6 px-8 text-center">
        <div class="flex justify-center -mb-16 -mt-20">
          <img src="~/assets/images/logo/logo mora.png" alt="Mora Logo" class="h-64 object-cover">
        </div>
        <p class="-mt-20 text-[16px] sm:text-xl italic text-bold">"Cuan rapi, planning pasti!"</p>
      </div>

      <div class="p-8">
        <div class="flex flex-col justify-center items-center mb-5">
            <h1 class="text-2xl font-bold text-black">Buat Akun Baru</h1>
            <p class="text-black mt-1 text-center text-sm sm:text-lg">Mulai kelola keuangan Anda dengan Mora</p>
        </div>
        <!-- Social Login Buttons -->
        <div class="space-y-3">
          <button @click="signInWithGoogle" 
            class="w-full flex items-center justify-center space-x-3 bg-white border border-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-50 transition shadow-sm">
            <img src="https://www.google.com/favicon.ico" alt="Google" class="h-5 w-5">
            <span>Lanjutkan dengan Google</span>
          </button>
<!-- 
          <button @click="signInWithGithub"
            class="w-full flex items-center justify-center space-x-3 bg-gray-800 text-white p-3 rounded-lg hover:bg-gray-700 transition shadow-sm">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
            </svg>
            <span>Lanjutkan dengan GitHub</span>
          </button> -->
        </div>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center">
            <span class="px-3 bg-white text-sm text-gray-500">atau masuk dengan email</span>
          </div>
        </div>

        <!-- Email Login Form -->
        <form @submit.prevent="signInWithEmail" class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
            <input v-model="email" type="email" id="email" placeholder="email@contoh.com"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              :class="{ 'border-red-500': emailError }"
              required>
            <p v-if="emailError" class="mt-1 text-sm text-red-600">{{ emailError }}</p>
          </div>

          <div>
            <div class="flex justify-between items-center mb-1">
              <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
              <NuxtLink to="/forgot-password" class="text-sm text-blue-600 hover:underline">Lupa password?</NuxtLink>
            </div>
            <input v-model="password" type="password" id="password" placeholder="••••••••"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              :class="{ 'border-red-500': passwordError }"
              required>
            <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
          </div>

          <button type="submit" :disabled="isLoading"
            class="w-full bg-mora-biru text-white p-3 rounded-lg hover:bg-blue-700 transition flex justify-center items-center"
            :class="{ 'opacity-75 cursor-not-allowed': isLoading }">
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Memproses...' : 'Masuk' }}
          </button>
        </form>

        <div class="mt-6 text-center text-sm text-gray-600">
          Belum punya akun? 
          <NuxtLink to="/register" class="font-medium text-blue-600 hover:underline">Daftar sekarang</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const router = useRouter()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const emailError = ref('')
const passwordError = ref('')

const signInWithEmail = async () => {
  try {
    // Reset errors
    emailError.value = ''
    passwordError.value = ''
    isLoading.value = true

    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

    if (error) {
      // Handle specific error cases
      if (error.message.includes('Invalid login credentials')) {
        emailError.value = 'Email atau password salah'
        passwordError.value = 'Email atau password salah'
      } else if (error.message.includes('Email not confirmed')) {
        emailError.value = 'Email belum diverifikasi. Silakan cek inbox Anda.'
      } else {
        throw error
      }
      return
    }

    // Redirect to dashboard on success
    router.push('/')
  } catch (error) {
    console.error('Login error:', error)
    alert('Terjadi kesalahan saat login. Silakan coba lagi.')
  } finally {
    isLoading.value = false
  }
}

// const signInWithGithub = async () => {
//   try {
//     const { error } = await supabase.auth.signInWithOAuth({
//       provider: 'github',
//       options: {
//         redirectTo: window.location.origin + '/dashboard'
//       }
//     })
//     if (error) throw error
//   } catch (error) {
//     console.error('GitHub login error:', error)
//     alert('Gagal login dengan GitHub. Silakan coba lagi.')
//   }
// }

const signInWithGoogle = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    })
    if (error) throw error
  } catch (error) {
    console.error('Google login error:', error)
    alert('Gagal login dengan Google. Silakan coba lagi.')
  }
}
</script>

<style scoped>
.bg-mora-biru {
  background-color: #2563eb; /* Warna biru Mora */
}

/* Smooth transitions for form elements */
input {
  transition: all 0.2s ease;
}

/* Focus styles */
input:focus {
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* Button hover effect */
button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>