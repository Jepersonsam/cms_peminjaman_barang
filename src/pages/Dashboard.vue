<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p class="text-gray-600 mt-1">Ringkasan aktivitas dan data sistem</p>
      </div>

      <!-- Statistik Card Gabungan -->
      <div class="bg-white border rounded-xl shadow-sm p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Statistik Sistem</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="flex items-center space-x-4">
            <div class="bg-blue-100 text-blue-600 p-3 rounded-lg">
              📦
            </div>
            <div>
              <p class="text-sm text-gray-500">Total Item</p>
              <p class="text-2xl font-bold text-gray-800">{{ totalItems }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="bg-green-100 text-green-600 p-3 rounded-lg">
              ✅
            </div>
            <div>
              <p class="text-sm text-gray-500">Item Tersedia</p>
              <p class="text-2xl font-bold text-gray-800">{{ availableItems }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="bg-yellow-100 text-yellow-600 p-3 rounded-lg">
              🛡️
            </div>
            <div>
              <p class="text-sm text-gray-500">Total Role</p>
              <p class="text-2xl font-bold text-gray-800">{{ totalRoles }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="bg-indigo-100 text-indigo-600 p-3 rounded-lg">
              🔑
            </div>
            <div>
              <p class="text-sm text-gray-500">Total Permission</p>
              <p class="text-2xl font-bold text-gray-800">{{ totalPermissions }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="bg-purple-100 text-purple-600 p-3 rounded-lg">
              🏦
            </div>
            <div>
              <p class="text-sm text-gray-500">Total Room</p>
              <p class="text-2xl font-bold text-gray-800">{{ totalRooms }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="bg-orange-100 text-orange-600 p-3 rounded-lg">
              📅
            </div>
            <div>
              <p class="text-sm text-gray-500">Total Ruangan Dipinjam</p>
              <p class="text-2xl font-bold text-gray-800">{{ totalRoomsLoan }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="bg-teal-100 text-teal-600 p-3 rounded-lg">
              📋
            </div>
            <div>
              <p class="text-sm text-gray-500">Total Peminjaman Barang</p>
              <p class="text-2xl font-bold text-gray-800">{{ totalBorrowings }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="bg-pink-100 text-pink-600 p-3 rounded-lg">
              📊
            </div>
            <div>
              <p class="text-sm text-gray-500">Total Kategori</p>
              <p class="text-2xl font-bold text-gray-800">{{ totalCategories }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Grafik Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Grafik Status Item -->
        <div class="bg-white border rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Status Item</h3>
          <div v-if="loading" class="flex items-center justify-center h-64">
            <p class="text-gray-500">Memuat data...</p>
          </div>
          <div v-else class="h-64">
            <DoughnutChart :data="itemStatusData" />
          </div>
        </div>

        <!-- Grafik Kategori Item -->
        <div class="bg-white border rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Distribusi Kategori Item</h3>
          <div v-if="loading" class="flex items-center justify-center h-64">
            <p class="text-gray-500">Memuat data...</p>
          </div>
          <div v-else class="h-64">
            <BarChart :data="categoryData" />
          </div>
        </div>
      </div>

      <!-- Grafik Baris 2 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Grafik Status Peminjaman Barang -->
        <div class="bg-white border rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Status Peminjaman Barang</h3>
          <div v-if="loading" class="flex items-center justify-center h-64">
            <p class="text-gray-500">Memuat data...</p>
          </div>
          <div v-else class="h-64">
            <PieChart :data="borrowingStatusData" />
          </div>
        </div>

        <!-- Grafik Status Peminjaman Ruangan -->
        <div class="bg-white border rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Status Peminjaman Ruangan</h3>
          <div v-if="loading" class="flex items-center justify-center h-64">
            <p class="text-gray-500">Memuat data...</p>
          </div>
          <div v-else class="h-64">
            <PieChart :data="roomLoanStatusData" />
          </div>
        </div>
      </div>

      <!-- Grafik Line untuk Trend (jika ada data) -->
      <div class="bg-white border rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Trend Peminjaman (7 Hari Terakhir)</h3>
        <div v-if="loading" class="flex items-center justify-center h-64">
          <p class="text-gray-500">Memuat data...</p>
        </div>
        <div v-else class="h-64">
          <LineChart :data="trendData" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '../services/api'
import DoughnutChart from '../components/charts/DoughnutChart.vue'
import BarChart from '../components/charts/BarChart.vue'
import PieChart from '../components/charts/PieChart.vue'
import LineChart from '../components/charts/LineChart.vue'

const loading = ref(true)
const totalItems = ref(0)
const availableItems = ref(0)
const borrowedItems = ref(0)
const totalRoles = ref(0)
const totalPermissions = ref(0)
const totalRooms = ref(0)
const totalRoomsLoan = ref(0)
const totalBorrowings = ref(0)
const totalCategories = ref(0)
const items = ref([])
const categories = ref([])
const borrowings = ref([])
const roomLoans = ref([])

// Grafik Status Item (Doughnut)
const itemStatusData = computed(() => {
  return {
    labels: ['Tersedia', 'Dipinjam'],
    datasets: [
      {
        label: 'Jumlah Item',
        data: [availableItems.value, borrowedItems.value],
        backgroundColor: ['#10b981', '#f59e0b'],
        borderColor: ['#059669', '#d97706'],
        borderWidth: 2,
      },
    ],
  }
})

// Grafik Kategori Item (Bar)
const categoryData = computed(() => {
  const categoryCounts = {}
  items.value.forEach((item) => {
    if (item.category) {
      const catName = item.category.name
      categoryCounts[catName] = (categoryCounts[catName] || 0) + 1
    }
  })

  const labels = Object.keys(categoryCounts)
  const data = Object.values(categoryCounts)

  return {
    labels: labels.length > 0 ? labels : ['Tidak Ada Kategori'],
    datasets: [
      {
        label: 'Jumlah Item',
        data: data.length > 0 ? data : [0],
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6',
          '#ec4899',
          '#06b6d4',
        ],
        borderColor: [
          '#2563eb',
          '#059669',
          '#d97706',
          '#dc2626',
          '#7c3aed',
          '#db2777',
          '#0891b2',
        ],
        borderWidth: 1,
      },
    ],
  }
})

// Grafik Status Peminjaman Barang (Pie)
const borrowingStatusData = computed(() => {
  const statusCounts = {
    pending: 0,
    approved: 0,
    rejected: 0,
    returned: 0,
  }

  borrowings.value.forEach((borrowing) => {
    const status = borrowing.status || 'pending'
    if (statusCounts.hasOwnProperty(status)) {
      statusCounts[status]++
    } else {
      statusCounts.returned++
    }
  })

  return {
    labels: ['Menunggu', 'Disetujui', 'Ditolak', 'Dikembalikan'],
    datasets: [
      {
        label: 'Jumlah Peminjaman',
        data: [
          statusCounts.pending,
          statusCounts.approved,
          statusCounts.rejected,
          statusCounts.returned,
        ],
        backgroundColor: ['#f59e0b', '#10b981', '#ef4444', '#3b82f6'],
        borderColor: ['#d97706', '#059669', '#dc2626', '#2563eb'],
        borderWidth: 2,
      },
    ],
  }
})

// Grafik Status Peminjaman Ruangan (Pie)
const roomLoanStatusData = computed(() => {
  const statusCounts = {
    pending: 0,
    approved: 0,
    rejected: 0,
  }

  roomLoans.value.forEach((loan) => {
    const status = loan.status || 'pending'
    if (statusCounts.hasOwnProperty(status)) {
      statusCounts[status]++
    }
  })

  return {
    labels: ['Menunggu', 'Disetujui', 'Ditolak'],
    datasets: [
      {
        label: 'Jumlah Peminjaman',
        data: [statusCounts.pending, statusCounts.approved, statusCounts.rejected],
        backgroundColor: ['#f59e0b', '#10b981', '#ef4444'],
        borderColor: ['#d97706', '#059669', '#dc2626'],
        borderWidth: 2,
      },
    ],
  }
})

// Grafik Trend (Line)
const trendData = computed(() => {
  // Generate data untuk 7 hari terakhir
  const days = []
  const borrowingCounts = []
  const roomLoanCounts = []

  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dayName = date.toLocaleDateString('id-ID', { weekday: 'short' })
    days.push(dayName)

    // Hitung peminjaman per hari (simulasi - bisa disesuaikan dengan data real)
    const dayStart = new Date(date)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(date)
    dayEnd.setHours(23, 59, 59, 999)

    const borrowingCount = borrowings.value.filter((b) => {
      if (!b.created_at) return false
      const createdDate = new Date(b.created_at)
      return createdDate >= dayStart && createdDate <= dayEnd
    }).length

    const roomLoanCount = roomLoans.value.filter((r) => {
      if (!r.created_at) return false
      const createdDate = new Date(r.created_at)
      return createdDate >= dayStart && createdDate <= dayEnd
    }).length

    borrowingCounts.push(borrowingCount)
    roomLoanCounts.push(roomLoanCount)
  }

  return {
    labels: days,
    datasets: [
      {
        label: 'Peminjaman Barang',
        data: borrowingCounts,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Peminjaman Ruangan',
        data: roomLoanCounts,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  }
})

const loadDashboardData = async () => {
  loading.value = true
  try {
    const [
      itemsRes,
      rolesRes,
      permissionsRes,
      roomsRes,
      roomsloanRes,
      borrowingsRes,
      categoriesRes,
    ] = await Promise.all([
      axios.get('/items'),
      axios.get('/roles'),
      axios.get('/permissions'),
      axios.get('/rooms'),
      axios.get('/room-loans'),
      axios.get('/borrowings'),
      axios.get('/categories'),
    ])

    items.value = itemsRes.data.data || []
    categories.value = categoriesRes.data.data || categoriesRes.data || []
    borrowings.value = borrowingsRes.data.data || borrowingsRes.data || []
    roomLoans.value = roomsloanRes.data.data || roomsloanRes.data || []

    totalItems.value = items.value.length
    availableItems.value = items.value.filter((i) => i.is_available).length
    borrowedItems.value = items.value.filter((i) => !i.is_available).length
    totalRoles.value = rolesRes.data.length
    totalPermissions.value = permissionsRes.data.length
    totalRooms.value = roomsRes.data.data?.length || roomsRes.data.length || 0
    totalRoomsLoan.value = roomLoans.value.length
    totalBorrowings.value = borrowings.value.length
    totalCategories.value = categories.value.length
  } catch (error) {
    console.error('Gagal memuat data dashboard:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>
