<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div
        class="bg-white rounded-lg shadow-sm border p-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Manajemen Permission</h1>
          <p class="text-gray-600 mt-1">Kelola permission untuk hak akses pengguna</p>
        </div>
        <router-link
          v-if="hasPermission('create-permissions')"
          to="/permissions/create"
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
        >
          <PlusIcon class="w-5 h-5 mr-2" />
          Tambah Permission
        </router-link>
      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div
          class="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <h3 class="text-lg font-semibold text-gray-900">Daftar Permission</h3>
          <!-- Filter -->
          <div class="w-full sm:w-64">
            <input
              v-model="search"
              type="text"
              placeholder="Cari Permission"
              class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
        <div class="overflow-x-auto max-h-[70vh] overflow-y-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                >
                  Nama Permission
                </th>
                <th
                 v-if="hasPermission('edit-permissions')"
                  class="px-6 py-3 text-right text-xs font-medium text-blue-500 uppercase tracking-wider"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(item, index) in filteredPermissions"
                :key="item.id"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="px-6 py-4 text-sm text-gray-900">{{ index + 1 }}</td>
                <td class="px-6 py-4 text-sm text-gray-900">{{ item.name }}</td>
                <td class="px-6 py-4 text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <router-link
                      v-if="hasPermission('edit-permissions')"
                      :to="`/permissions/${item.id}/edit`"
                      class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition"
                    >
                      Edit
                    </router-link>
                    <button
                      v-if="hasPermission('delete-permissions')"
                      @click="deletePermission(item.id)"
                      class="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 transition"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredPermissions.length === 0 && !loading">
                <td colspan="3" class="px-6 py-12 text-center text-sm text-gray-500">
                  Tidak ada permission ditemukan.
                </td>
              </tr>
              <tr v-if="loading">
                <td colspan="3" class="px-6 py-12 text-center text-sm text-gray-500">
                  Memuat data...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from '@/services/api'
import { useUserStore } from '../stores/UserStore'
import Swal from 'sweetalert2'
import { Plus as PlusIcon, X as XIcon } from 'lucide-vue-next'

const userStore = useUserStore()
const hasPermission = (perm) => userStore.permissions.includes(perm)

const permissions = ref([])
const loading = ref(false)
const search = ref('')

const fetchPermissions = async () => {
  loading.value = true
  try {
    const res = await axios.get('/permissions')
    permissions.value = res.data.data || res.data || []
  } catch (error) {
    console.error(error)
    Swal.fire({
      icon: 'error',
      title: 'Gagal!',
      text: 'Gagal memuat data permission. Silakan coba lagi.',
    })
  } finally {
    loading.value = false
  }
}

const deletePermission = async (id) => {
  Swal.fire({
    title: 'Apakah Anda yakin?',
    text: 'Permission ini akan dihapus permanen!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
  }).then(async (result) => {
    if (result.isConfirmed) {
      loading.value = true
      try {
        await axios.delete(`/permissions/${id}`)
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Permission berhasil dihapus.',
          timer: 1500,
          showConfirmButton: false,
        })
        fetchPermissions()
      } catch (error) {
        console.error(error)
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: 'Permission gagal dihapus. Silakan coba lagi.',
        })
      } finally {
        loading.value = false
      }
    }
  })
}
// Filter berdasarkan search
const filteredPermissions = computed(() => {
  return permissions.value.filter((item) =>
    item.name.toLowerCase().includes(search.value.toLowerCase()),
  )
})

onMounted(() => {
  fetchPermissions()
})
</script>
