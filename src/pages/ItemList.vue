<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="max-w-7xl mx-auto">
      <div class="bg-white rounded-lg shadow-sm border p-6 mb-6 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Manajemen Item</h1>
          <p class="text-gray-600 mt-1">Kelola data item yang dapat dipinjam</p>
        </div>
        <div class="flex items-center space-x-4">
          <!-- Export Dropdown -->
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

          <!-- Tambah Item -->
          <router-link
            v-if="hasPermission('create-items')"
            to="/items/create"
            class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Tambah Item
          </router-link>
        </div>
      </div>

      <!-- Filter -->
      <div class="bg-white rounded-lg shadow-sm border p-6 mb-6 grid md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status Ketersediaan</label>
          <select
            v-model="filters.availability"
            class="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Semua</option>
            <option value="available">Tersedia</option>
            <option value="borrowed">Dipinjam</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status Aktif</label>
          <select
            v-model="filters.active"
            class="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Semua</option>
            <option value="active">Aktif</option>
            <option value="inactive">Tidak Aktif</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Perlu Persetujuan</label>
          <select
            v-model="filters.approval"
            class="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Semua</option>
            <option value="yes">Ya</option>
            <option value="no">Tidak</option>
          </select>
        </div>
        <div class="md:col-span-1">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Cari Nama / Kode Serial</label
          >
          <input
            v-model="filters.search"
            type="text"
            placeholder="Cari..."
            class="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <!-- Tabel -->
      <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Daftar Item</h3>
        </div>

        <div class="overflow-x-auto">
          <table v-if="filteredItems.length" class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">
                  Nama
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">
                  Serial
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">
                  Kategori
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">
                  Aktif
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">
                  Persetujuan
                </th>
                <th
                  v-if="hasPermission('edit-items')"
                  class="px-6 py-3 text-right text-xs font-medium text-blue-500 uppercase"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(item, index) in filteredItems" :key="item.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm text-gray-900">{{ index + 1 }}</td>
                <td class="px-6 py-4">{{ item.name }}</td>
                <td class="px-6 py-4">
                  <span class="bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded-full text-xs">{{
                    item.serial_code
                  }}</span>
                </td>
                <td class="px-6 py-4">
                  <span
                    v-if="item.category"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {{ item.category.name }}
                  </span>
                  <span v-else class="text-gray-400 text-sm">-</span>
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="
                      item.is_available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    "
                    class="px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center"
                  >
                    <span
                      class="w-2 h-2 rounded-full mr-1"
                      :class="item.is_available ? 'bg-green-500' : 'bg-yellow-500'"
                    ></span>
                    {{ item.is_available ? 'Tersedia' : 'Dipinjam' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="
                      item.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    "
                    class="px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ item.is_active ? 'Aktif' : 'Tidak Aktif' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="
                      item.is_approval
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-600'
                    "
                    class="px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ item.is_approval ? 'Ya' : 'Tidak' }}
                  </span>
                </td>
                <td v-if="hasPermission('edit-items')" class="px-6 py-4 text-right">
                  <router-link
                    :to="`/items/edit/${item.id}`"
                    class="text-yellow-700 hover:text-yellow-900 text-sm font-medium mr-4"
                  >
                    Edit
                  </router-link>
                  <button
                    v-if="hasPermission('delete-items')"
                    @click="deleteItem(item.id)"
                    class="text-red-700 hover:text-red-900 text-sm font-medium"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Empty State -->
          <div v-else class="text-center py-12">
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
                d="M19 11H5M14 5l-7 7 7 7"
              />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada item</h3>
            <p class="mt-1 text-sm text-gray-500">Coba ubah filter atau tambah item baru.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import axios from '../services/api'
import { useUserStore } from '../stores/UserStore'
import Swal from 'sweetalert2'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

const items = ref([])
const filters = ref({
  availability: '',
  active: '',
  approval: '',
  search: '',
})

const showExport = ref(false)
const exportWrapper = ref(null)

const userStore = useUserStore()
const hasPermission = (perm) => userStore.permissions.includes(perm)

const getItems = async () => {
  try {
    const res = await axios.get('/items')
    items.value = res.data.data
  } catch (error) {
    console.error('Gagal memuat data items:', error)
  }
}

const deleteItem = async (id) => {
  Swal.fire({
    title: 'Apakah Anda yakin?',
    text: 'Item ini akan dihapus permanen!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`/items/${id}`)
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Item berhasil dihapus.',
          timer: 1500,
          showConfirmButton: false,
        })
        getItems()
      } catch (error) {
        console.error('Error deleting item:', error)
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Item gagal dihapus. Silakan coba lagi.',
        })
      }
    }
  })
}

const exportPDF = () => {
  const doc = new jsPDF()
  doc.text('Daftar Item', 14, 15)
  autoTable(doc, {
    head: [['#', 'Nama', 'Serial', 'Kategori', 'Status', 'Aktif', 'Persetujuan']],
    body: filteredItems.value.map((item, index) => [
      index + 1,
      item.name,
      item.serial_code,
      item.category?.name || '-',
      item.is_available ? 'Tersedia' : 'Dipinjam',
      item.is_active ? 'Aktif' : 'Tidak Aktif',
      item.is_approval ? 'Ya' : 'Tidak',
    ]),
    startY: 25,
  })
  doc.save('items.pdf')
  showExport.value = false
}

const exportExcel = () => {
  const ws = XLSX.utils.json_to_sheet(
    filteredItems.value.map((item, index) => ({
      No: index + 1,
      Nama: item.name,
      Serial: item.serial_code,
      Kategori: item.category?.name || '-',
      Status: item.is_available ? 'Tersedia' : 'Dipinjam',
      Aktif: item.is_active ? 'Aktif' : 'Tidak Aktif',
      Persetujuan: item.is_approval ? 'Ya' : 'Tidak',
    })),
  )
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Items')
  XLSX.writeFile(wb, 'items.xlsx')
  showExport.value = false
}

const filteredItems = computed(() => {
  return items.value.filter((item) => {
    const matchAvailability =
      !filters.value.availability ||
      (filters.value.availability === 'available' && item.is_available) ||
      (filters.value.availability === 'borrowed' && !item.is_available)

    const matchActive =
      !filters.value.active ||
      (filters.value.active === 'active' && item.is_active) ||
      (filters.value.active === 'inactive' && !item.is_active)

    const matchApproval =
      !filters.value.approval ||
      (filters.value.approval === 'yes' && item.is_approval) ||
      (filters.value.approval === 'no' && !item.is_approval)

    const search = filters.value.search.toLowerCase()
    const matchSearch =
      (item.name?.toLowerCase() ?? '').includes(search) ||
      (item.serial_code?.toLowerCase() ?? '').includes(search)

    return matchAvailability && matchActive && matchApproval && matchSearch
  })
})

const onClickOutside = (e) => {
  if (exportWrapper.value && !exportWrapper.value.contains(e.target)) {
    showExport.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
  getItems()
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>
