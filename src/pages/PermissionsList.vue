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
        <button
          v-if="hasPermission('create-permissions')"
          @click="showForm"
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
          Tambah Permission
        </button>
      </div>

      <!-- Form Tambah/Edit -->
      <div
        v-if="formVisible"
        class="bg-white rounded-xl shadow p-6 my-6 border border-gray-200 max-w-xl"
      >
        <h2 class="text-xl font-semibold mb-4 text-sky-700">
          {{ editing ? 'Edit' : 'Tambah' }} Permission
        </h2>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1">Nama Permission</label>
            <input
              v-model="form.name"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500"
              placeholder="Contoh: create-user, edit-post"
              required
            />
          </div>
          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="cancelForm"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition disabled:opacity-50"
            >
              {{ loading ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Filter -->
      <div class="bg-white rounded-lg border p-4 mb-4 max-w-md">
        <label class="block text-sm font-medium text-gray-700 mb-1">Cari Permission</label>
        <input
          v-model="search"
          type="text"
          placeholder="Masukkan nama permission"
          class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Daftar Permission</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
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
                <!-- <th v-if="hasPermission('edit-permissions')" class="px-6 py-3 text-right text-xs font-medium text-blue-500 uppercase tracking-wider">Aksi</th> -->
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
                    <button
                      v-if="hasPermission('edit-permissions')"
                      @click="editPermission(item)"
                      class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition"
                    >
                      Edit
                    </button>
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

const userStore = useUserStore()
const hasPermission = (perm) => userStore.permissions.includes(perm)

const permissions = ref([])
const formVisible = ref(false)
const editing = ref(false)
const loading = ref(false)
const search = ref('')
const form = ref({ id: null, name: '' })

const fetchPermissions = async () => {
  loading.value = true
  try {
    const res = await axios.get('/permissions')
    permissions.value = res.data.data || res.data || []
  } catch (error) {
    console.error(error)
    alert('Gagal memuat data permission.')
  } finally {
    loading.value = false
  }
}

const showForm = () => {
  editing.value = false
  form.value = { id: null, name: '' }
  formVisible.value = true
}

const cancelForm = () => {
  formVisible.value = false
  form.value = { id: null, name: '' }
}

const submitForm = async () => {
  loading.value = true
  try {
    if (editing.value) {
      await axios.put(`/permissions/${form.value.id}`, { name: form.value.name })
      alert('Permission berhasil diperbarui.')
    } else {
      await axios.post('/permissions', { name: form.value.name })
      alert('Permission berhasil ditambahkan.')
    }
    fetchPermissions()
    cancelForm()
  } catch (error) {
    console.error(error)
    alert('Gagal menyimpan data.')
  } finally {
    loading.value = false
  }
}

const editPermission = (item) => {
  editing.value = true
  form.value = { ...item }
  formVisible.value = true
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
