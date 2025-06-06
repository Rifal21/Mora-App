<template>
    <div>
        <Navbar />

        <div class="container mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold text-mora-biru mb-6">Pengaturan</h1>

            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="space-y-8">
                    <!-- Profil Pengguna -->
                    <div>
                        <h2 class="text-xl font-semibold text-mora-hitam mb-4 border-b pb-2">Profil Pengguna</h2>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-gray-700 mb-2">Nama Lengkap</label>
                                <input type="text" v-model="userProfile.fullName"
                                    class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mora-kuning" />
                            </div>

                            <div>
                                <label class="block text-gray-700 mb-2">Email</label>
                                <input type="email" v-model="userProfile.email"
                                    class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mora-kuning" />
                            </div>

                            <div>
                                <label class="block text-gray-700 mb-2">Nomor Telepon</label>
                                <input type="tel" v-model="userProfile.phone"
                                    class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mora-kuning" />
                            </div>

                            <div>
                                <label class="block text-gray-700 mb-2">Foto Profil</label>
                                <div class="flex items-center space-x-4">
                                    <div
                                        class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                        <img v-if="userProfile.photoUrl" :src="userProfile.photoUrl" alt="Foto Profil"
                                            class="w-full h-full object-cover">
                                        <span v-else class="text-gray-500 text-2xl">{{ userInitials }}</span>
                                    </div>
                                    <button class="text-mora-biru hover:underline">Ubah Foto</button>
                                </div>
                            </div>
                        </div>

                        <div class="mt-6 flex justify-end">
                            <button @click="saveProfile"
                                class="bg-mora-biru text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                                Simpan Profil
                            </button>
                        </div>
                    </div>

                    <!-- Pengaturan Aplikasi -->
                    <div>
                        <h2 class="text-xl font-semibold text-mora-hitam mb-4 border-b pb-2">Pengaturan Aplikasi</h2>

                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="font-medium text-gray-800">Notifikasi Transaksi</p>
                                    <p class="text-sm text-gray-500">Dapatkan notifikasi untuk setiap transaksi baru</p>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" v-model="appSettings.transactionNotifications"
                                        class="sr-only peer">
                                    <div
                                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-mora-kuning/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mora-biru">
                                    </div>
                                </label>
                            </div>

                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="font-medium text-gray-800">Tema Gelap</p>
                                    <p class="text-sm text-gray-500">Aktifkan tema gelap untuk aplikasi</p>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" v-model="appSettings.darkMode" class="sr-only peer">
                                    <div
                                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-mora-kuning/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mora-biru">
                                    </div>
                                </label>
                            </div>

                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="font-medium text-gray-800">Mata Uang</p>
                                    <p class="text-sm text-gray-500">Pilih mata uang yang digunakan</p>
                                </div>
                                <select v-model="appSettings.currency"
                                    class="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mora-kuning">
                                    <option value="IDR">Rupiah (IDR)</option>
                                    <option value="USD">Dollar AS (USD)</option>
                                    <option value="EUR">Euro (EUR)</option>
                                </select>
                            </div>
                        </div>

                        <div class="mt-6 flex justify-end">
                            <button @click="saveAppSettings"
                                class="bg-mora-biru text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                                Simpan Pengaturan
                            </button>
                        </div>
                    </div>

                    <!-- Integrasi AI -->
                    <div>
                        <h2 class="text-xl font-semibold text-mora-hitam mb-4 border-b pb-2">Integrasi AI</h2>

                        <div class="space-y-4">
                            <div>
                                <label class="block text-gray-700 mb-2">Kunci API Grok AI</label>
                                <input type="password" v-model="aiSettings.apiKey"
                                    class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mora-kuning"
                                    placeholder="Masukkan kunci API Anda" />
                                <p class="text-sm text-gray-500 mt-1">Dapatkan kunci API dari dashboard Grok AI</p>
                            </div>

                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="font-medium text-gray-800">Aktifkan Analisis Cerdas</p>
                                    <p class="text-sm text-gray-500">Izinkan AI menganalisis pola pengeluaran Anda</p>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" v-model="aiSettings.enableAnalysis" class="sr-only peer">
                                    <div
                                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-mora-kuning/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mora-biru">
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div class="mt-6 flex justify-end">
                            <button @click="saveAISettings"
                                class="bg-mora-biru text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                                Simpan Pengaturan AI
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const { data: { user } } = await supabase.auth.getUser()
console.log(user);
const userProfile = ref({
    fullName: user?.identities?.[0]?.identity_data?.name || 'John Doe',
    email: user?.identities?.[0]?.identity_data?.email || 'x9KwJ@example.com',
    phone: '+6281234567890',
    photoUrl: ''
});

const appSettings = ref({
    transactionNotifications: true,
    darkMode: false,
    currency: 'IDR'
});

const aiSettings = ref({
    apiKey: '',
    enableAnalysis: true
});

const userInitials = computed(() => {
    return userProfile.value.fullName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase();
});

const saveProfile = async () => {
    try {
        // Simpan profil ke Supabase
        const { data, error } = await useSupabaseClient()
            .from('profiles')
            .upsert({
                id: useSupabaseUser().value.id,
                ...userProfile.value
            })
            .select();

        if (error) throw error;

        alert('Profil berhasil disimpan!');
    } catch (error) {
        console.error('Error saving profile:', error);
        alert('Gagal menyimpan profil');
    }
};

const saveAppSettings = async () => {
    try {
        // Simpan pengaturan aplikasi ke Supabase
        const { data, error } = await useSupabaseClient()
            .from('user_settings')
            .upsert({
                user_id: useSupabaseUser().value.id,
                settings: appSettings.value
            })
            .select();

        if (error) throw error;

        alert('Pengaturan aplikasi berhasil disimpan!');
    } catch (error) {
        console.error('Error saving app settings:', error);
        alert('Gagal menyimpan pengaturan aplikasi');
    }
};

const saveAISettings = async () => {
    try {
        // Simpan pengaturan AI ke Supabase
        const { data, error } = await useSupabaseClient()
            .from('ai_settings')
            .upsert({
                user_id: useSupabaseUser().value.id,
                ...aiSettings.value
            })
            .select();

        if (error) throw error;

        alert('Pengaturan AI berhasil disimpan!');
    } catch (error) {
        console.error('Error saving AI settings:', error);
        alert('Gagal menyimpan pengaturan AI');
    }
};

onMounted(async () => {
    // Ambil data profil dan pengaturan saat komponen dimuat
    try {
        const { data: profileData } = await useSupabaseClient()
            .from('profiles')
            .select('*')
            .eq('id', useSupabaseUser().value.id)
            .single();

        if (profileData) {
            userProfile.value = profileData;
        }

        const { data: settingsData } = await useSupabaseClient()
            .from('user_settings')
            .select('settings')
            .eq('user_id', useSupabaseUser().value.id)
            .single();

        if (settingsData) {
            appSettings.value = settingsData.settings;
        }

        const { data: aiData } = await useSupabaseClient()
            .from('ai_settings')
            .select('*')
            .eq('user_id', useSupabaseUser().value.id)
            .single();

        if (aiData) {
            aiSettings.value = aiData;
        }
    } catch (error) {
        console.error('Error fetching settings:', error);
    }
});
</script>