<template>
  <div class="bg-white shadow p-6 flex justify-between items-center z-20 sticky top-0">
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

    <!-- User Info + Logout Dropdown -->
    <div class="relative" ref="dropdownRef">
      <button
        @click="toggleDropdown"
        class="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition"
      >
        <div class="text-right hidden sm:block">
          <p v-if="user" class="text-sm font-semibold text-gray-800">{{ user.name }}</p>
          <p class="text-xs text-gray-500">Administrator</p>
        </div>
        <div
          class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold"
        >
          {{ userInitials }}
        </div>
        <ChevronDown
          class="w-4 h-4 text-gray-500 transition-transform"
          :class="{ 'rotate-180': isOpen }"
        />
      </button>

      <!-- Dropdown Menu -->
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50"
      >
        <button
          @click="logout"
          class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
          :disabled="isLoading"
        >
          <template v-if="!isLoading">
            <LogOut class="w-4 h-4" />
            Logout
          </template>
          <template v-else>
            <span
              class="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full"
            ></span>
            Logging out...
          </template>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/UserStore'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { Building2, LogOut, ChevronDown } from 'lucide-vue-next'

const router = useRouter()
const userStore = useUserStore()

const user = computed(() => userStore.user)
const isLoading = ref(false)
const isOpen = ref(false)
const dropdownRef = ref(null)

const userInitials = computed(() => {
  return user.value?.name ? user.value.name.charAt(0).toUpperCase() : 'U'
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

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

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
