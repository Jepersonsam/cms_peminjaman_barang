<template>
  <div class="bg-white shadow p-6 flex justify-between items-center">
    <!-- Judul CMS -->
    <div class="flex items-center gap-3 text-gray-800">
      <div class="p-2 bg-gray-100 rounded-lg">
        <Building2 class="w-8 h-8 text-blue-600" />
      </div>
      <div>
        <h1 class="text-xl font-bold leading-tight">CMS Peminjaman</h1>
        <p class="text-sm text-gray-500 -mt-1">Barang &amp; Ruangan</p>
      </div>
    </div>

    <!-- User Info + Logout -->
    <div class="flex items-center gap-4">
      <div v-if="user" class="text-gray-600 font-medium">
        Halo, {{ user.name }}
      </div>

      <button
        @click="logout"
        class="text-red-600 hover:text-red-800 flex items-center gap-2 font-semibold transition disabled:opacity-60"
        :disabled="isLoading"
      >
        <template v-if="!isLoading">
          <LogOut class="w-5 h-5" />
          <span>Logout</span>
        </template>
        <template v-else>
          <svg
            class="animate-spin h-4 w-4 text-red-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <span>Logging out...</span>
        </template>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/UserStore'
import { computed, ref } from 'vue'
import { Building2, LogOut } from 'lucide-vue-next' // 🏢 + Logout icon

const router = useRouter()
const userStore = useUserStore()

const user = computed(() => userStore.user)
const isLoading = ref(false)

const logout = async () => {
  isLoading.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    userStore.clearUser()
    router.push({ name: 'Login' })
  } catch (e) {
    console.error('Gagal logout:', e)
  } finally {
    isLoading.value = false
  }
}
</script>
