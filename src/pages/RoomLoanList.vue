<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Manajemen Peminjaman Ruangan</h1>
            <p class="text-gray-600 mt-1">Kelola data peminjaman ruangan</p>
          </div>
          <router-link
            v-if="hasPermission('create-room-loans')"
            to="/room-loans/create"
            class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Tambah Peminjaman Ruangan
          </router-link>
        </div>
      </div>

      <!-- Filter -->
      <div class="bg-white rounded-lg shadow-sm border mb-6">
        <div
          class="px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-4 sm:items-end"
        >
          <div class="w-full sm:w-1/3">
            <label class="block text-sm font-medium text-gray-700 mb-1">Cari Nama Peminjam</label>
            <input
              type="text"
              v-model="filters.name"
              class="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nama Peminjam"
            />
          </div>
          <div class="w-full sm:w-1/3">
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              v-model="filters.status"
              class="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Semua</option>
              <option value="pending">Menunggu</option>
              <option value="approved">Disetujui</option>
              <option value="rejected">Ditolak</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div v-if="loading" class="p-6 text-gray-600">Memuat data...</div>
        <div v-else-if="error" class="p-6 text-red-600">{{ error }}</div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                >
                  Ruangan
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                >
                  Peminjam
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                >
                  Kontak
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                >
                  Waktu
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  v-if="hasPermission('edit-room-loans')"
                  class="px-6 py-3 text-right text-xs font-medium text-blue-500 uppercase tracking-wider"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="loan in filteredLoans"
                :key="loan.id"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="px-6 py-4 text-sm text-gray-900">{{ loan.room?.name || '-' }}</td>
                <td class="px-6 py-4 text-sm text-gray-900">{{ loan.borrower_name }}</td>
                <td class="px-6 py-4 text-sm text-gray-900">{{ loan.borrower_contact || '-' }}</td>
                <td class="px-6 py-4 text-sm text-gray-900">{{ loan.emails }}</td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  {{ formatDateTime(loan.start_time) }}<br />
                  <span class="text-gray-400">s/d</span><br />
                  {{ formatDateTime(loan.end_time) }}
                </td>
                <td class="px-6 py-4">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="{
                      'bg-green-100 text-green-800': loan.status === 'approved',
                      'bg-yellow-100 text-yellow-800': loan.status === 'pending',
                      'bg-red-100 text-red-800': loan.status === 'rejected',
                      'bg-gray-100 text-gray-800': loan.status === 'cancelled',
                    }"
                  >
                    {{ statusLabel(loan.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right text-sm font-medium">
                  <div class="flex justify-end space-x-3">
                    <router-link
                      v-if="hasPermission('edit-room-loans')"
                      :to="`/room-loans/${loan.id}/edit`"
                      class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition"
                    >
                      <svg
                        class="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </router-link>
                    <button
                      v-if="loan.status !== 'cancelled'"
                      @click="markCancelled(loan.id)"
                      class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-gray-50 hover:bg-gray-100"
                    >
                      <svg
                        class="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Batalkan
                    </button>
                    <button
                      v-if="hasPermission('delete-room-loans')"
                      @click="remove(loan.id)"
                      class="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                    >
                      <svg
                        class="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="!loading && filteredLoans.length === 0" class="text-center py-12">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada hasil ditemukan</h3>
          <p class="mt-1 text-sm text-gray-500">Coba ubah filter atau tambahkan data baru.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '../services/api'
import { useUserStore } from '../stores/UserStore'
import Swal from 'sweetalert2'

const userStore = useUserStore()
const hasPermission = (perm) => userStore.permissions.includes(perm)

const loans = ref([])
const loading = ref(true)
const error = ref(null)

const filters = ref({
  name: '',
  status: '',
})

const filteredLoans = computed(() => {
  return loans.value
    .filter((loan) => {
      const matchName = loan.borrower_name.toLowerCase().includes(filters.value.name.toLowerCase())
      const matchStatus = filters.value.status ? loan.status === filters.value.status : true
      return matchName && matchStatus
    })
    .sort((a, b) => b.id - a.id)
})

const fetchLoans = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await axios.get('/room-loans')
    loans.value = res.data
  } catch (err) {
    error.value = 'Gagal memuat data.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const formatDateTime = (dt) => {
  if (!dt) return '-'
  return dt.replace('T', ' ').slice(0, 16)
}

const statusLabel = (status) => {
  if (status === 'approved') return 'Disetujui'
  if (status === 'pending') return 'Menunggu'
  if (status === 'rejected') return 'Ditolak'
  if (status === 'cancelled') return 'Dibatalkan'
  return status
}

const markCancelled = async (id) => {
  const result = await Swal.fire({
    title: 'Konfirmasi Pembatalan',
    text: 'Batalkan peminjaman ruangan ini?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, batalkan',
    cancelButtonText: 'Batal',
  })

  if (!result.isConfirmed) return

  try {
    const res = await axios.get(`/room-loans/${id}`)
    const loan = res.data
    await axios.put(`/room-loans/${id}`, { ...loan, status: 'cancelled' })
    await fetchLoans()

    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Peminjaman berhasil dibatalkan!',
      timer: 2000,
      showConfirmButton: false,
    })
  } catch (err) {
    console.error(err)
    Swal.fire({
      icon: 'error',
      title: 'Gagal!',
      text: 'Gagal membatalkan peminjaman. Silakan coba lagi.',
    })
  }
}

const remove = async (id) => {
  Swal.fire({
    title: 'Apakah Anda yakin?',
    text: 'Peminjaman ruangan ini akan dihapus permanen!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`/room-loans/${id}`)
        loans.value = loans.value.filter((l) => l.id !== id)

        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Peminjaman ruangan berhasil dihapus.',
          timer: 1500,
          showConfirmButton: false,
        })
      } catch (err) {
        console.error(err)

        const errorMessage =
          err.response?.data?.message || 'Gagal menghapus peminjaman. Silakan coba lagi.'

        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: errorMessage,
        })
      }
    }
  })
}

onMounted(fetchLoans)
</script>
