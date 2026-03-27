<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm border p-6 mb-6 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Manajemen Peminjaman Barang</h1>
          <p class="text-gray-600 mt-1">Kelola data peminjaman barang</p>
        </div>

        <!-- Kumpulan Tombol di Kanan -->
        <div class="flex items-center space-x-4">
          <!-- Tombol Export -->
          <div ref="exportWrapper" class="relative inline-block text-left">
            <button
              @click="showExport = !showExport"
              class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Export
              <svg class="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            <!-- Dropdown menu -->
            <div
              v-if="showExport"
              class="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10"
            >
              <button
                @click="exportPDF"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Export PDF
              </button>
              <button
                @click="exportExcel"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Export Excel
              </button>
            </div>
          </div>
          <!-- Tombol Tambah Peminjaman -->
          <router-link
            v-if="hasPermission('create-borrowing')"
            to="/borrowings/create"
            class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Tambah Peminjaman
          </router-link>
        </div>
      </div>

      <!-- Filter -->
      <div class="bg-white rounded-lg shadow-sm border p-4 mb-6 flex flex-col sm:flex-row gap-4">
        <input
          v-model="search"
          type="text"
          placeholder="Cari nama peminjam / barang"
          class="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
        <select
          v-model="statusFilter"
          class="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="">Semua Status</option>
          <option value="borrowed">Dipinjam</option>
          <option value="returned">Dikembalikan</option>
        </select>
        <select
          v-model="approvalFilter"
          class="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="">Semua Persetujuan</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <!-- Tabel -->
      <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Daftar Peminjaman</h3>
        </div>

        <div v-if="loading" class="p-6 text-gray-500">Memuat data...</div>
        <div v-else-if="error" class="p-6 text-red-500">{{ error }}</div>

        <div v-else class="overflow-x-auto max-h-[70vh] overflow-y-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">
                  Peminjam
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">
                  Barang
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">
                  Tgl Pinjam
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">
                  Tgl Kembali
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">
                  Persetujuan
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-blue-500 uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="borrowing in filteredBorrowings"
                :key="borrowing.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 text-sm text-gray-900">{{ borrowing.user?.name || '-' }}</td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  <div class="font-medium">{{ borrowing.item?.name || '-' }}</div>
                  <div v-if="borrowing.item?.serial_code" class="text-xs text-gray-500 mt-0.5">
                    {{ borrowing.item.serial_code }}
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-700">
                  {{ formatDate(borrowing.borrow_date) }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-700">
                  {{ formatDate(borrowing.return_date) }}
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="
                      borrowing.is_returned
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    "
                    class="px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ borrowing.is_returned ? 'Dikembalikan' : 'Dipinjam' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="{
                      'bg-yellow-100 text-yellow-800': borrowing.approval_status === 'pending',
                      'bg-green-100 text-green-800': borrowing.approval_status === 'approved',
                      'bg-red-100 text-red-800': borrowing.approval_status === 'rejected',
                    }"
                    class="px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ borrowing.approval_status || '-' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex justify-end space-x-2">
                    <!-- Approve -->
                    <!-- <button
                      v-if="borrowing.approval_status === 'pending'"
                      @click="approveBorrowing(borrowing.id)"
                      class="px-3 py-1 border border-green-300 text-xs rounded-md text-green-700 bg-green-50 hover:bg-green-100"
                    >
                      Setujui
                    </button>
                    Reject
                    <button
                      v-if="borrowing.approval_status === 'pending'"
                      @click="rejectBorrowing(borrowing.id)"
                      class="px-3 py-1 border border-red-300 text-xs rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                    >
                      Tolak
                    </button> -->
                    <!-- Edit -->
                    <router-link
                      v-if="hasPermission('edit-borrowing')"
                      :to="`/borrowings/${borrowing.id}/edit`"
                      class="px-3 py-1 border border-yellow-300 text-xs rounded-md text-yellow-700 bg-yellow-50 hover:bg-yellow-100"
                    >
                      Edit
                    </router-link>
                    <!-- Kirim Notifikasi Pengingat -->
                    <button
                      v-if="shouldShowReminderButton(borrowing)"
                      @click="sendReminder(borrowing.id)"
                      class="inline-flex items-center px-3 py-1.5 border border-blue-300 shadow-sm text-xs font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
                      :disabled="sendingReminder === borrowing.id"
                    >
                      <svg
                        v-if="sendingReminder !== borrowing.id"
                        class="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <svg v-else class="animate-spin w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24">
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        />
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      {{ sendingReminder === borrowing.id ? 'Mengirim...' : 'Kirim Notifikasi' }}
                    </button>
                    <button
                      v-if="!borrowing.is_returned"
                      @click="markReturned(borrowing.id)"
                      class="inline-flex items-center px-3 py-1.5 border border-green-300 shadow-sm text-xs font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100"
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Kembalikan
                    </button>
                    <!-- Hapus -->
                    <button
                      v-if="hasPermission('delete-borrowing')"
                      @click="remove(borrowing.id)"
                      class="px-3 py-1 border border-red-300 text-xs rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty -->
        <div v-if="!loading && filteredBorrowings.length === 0" class="text-center py-12">
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada peminjaman ditemukan</h3>
          <p class="mt-1 text-sm text-gray-500">Coba ubah kata kunci atau filter.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from '@/services/api'
import { useUserStore } from '@/stores/UserStore'
import Swal from 'sweetalert2'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

const userStore = useUserStore()
const hasPermission = (perm) => userStore.permissions.includes(perm)

const borrowings = ref([])
const loading = ref(true)
const error = ref(null)
const search = ref('')
const statusFilter = ref('')
const approvalFilter = ref('')

const showExport = ref(false)
const exportWrapper = ref(null)
const sendingReminder = ref(null)

const fetchBorrowings = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await axios.get('/borrowings')
    borrowings.value = res.data.data
  } catch (err) {
    error.value = 'Gagal memuat data.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const filteredBorrowings = computed(() => {
  return borrowings.value
    .filter((b) => {
      const keyword = search.value.toLowerCase()
      const matchKeyword =
        b.user?.name?.toLowerCase().includes(keyword) ||
        b.item?.name?.toLowerCase().includes(keyword) ||
        b.item?.serial_code?.toLowerCase().includes(keyword)

      const matchStatus =
        statusFilter.value === '' ||
        (statusFilter.value === 'borrowed' && !b.is_returned) ||
        (statusFilter.value === 'returned' && b.is_returned)

      const matchApproval =
        approvalFilter.value === '' || b.approval_status === approvalFilter.value

      return matchKeyword && matchStatus && matchApproval
    })
    .sort((a, b) => b.id - a.id)
})

const formatDate = (dateStr) => (dateStr ? dateStr.slice(0, 10) : '-')

// Cek apakah button notifikasi harus ditampilkan (1 hari sebelum return_date)
const shouldShowReminderButton = (borrowing) => {
  // Hanya tampilkan jika:
  // 1. Belum dikembalikan
  // 2. Status approved
  // 3. 1 hari sebelum atau pada tanggal return_date
  if (borrowing.is_returned || borrowing.approval_status !== 'approved') {
    return false
  }

  if (!borrowing.return_date) {
    return false
  }

  const returnDate = new Date(borrowing.return_date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  returnDate.setHours(0, 0, 0, 0)

  // Hitung selisih hari
  const diffTime = returnDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  // Tampilkan jika 1 hari sebelum atau pada tanggal return_date (diffDays <= 1)
  return diffDays <= 1 && diffDays >= 0
}

// Kirim notifikasi pengingat
const sendReminder = async (id) => {
  sendingReminder.value = id
  try {
    const res = await axios.post(`/borrowings/${id}/send-return-reminder`)

    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: res.data.message || 'Notifikasi pengingat berhasil dikirim ke email peminjam.',
      timer: 2000,
      showConfirmButton: false,
    })
  } catch (err) {
    console.error('Error sending reminder:', err)

    const errorMessage =
      err.response?.data?.message || 'Gagal mengirim notifikasi pengingat. Silakan coba lagi.'

    Swal.fire({
      icon: 'error',
      title: 'Gagal!',
      text: errorMessage,
    })
  } finally {
    sendingReminder.value = null
  }
}

const markReturned = async (id) => {
  const result = await Swal.fire({
    title: 'Konfirmasi Pengembalian',
    text: 'Tandai peminjaman sebagai sudah dikembalikan?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, tandai dikembalikan',
    cancelButtonText: 'Batal',
  })

  if (!result.isConfirmed) return

  try {
    await axios.put(`/borrowings/${id}`, { is_returned: true })
    await fetchBorrowings()

    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Barang berhasil ditandai sebagai dikembalikan.',
      timer: 2000,
      showConfirmButton: false,
    })
  } catch (err) {
    console.error('Error marking as returned:', err)

    const errorMessage =
      err.response?.data?.message || 'Gagal mengembalikan barang. Silakan coba lagi.'

    Swal.fire({
      icon: 'error',
      title: 'Gagal!',
      text: errorMessage,
    })
  }
}

const exportPDF = () => {
  const doc = new jsPDF()
  doc.text('Daftar Peminjaman', 14, 15)
  autoTable(doc, {
    head: [['#', 'Peminjam', 'Barang', 'Tgl Pinjam', 'Tgl Kembali', 'Status', 'Persetujuan']],
    body: filteredBorrowings.value.map((b, idx) => [
      idx + 1,
      b.user?.name || '-',
      b.item?.serial_code ? `${b.item?.name || '-'} (${b.item.serial_code})` : b.item?.name || '-',
      formatDate(b.borrow_date),
      formatDate(b.return_date),
      b.is_returned ? 'Dikembalikan' : 'Dipinjam',
      b.approval_status || '-',
    ]),
    startY: 25,
  })
  doc.save('borrowings.pdf')
  showExport.value = false
}

const exportExcel = () => {
  const ws = XLSX.utils.json_to_sheet(
    filteredBorrowings.value.map((b, idx) => ({
      No: idx + 1,
      Peminjam: b.user?.name || '-',
      Barang: b.item?.name || '-',
      'Kode Barang': b.item?.serial_code || '-',
      'Tgl Pinjam': formatDate(b.borrow_date),
      'Tgl Kembali': formatDate(b.return_date),
      Status: b.is_returned ? 'Dikembalikan' : 'Dipinjam',
      Persetujuan: b.approval_status || '-',
    })),
  )
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Peminjaman')
  XLSX.writeFile(wb, 'borrowings.xlsx')
  showExport.value = false
}

const onClickOutside = (e) => {
  if (exportWrapper.value && !exportWrapper.value.contains(e.target)) {
    showExport.value = false
  }
}

const remove = async (id) => {
  Swal.fire({
    title: 'Apakah Anda yakin?',
    text: 'Peminjaman ini akan dihapus permanen!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`/borrowings/${id}`)
        borrowings.value = borrowings.value.filter((b) => b.id !== id)

        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Peminjaman berhasil dihapus.',
          timer: 1500,
          showConfirmButton: false,
        })
      } catch (err) {
        console.error('Error deleting borrowing:', err)

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

onMounted(fetchBorrowings)
</script>
