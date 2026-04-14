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

    <!-- User Info + Notification + Logout Dropdown -->
    <div class="flex items-center gap-4">
      <!-- Notification Icon -->
      <div class="relative" ref="notifDropdownRef">
        <button
          @click="toggleNotifDropdown"
          class="relative p-2 rounded-full hover:bg-gray-100 transition flex items-center justify-center text-gray-600"
        >
          <Bell class="w-6 h-6" />
          <span 
            v-if="totalPendingCount > 0" 
            class="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
          >
            {{ totalPendingCount }}
          </span>
        </button>

        <!-- Notification Dropdown -->
        <div
          v-if="isNotifOpen"
          class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border py-2 z-50 max-h-[80vh] overflow-y-auto"
        >
          <div class="px-4 py-2 border-b font-semibold text-gray-700 flex justify-between items-center bg-white sticky top-0 z-10">
            <span>Notifikasi</span>
            <span class="text-xs font-normal text-gray-500">Persetujuan Pending</span>
          </div>
          
          <div v-if="totalPendingCount === 0" class="px-4 py-6 text-sm text-gray-500 text-center">
            Tidak ada permintaan baru
          </div>
          
          <div v-else class="flex flex-col">
            <template v-if="pendingBorrowings.length > 0">
              <div class="px-4 flex items-center pt-2 pb-1 text-xs font-bold text-gray-500 uppercase bg-gray-50 border-b">
                Peminjaman Barang
              </div>
              <div
                v-for="b in pendingBorrowings"
                :key="'b-'+b.id"
                class="px-4 py-3 border-b last:border-b-0 hover:bg-gray-100 cursor-pointer transition"
                @click="goToBorrowing(b.id)"
              >
                <div class="flex justify-between items-start">
                  <p class="text-sm font-medium text-gray-800 line-clamp-1 pr-2">
                    {{ b.item?.name || 'Barang' }}
                  </p>
                  <span class="bg-yellow-100 text-yellow-800 text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0">
                    Baru
                  </span>
                </div>
                <p class="text-xs text-gray-500 mt-1">
                  Oleh: <span class="font-medium text-gray-700">{{ b.user?.name || '-' }}</span>
                </p>
              </div>
            </template>
            
            <template v-if="pendingRoomLoans.length > 0">
              <div class="px-4 flex items-center pt-2 pb-1 text-xs font-bold text-gray-500 uppercase bg-gray-50 border-t border-b">
                Peminjaman Ruangan
              </div>
              <div
                v-for="r in pendingRoomLoans"
                :key="'r-'+r.id"
                class="px-4 py-3 border-b last:border-b-0 hover:bg-gray-100 cursor-pointer transition"
                @click="goToRoomLoan(r.id)"
              >
                <div class="flex justify-between items-start">
                  <p class="text-sm font-medium text-gray-800 line-clamp-1 pr-2">
                    {{ r.room?.name || 'Ruangan' }}
                  </p>
                  <span class="bg-yellow-100 text-yellow-800 text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0">
                    Baru
                  </span>
                </div>
                <p class="text-xs text-gray-500 mt-1">
                  Oleh: <span class="font-medium text-gray-700">{{ r.borrower_name || '-' }}</span>
                </p>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- User Dropdown (existing) -->
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
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/UserStore'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { Building2, LogOut, ChevronDown, Bell } from 'lucide-vue-next'
import axios from '@/services/api'

const router = useRouter()
const userStore = useUserStore()

const user = computed(() => userStore.user)
const isLoading = ref(false)
const isOpen = ref(false)
const dropdownRef = ref(null)

const isNotifOpen = ref(false)
const notifDropdownRef = ref(null)
const pendingBorrowings = ref([])
const pendingRoomLoans = ref([])
let fetchInterval = null

const userInitials = computed(() => {
  return user.value?.name ? user.value.name.charAt(0).toUpperCase() : 'U'
})

const totalPendingCount = computed(() => {
  return pendingBorrowings.value.length + pendingRoomLoans.value.length
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) isNotifOpen.value = false
}

const toggleNotifDropdown = () => {
  isNotifOpen.value = !isNotifOpen.value
  if (isNotifOpen.value) isOpen.value = false
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
  if (notifDropdownRef.value && !notifDropdownRef.value.contains(event.target)) {
    isNotifOpen.value = false
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

const fetchPendingRequests = async () => {
  // Hanya fetch jika user memiliki token & terdaftar
  if (!userStore.token) return
  
  try {
    // Jalankan kedua promise secara paralel tapi jika salah satu error, tangkap error masing-masing tanpa blokir yang lain
    const [resBorrowings, resRooms] = await Promise.all([
      axios.get('/borrowings').catch(() => ({ data: { data: [] } })),
      axios.get('/room-loans').catch(() => ({ data: [] }))
    ])
    
    const allBorrowings = resBorrowings?.data?.data || []
    pendingBorrowings.value = allBorrowings.filter(b => b.approval_status === 'pending')
    
    const allRooms = resRooms?.data || []
    pendingRoomLoans.value = allRooms.filter(r => r.status === 'pending')
  } catch (error) {
    console.error('Error fetching pending requests:', error)
  }
}

const goToBorrowing = (id) => {
  router.push(`/borrowings/${id}/edit`)
  isNotifOpen.value = false
}

const goToRoomLoan = (id) => {
  router.push(`/room-loans/${id}/edit`)
  isNotifOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  fetchPendingRequests()
  fetchInterval = setInterval(fetchPendingRequests, 30000) // Update notifikasi otomatis setiap 30 detik
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (fetchInterval) clearInterval(fetchInterval)
})
</script>
