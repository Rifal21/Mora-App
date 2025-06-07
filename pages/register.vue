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
        <!-- Error Message -->
        <div v-if="error" class="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ error }}</span>
        </div>

        <!-- Registration Form -->
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input v-model="form.name" id="name" type="text" placeholder="Nama Anda" required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              :class="{ 'border-red-500': errors.name }">
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
            <input v-model="form.email" id="email" type="email" placeholder="email@contoh.com" required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              :class="{ 'border-red-500': errors.email }">
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input v-model="form.password" id="password" type="password" placeholder="••••••••" required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              :class="{ 'border-red-500': errors.password }">
            <div class="mt-1 text-xs text-gray-500">
              <p>Password harus mengandung:</p>
              <ul class="list-disc list-inside">
                <li :class="{'text-green-600': hasMinLength}">Minimal 8 karakter</li>
                <li :class="{'text-green-600': hasNumber}">Minimal 1 angka</li>
                <li :class="{'text-green-600': hasSpecialChar}">Minimal 1 karakter khusus</li>
              </ul>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
            <input v-model="form.confirmPassword" id="confirmPassword" type="password" placeholder="••••••••" required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              :class="{ 'border-red-500': errors.confirmPassword }">
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
          </div>

          <div class="flex items-center">
            <input v-model="form.agreeTerms" id="agreeTerms" type="checkbox" required
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
            <label for="agreeTerms" class="ml-2 block text-sm text-gray-700">
              Saya menyetujui <NuxtLink to="/terms" class="text-blue-600 hover:underline">Syarat & Ketentuan</NuxtLink>
            </label>
          </div>

          <button type="submit" :disabled="loading"
            class="w-full bg-mora-biru text-white p-3 rounded-lg hover:bg-blue-700 transition flex justify-center items-center"
            :class="{ 'opacity-75 cursor-not-allowed': loading }">
            <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Membuat Akun...' : 'Daftar Sekarang' }}
          </button>
        </form>

        <div class="mt-6 text-center text-sm text-gray-600">
          Sudah punya akun? 
          <NuxtLink to="/login" class="font-medium text-blue-600 hover:underline">Masuk disini</NuxtLink>
        </div>
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
  confirmPassword: '',
  agreeTerms: false
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref(null)

// Password strength indicators
const hasMinLength = computed(() => form.password.length >= 8)
const hasNumber = computed(() => /\d/.test(form.password))
const hasSpecialChar = computed(() => /[!@#$%^&*(),.?":{}|<>]/.test(form.password))

const validateForm = () => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '')
  
  // Name validation
  if (form.name.trim().length < 3) {
    errors.name = 'Nama harus minimal 3 karakter'
    isValid = false
  }
  
  // Email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Email tidak valid'
    isValid = false
  }
  
  // Password validation
  if (form.password.length < 8) {
    errors.password = 'Password harus minimal 8 karakter'
    isValid = false
  } else if (!hasNumber.value || !hasSpecialChar.value) {
    errors.password = 'Password harus mengandung angka dan karakter khusus'
    isValid = false
  }
  
  // Confirm password validation
  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Password tidak cocok'
    isValid = false
  }
  
  // Terms agreement
  if (!form.agreeTerms) {
    error.value = 'Anda harus menyetujui syarat dan ketentuan'
    isValid = false
  }
  
  return isValid
}

const handleRegister = async () => {
  if (!validateForm()) return
  
  try {
    loading.value = true
    error.value = null

    const { data, error: supabaseError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          name: form.name,
          email_redirect_to: window.location.origin + '/dashboard'
        }
      }
    })

    if (supabaseError) throw supabaseError

    // Show success message and redirect
    if (data.user?.identities?.length === 0) {
      error.value = 'Email sudah terdaftar'
    } else {
      // Redirect to email verification page
      router.push({
        path: '/verify-email',
        query: { email: form.email }
      })
    }
  } catch (err) {
    console.error('Registration error:', err)
    error.value = err.message || 'Terjadi kesalahan saat mendaftar'
    
    // Handle specific Supabase errors
    if (err.message.includes('User already registered')) {
      error.value = 'Email sudah terdaftar'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.bg-mora-biru {
  background-color: #2563eb; /* Warna biru Mora */
}

/* Smooth transitions for form elements */
input, button {
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

/* Password strength indicators */
.text-green-600 {
  color: #16a34a;
}
</style>