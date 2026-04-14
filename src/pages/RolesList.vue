<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Manajemen Role</h1>
            <p class="text-gray-600 mt-1">Kelola role dan hak akses pengguna</p>
          </div>
          <button
            v-if="hasPermission('create-roles')"
            @click="openModal(null)"
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
            Tambah Role
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
        <!-- Filter -->
        <div
          class="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center gap-4"
        >
          <div class="w-full sm:w-64">
            <input
              v-model="search"
              type="text"
              placeholder="Cari Nama Role"
              class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <!-- Table Data -->
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
                  Nama Role
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                >
                  Permissions
                </th>
                <th
                  v-if="hasPermission('edit-roles')"
                  class="px-6 py-3 text-right text-xs font-medium text-blue-500 uppercase tracking-wider"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(role, index) in filteredRoles"
                :key="role.id"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="px-6 py-4 text-sm text-gray-900">{{ index + 1 }}</td>
                <td class="px-6 py-4 font-medium text-gray-900">{{ role.name }}</td>
                <td class="px-6 py-4 text-sm text-gray-900 font-medium">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                    {{ role.permissions ? role.permissions.length : 0 }} / {{ allPermissions.length }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex justify-end space-x-2">
                    <button
                      v-if="hasPermission('edit-roles')"
                      @click="openModal(role)"
                      class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition"
                    >
                      Edit
                    </button>
                    <button
                      v-if="hasPermission('delete-roles')"
                      @click="deleteRole(role.id)"
                      class="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredRoles.length === 0">
                <td colspan="4" class="text-center py-6 text-gray-500">
                  Tidak ada role ditemukan.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      >
        <div class="bg-white p-6 rounded-xl w-full max-w-lg">
          <h2 class="text-xl font-semibold mb-4">
            {{ editingRole ? 'Edit Role' : 'Tambah Role' }}
          </h2>
          <form @submit.prevent="saveRole">
            <div class="mb-4">
              <label class="block mb-1 text-sm text-gray-700">Nama Role</label>
              <input v-model="form.name" type="text" class="w-full border rounded p-2" required />
            </div>

            <div class="mb-4">
              <label class="block mb-1 text-sm text-gray-700">Permissions</label>
              <div v-if="allPermissions.length === 0" class="text-gray-500">
                Loading permissions...
              </div>
              <div v-else class="grid grid-cols-2 gap-2">
                <label
                  v-for="permission in allPermissions"
                  :key="permission.id"
                  class="inline-flex items-center"
                >
                  <input
                    type="checkbox"
                    v-model="form.permissions"
                    :value="permission.name"
                    class="mr-2"
                  />
                  <span class="text-sm text-gray-700">{{ permission.name }}</span>
                </label>
              </div>
            </div>

            <div class="flex justify-end gap-2">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 rounded-xl bg-gray-300 hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                type="submit"
                class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
              >
                Simpan
              </button>
            </div>
          </form>
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

const roles = ref([])
const allPermissions = ref([])
const showModal = ref(false)
const editingRole = ref(null)
const form = ref({ name: '', permissions: [] })
const search = ref('')

// Filter roles by name
const filteredRoles = computed(() => {
  return roles.value.filter((role) => role.name.toLowerCase().includes(search.value.toLowerCase()))
})

const fetchRoles = async () => {
  try {
    const res = await axios.get('/roles')
    roles.value = res.data
  } catch (err) {
    console.error('Error fetching roles:', err)
    Swal.fire({
      icon: 'error',
      title: 'Gagal!',
      text: 'Gagal memuat data roles. Silakan coba lagi.',
    })
  }
}

const fetchPermissions = async () => {
  try {
    const res = await axios.get('/permissions')
    allPermissions.value = res.data
  } catch (err) {
    console.error('Error fetching permissions:', err)
    allPermissions.value = []
  }
}

const openModal = (role) => {
  showModal.value = true
  editingRole.value = role
  if (role) {
    form.value = {
      name: role.name,
      permissions: role.permissions.map((p) => p.name),
    }
  } else {
    form.value = { name: '', permissions: [] }
  }
}

const closeModal = () => {
  showModal.value = false
  editingRole.value = null
}

const saveRole = async () => {
  try {
    const payload = {
      name: form.value.name,
      permissions: form.value.permissions,
    }

    if (editingRole.value) {
      await axios.put(`/roles/${editingRole.value.id}`, payload)
    } else {
      await axios.post('/roles', payload)
    }

    closeModal()
    fetchRoles()

    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Role berhasil disimpan!',
      timer: 1500,
      showConfirmButton: false,
    })
  } catch (err) {
    console.error('Error saving role:', err)
    const errorMessage = err.response?.data?.message || 'Gagal menyimpan role. Silakan coba lagi.'

    Swal.fire({
      icon: 'error',
      title: 'Gagal!',
      text: errorMessage,
    })
  }
}

const deleteRole = async (id) => {
  Swal.fire({
    title: 'Apakah Anda yakin?',
    text: 'Role ini akan dihapus permanen!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`/roles/${id}`)
        fetchRoles()
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Role berhasil dihapus.',
          timer: 1500,
          showConfirmButton: false,
        })
      } catch (err) {
        console.error('Error deleting role:', err)

        // Cek error dari Laravel (misalnya foreign key constraint)
        const errorMessage = err.response?.data?.message || 'Role gagal dihapus. Silakan coba lagi.'

        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: errorMessage,
        })
      }
    }
  })
}

onMounted(() => {
  fetchRoles()
  fetchPermissions()
})
</script>

<style scoped>
input[type='checkbox']:checked {
  accent-color: #2563eb;
}
</style>
