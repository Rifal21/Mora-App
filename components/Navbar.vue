<template>
  <nav class="bg-gray-50 text-black shadow-lg">
    <div class="hidden md:block container mx-auto px-4">
      <div class="flex justify-between items-center py-4 md:flex-row md:space-x-6 flex-row-reverse">
        <div class="flex flex-col justify-center items-center">
          <img src="~/assets/images/logo/logo mora.png" alt="Mora" class="w-28 md:w-40 h-10 md:h-14 object-cover rounded-md">
          <p class="text-[8px] md:text-lg italic text-bold">"Cuan rapi, planning pasti!"</p>
        </div>

        <div class="hidden lg:flex space-x-6 items-center">
          <NuxtLink to="/" class="hover:text-yellow-500 transition" active-class="text-yellow-500 font-bold">Beranda</NuxtLink>
          <NuxtLink to="/dashboard" class="hover:text-yellow-500 transition"
              active-class="text-yellow-500 font-bold">
              Dashboard
          </NuxtLink>
          <NuxtLink to="/transaksi" class="hover:text-yellow-500 transition" active-class="text-yellow-500 font-bold">Transaksi</NuxtLink>
          
          <div class="relative">
            <button 
              @click="toggleProfileDropdown" 
              class="flex items-center space-x-1 hover:text-yellow-500 transition"
              aria-label="Profile Menu"
            >
            <div
                class="w-10 h-10 rounded-full bg-gray-300 text-black flex items-center justify-center overflow-hidden">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            </div>
            </button>

            <div 
              v-if="isProfileDropdownOpen" 
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
            >
              <div class="px-4 py-2 border-b border-gray-200" v-if="user">
                <p class="text-sm font-medium text-gray-800">{{ user?.identities[0]?.identity_data?.name || '' }}</p>
                <p class="text-xs text-gray-500 truncate">{{ user?.email || '' }}</p>
              </div>
              <div v-else>
                <p>Memuat data pengguna...</p>
              </div>
              <button 
                @click="toggleProfileModal"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profil Saya
              </button>
              <button 
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <button 
            @click="toggleMenu" 
            class="flex items-center justify-center w-10 h-10 rounded-xl border border-black bg-white text-black hover:bg-black hover:text-white transition duration-300 focus:outline-none cursor-pointer"
            aria-label="Toggle Menu"
          >
           <IconLayoutSidebarLeftExpand class="h-6 w-6" />
          </button>
        </div>
      </div>

      <!-- Mobile Overlay -->
      <div 
        v-if="isMenuOpen" 
        @click="toggleMenu" 
        class="fixed inset-0 bg-black/30 bg-opacity-50 z-40"
      ></div>

      <!-- Mobile Sidebar -->
      <!-- <div 
        class="fixed inset-y-0 left-0 w-64 bg-gray-800 text-white shadow-lg z-50 transform transition-transform duration-300"
        :class="{ '-translate-x-full': !isMenuOpen, 'translate-x-0': isMenuOpen }"
      >
        <div class="p-4">
          <div class="flex flex-col justify-center items-center bg-white rounded-xl mb-5 py-5">
            <img src="~/assets/images/logo/logo mora.png" alt="Mora" class="w-28 md:w-40 h-10 md:h-14 object-cover rounded-md">
            <p class="text-[8px] md:text-lg italic text-bold text-black">"Cuan rapi, planning pasti!"</p>
          </div>
          <NuxtLink to="/" class="block py-2 hover:text-yellow-500 hover:bg-gray-50 p-2 rounded-lg" active-class="text-yellow-500 font-bold bg-gray-100 md:bg-transparent">Beranda</NuxtLink>
          <NuxtLink to="/dashboard" class="block py-2 hover:text-yellow-500 hover:bg-gray-50 p-2 rounded-lg transition"
              active-class="text-yellow-500 font-bold bg-gray-100 md:bg-transparent">
              Dashboard
          </NuxtLink>
          <NuxtLink to="/transaksi" class="block py-2 hover:text-yellow-500 hover:bg-gray-50 p-2 rounded-lg" active-class="text-yellow-500 font-bold bg-gray-100 md:bg-transparent">Transaksi</NuxtLink>
          
          <div class="mt-4 pt-4 border-t border-gray-700" >
            <div class="px-2 mb-3" v-if="user">
              <p class="text-sm font-medium">{{ user?.identities[0]?.identity_data?.name || '' }}</p>
              <p class="text-xs text-gray-400 truncate">{{ user?.email || '' }}</p>
            </div>
            <div v-else>
            <p>Memuat data pengguna...</p>
            </div>
            <button 
              @click="toggleProfileModal"
              class="block w-full text-left py-2 px-2 hover:text-yellow-500 hover:bg-gray-50 rounded-lg"
            >
              Profil Saya
            </button>
            <button 
              @click="handleLogout"
              class="block w-full text-left py-2 px-2 text-red-400 hover:text-red-500 hover:bg-gray-50 rounded-lg"
            >
              Keluar
            </button>
          </div>
        </div>
      </div> -->
    </div>
    <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
  <div class="flex justify-around items-center h-16 relative">
    <!-- Floating Chat Button (Centered) -->
    <button 
      @click="handleChatButtonClick"
      class="absolute left-1/2 transform -translate-x-1/2 -top-5 z-50 bg-white text-yellow-500 p-3 rounded-full shadow-xl hover:bg-black transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      aria-label="Open Chat"
      style="box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);"
    >
      <IconMessageChatbot class="w-10 h-10"/>
    </button>

    <!-- Regular Navigation Items -->
    <NuxtLink 
      to="/" 
      class="flex flex-col items-center justify-center w-full h-full text-gray-600 hover:text-yellow-500 transition"
      active-class="text-yellow-500"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
      <span class="text-xs mt-1">Beranda</span>
    </NuxtLink>

    <NuxtLink 
      to="/dashboard" 
      class="flex flex-col items-center justify-center w-full h-full text-gray-600 hover:text-yellow-500 transition"
      active-class="text-yellow-500"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
      <span class="text-xs mt-1">Dashboard</span>
    </NuxtLink>

    <!-- Empty div to balance the layout -->
    <div class="w-full h-full"></div>

    <NuxtLink 
      to="/transaksi" 
      class="flex flex-col items-center justify-center w-full h-full text-gray-600 hover:text-yellow-500 transition"
      active-class="text-yellow-500"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span class="text-xs mt-1">Transaksi</span>
    </NuxtLink>

    <button 
      @click="toggleProfileModal"
      class="flex flex-col items-center justify-center w-full h-full text-gray-600 hover:text-yellow-500 transition"
    >
      <div class="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <span class="text-xs mt-1">Profil</span>
    </button>
  </div>
</div>

    <!-- Mobile Header (Logo only) -->
<div class="lg:hidden flex flex-col items-center justify-center py-3 bg-white fixed top-0 left-0 right-0 z-50 shadow-md">
  <img src="~/assets/images/logo/logo mora.png" alt="Mora" class="w-28 md:w-40 h-10 md:h-14 object-cover rounded-md">
  <p class="text-[8px] md:text-lg italic text-bold">"Cuan rapi, planning pasti!"</p>
</div>

    <!-- Profile Modal -->
    <div 
      v-if="isProfileModalOpen" 
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="toggleProfileModal"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-xl font-bold text-gray-800">Profil Pengguna</h2>
            <button 
              @click="toggleProfileModal"
              class="text-gray-500 hover:text-gray-700"
              aria-label="Close Modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="space-y-4">
            <div class="flex items-center space-x-4">
              <div class="bg-blue-100 text-blue-800 rounded-full p-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div v-if="user">
                <h3 class="text-lg font-semibold">{{ user?.identities[0]?.identity_data?.name || '' }}</h3>
                <p class="text-gray-600">{{ user?.email || '' }}</p>
              </div>
              <div v-else>
                <!-- tampilkan loader atau kosong -->
                <p class="text-xs p-2">Memuat data pengguna...</p>
              </div>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-medium text-gray-800 mb-2">Informasi Akun</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Bergabung sejak</p>
                  <p class="font-medium">{{ formatDate(user.created_at) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Provider</p>
                  <p class="font-medium capitalize">{{ user.app_metadata.provider }}</p>
                </div>
              </div>
            </div>
            
            <div class="flex space-x-3 pt-4">
              <button 
                @click="handleLogout"
                class="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition flex items-center justify-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Keluar</span>
              </button>
              <button 
                @click="toggleProfileModal"
                class="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { IconLayoutSidebarLeftExpand , IconCat, IconMessageChatbot, IconRobot } from '@tabler/icons-vue';
import { useChatStore } from '~/stores/chat';
import { useRouter, useRoute } from 'vue-router';
const isMenuOpen = ref(false);
const isProfileModalOpen = ref(false);
const isProfileDropdownOpen = ref(false);
const supabase = useSupabaseClient();
const router = useRouter();
const { data: { user } } = await supabase.auth.getUser();

const route = useRoute();
const chatStore = useChatStore()

const handleChatButtonClick = () => {
  if (route.path === '/') {
    // Jika di halaman index, gunakan toggleChat
    chatStore.toggleChat();
  } else {
    // Jika bukan di halaman index, arahkan ke halaman /chat
    router.push('/chat');
  }
};
// Get user initials for avatar
const userShortName = computed(() => {
  const name = user.value?.identities[0]?.identity_data?.name || '';
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
});

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

console.log(user)
const toggleProfileModal = () => {
  if(user === null) {
    router.push('/login');
  } else {
    isProfileModalOpen.value = !isProfileModalOpen.value;
    isProfileDropdownOpen.value = false;
    isMenuOpen.value = false;
  }
};

const toggleProfileDropdown = () => {
  isProfileDropdownOpen.value = !isProfileDropdownOpen.value;
};

const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    router.push('/auth/login');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      isProfileDropdownOpen.value = false;
    }
  });
});
</script>

<style scoped>
/* Smooth transitions for dropdown */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>