<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Manajemen Kategori</h1>
            <p class="text-gray-600 mt-1">Kelola kategori item</p>
          </div>
          <router-link
            v-if="hasPermission('create-items')"
            to="/categories/create"
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
            Tambah Kategori
          </router-link>
        </div>
      </div>

      <!-- Filter -->
      <div class="bg-white rounded-lg shadow-sm border mb-6">
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div class="w-full sm:w-1/3">
            <label class="block text-sm font-medium text-gray-700 mb-1">Cari Kategori</label>
            <input
              type="text"
              v-model="filters.search"
              class="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nama kategori..."
            />
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div v-if="loading" class="p-6 text-gray-600">Memuat data...</div>
        <div v-else-if="error" class="p-6 text-red-600">{{ error }}</div>

        <div v-else class="overflow-x-auto max-h-[70vh] overflow-y-auto">
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
                  Nama Kategori
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                >
                  Deskripsi
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                >
                  Jumlah Item
                </th>
                <th
                  v-if="hasPermission('edit-items')"
                  class="px-6 py-3 text-right text-xs font-medium text-blue-500 uppercase tracking-wider"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(category, index) in filteredCategories"
                :key="category.id"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="px-6 py-4 text-sm text-gray-900">{{ index + 1 }}</td>
                <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ category.name }}</td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  {{ category.description || '-' }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {{ category.items_count || 0 }} item
                  </span>
                </td>
                <td class="px-6 py-4 text-right text-sm font-medium">
                  <div class="flex justify-end space-x-3">
                    <router-link
                      v-if="hasPermission('edit-items')"
                      :to="`/categories/${category.id}/edit`"
                      class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition"
                    >
                      Edit
                    </router-link>
                    <button
                      v-if="hasPermission('delete-items')"
                      @click="remove(category.id)"
                      class="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="!loading && filteredCategories.length === 0" class="text-center py-12">
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
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada kategori ditemukan</h3>
          <p class="mt-1 text-sm text-gray-500">Coba ubah filter atau tambahkan kategori baru.</p>
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

const categories = ref([])
const loading = ref(true)
const error = ref(null)

const userStore = useUserStore()
const hasPermission = (perm) => userStore.permissions.includes(perm)

const filters = ref({
  search: '',
})

const filteredCategories = computed(() => {
  return categories.value.filter((category) => {
    const search = filters.value.search.toLowerCase()
    return (
      category.name?.toLowerCase().includes(search) ||
      category.description?.toLowerCase().includes(search)
    )
  })
})

const fetchCategories = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await axios.get('/categories')
    categories.value = res.data.data || res.data || []
  } catch (err) {
    console.error(err)
    if (err.response?.status === 403 || err.response?.status === 401) {
      error.value = 'Anda tidak memiliki izin untuk mengakses data kategori.'
    } else if (err.response?.data?.message) {
      error.value = err.response.data.message
    } else {
      error.value = 'Gagal memuat data kategori.'
    }
  } finally {
    loading.value = false
  }
}

const remove = async (id) => {
  Swal.fire({
    title: 'Apakah Anda yakin?',
    text: 'Kategori ini akan dihapus permanen! Item yang terkait akan kehilangan kategori.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`/categories/${id}`)
        categories.value = categories.value.filter((c) => c.id !== id)

        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Kategori berhasil dihapus.',
          timer: 1500,
          showConfirmButton: false,
        })
      } catch (err) {
        console.error(err)

        const errorMessage =
          err.response?.data?.message || 'Gagal menghapus kategori. Silakan coba lagi.'

        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: errorMessage,
        })
      }
    }
  })
}

onMounted(fetchCategories)
</script>
