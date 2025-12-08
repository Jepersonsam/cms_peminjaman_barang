<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div
        class="bg-white rounded-lg shadow-sm border p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Daftar Lokasi</h2>
          <p class="text-gray-600 mt-1">Kelola data lokasi yang tersedia</p>
        </div>
        <router-link
          v-if="hasPermission('create-location')"
          to="/locations/create"
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
          Tambah Lokasi
        </router-link>
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
                Secret ID
              </th>
              <th
                v-if="hasPermission('edit-location')"
                class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="location in locations" :key="location.id">
              <td class="px-6 py-4">{{ location.name }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <span class="break-all">{{ location.secret_id }}</span>
                  <button
                    @click="copyToClipboard(location.secret_id)"
                    class="text-gray-500 hover:text-blue-600"
                    title="Salin Secret ID"
                  >
                    <!-- Ikon salin -->
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-2 4h4a2 2 0 012 2v6a2 2 0 01-2 2h-8a2 2 0 01-2-2v-4"
                      />
                    </svg>
                  </button>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex gap-2">
                  <router-link
                    v-if="hasPermission('edit-location')"
                    :to="`/locations/${location.id}/edit`"
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
                    v-if="hasPermission('delete-location')"
                    @click="deleteLocation(location.id)"
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
                </div>
              </td>
            </tr>
            <tr v-if="locations.length === 0">
              <td colspan="3" class="text-center py-6 text-gray-500">Belum ada lokasi</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/services/api'
import { useUserStore } from '@/stores/UserStore'
import Swal from 'sweetalert2'

const userStore = useUserStore()
const hasPermission = (perm) => userStore.permissions.includes(perm)

const locations = ref([])

const fetchLocations = async () => {
  const res = await axios.get('/locations')
  locations.value = res.data.data || res.data
}

const deleteLocation = async (id) => {
  Swal.fire({
    title: 'Apakah Anda yakin?',
    text: 'Lokasi ini akan dihapus permanen!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`/locations/${id}`)
        fetchLocations()
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Lokasi berhasil dihapus.',
          timer: 1500,
          showConfirmButton: false,
        })
      } catch (err) {
        console.error('Error deleting location:', err)

        const errorMessage =
          err.response?.data?.message || 'Gagal menghapus lokasi. Silakan coba lagi.'

        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: errorMessage,
        })
      }
    }
  })
}
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Secret ID disalin ke clipboard.',
      timer: 1500,
      showConfirmButton: false,
    }) 
  } catch (err) {
    console.error('Failed to copy text: ', err)
    Swal.fire({
      icon: 'error',
      title: 'Gagal!',
      text: 'Gagal menyalin Secret ID. Silakan coba lagi.',
    })
  }
}

onMounted(fetchLocations)
</script>
