<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div
        class="bg-white rounded-lg shadow-sm border p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Daftar Ruangan</h2>
          <p class="text-gray-600 mt-1">Kelola data ruangan yang tersedia</p>
        </div>
        <router-link
          v-if="hasPermission('create-rooms')"
          to="/rooms/create"
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
          Tambah Ruangan
        </router-link>
      </div>

      <!-- Filter -->
      <div class="bg-white border rounded-lg p-4 mb-4 flex flex-col sm:flex-row gap-4 sm:items-end">
        <div class="w-full sm:w-1/3">
          <label class="block text-sm font-medium text-gray-700">Cari Nama Ruangan</label>
          <input
            type="text"
            v-model="search"
            placeholder="Nama Ruangan"
            class="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div class="w-full sm:w-48">
          <label class="block text-sm font-medium text-gray-700">Status</label>
          <select
            v-model="statusFilter"
            class="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="semua">Semua</option>
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
          </select>
        </div>
      </div>

      <!-- Tabel -->
      <div class="bg-white rounded-lg shadow border overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
              >
                Nama
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
              >
                Lokasi
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
              >
                Kapasitas
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
              >
                Deskripsi
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="room in filteredRooms" :key="room.id">
              <td class="px-6 py-4">{{ room.name }}</td>
              <td class="px-6 py-4">{{ room.location }}</td>
              <td class="px-6 py-4">{{ room.capacity }}</td>
              <td class="px-6 py-4">{{ room.description || '-' }}</td>
              <td class="px-6 py-4">
                <span
                  :class="
                    room.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  "
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                >
                  {{ room.is_active ? 'Aktif' : 'Nonaktif' }}
                </span>
              </td>
              <td class="px-6 py-4 space-x-3">
                <router-link
                  v-if="hasPermission('edit-rooms')"
                  :to="`/rooms/${room.id}/edit`"
                  class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  v-if="hasPermission('delete-rooms')"
                  @click="deleteRoom(room.id)"
                  class="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Hapus
                </button>
              </td>
            </tr>
            <tr v-if="filteredRooms.length === 0">
              <td colspan="6" class="text-center py-6 text-gray-500">
                Tidak ada ruangan ditemukan
              </td>
            </tr>
          </tbody>
        </table>
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

const rooms = ref([])
const search = ref('')
const statusFilter = ref('semua')

const getRooms = async () => {
  const res = await axios.get('/rooms')
  rooms.value = res.data.data || res.data
}

const deleteRoom = async (id) => {
  Swal.fire({
    title: 'Apakah Anda yakin?',
    text: 'Ruangan ini akan dihapus permanen!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`/rooms/${id}`)
        getRooms()
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Ruangan berhasil dihapus.',
          timer: 1500,
          showConfirmButton: false,
        })
      } catch (err) {
        console.error('Error deleting room:', err)

        const errorMessage =
          err.response?.data?.message || 'Gagal menghapus ruangan. Silakan coba lagi.'

        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: errorMessage,
        })
      }
    }
  })
}
const filteredRooms = computed(() => {
  return rooms.value.filter((room) => {
    const cocokNama = room.name.toLowerCase().includes(search.value.toLowerCase())
    const cocokStatus =
      statusFilter.value === 'semua' ||
      (statusFilter.value === 'aktif' && room.is_active) ||
      (statusFilter.value === 'nonaktif' && !room.is_active)
    return cocokNama && cocokStatus
  })
})

onMounted(getRooms)
</script>
