<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Manajemen User</h1>
            <p class="text-gray-600 mt-1">Kelola data pengguna sistem</p>
          </div>
          <router-link
          v-if="hasPermission('create-users')"
            to="/users/create"
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
            Tambah User
          </router-link>
        </div>
      </div>

      <!-- Filter Section -->
      <div class="bg-white rounded-lg shadow-sm border p-6 mb-6 grid md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Peran</label>
          <select
            v-model="filters.role"
            class="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Semua</option>
            <option value="super-admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
        <div class="md:col-span-3">
          <label class="block text-sm font-medium text-gray-700 mb-1">Cari Nama / Email</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Cari..."
            class="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Daftar User</h3>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full table-fixed divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="w-12 px-4 py-2 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  class="w-48 px-4 py-2 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  class="w-48 px-4 py-2 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  class="w-40 px-4 py-2 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                >
                  Phone
                </th>

                <th
                  class="w-32 px-4 py-2 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                >
                  Code
                </th>

                <th
                  class="w-32 px-4 py-2 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                >
                  NFC Code
                </th>

                <th
                  class="w-48 px-4 py-2 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  class="w-40 px-4 py-2 text-center text-xs font-medium text-blue-500 uppercase tracking-wider"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(user, index) in filteredUsers"
                :key="user.id"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="px-4 py-3 text-sm text-gray-900">{{ index + 1 }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <div
                      class="h-10 w-10 bg-purple-500 rounded-full flex items-center justify-center"
                    >
                      <span class="text-white font-medium text-sm">
                        {{ user.name.charAt(0).toUpperCase() }}
                      </span>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                      <div class="text-sm text-gray-500">
                        Member since {{ formatDate(user.created_at) }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <div class="text-sm text-gray-900">{{ user.email }}</div>

                </td>
                <td class="px-4 py-3 text-sm text-gray-900">
                  {{ user.phone || 'N/A' }}
                </td>
                <td class="px-4 py-3 break-words max-w-[8rem]">
                  <span
                    class="block w-full break-words px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {{ user.code || 'N/A' }}
                  </span>
                </td>

                <td class="px-4 py-3 break-words max-w-[8rem]">
                  <span
                    class="block w-full break-words px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {{ user.code_nfc || 'N/A' }}
                  </span>
                </td>

                <td class="px-4 py-3">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="role in user.roles"
                      :key="role.id"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getRoleColor(role.name)"
                    >
                      {{ role.name }}
                    </span>
                    <span
                      v-if="!user.roles || user.roles.length === 0"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      No Role
                    </span>
                  </div>
                </td>
                <td class="px-4 py-3 text-center">
                  <div class="flex justify-center gap-2">
                    <router-link
                    v-if="hasPermission('edit-users')"
                      :to="`/users/${user.id}/edit`"
                      class="px-3 py-1 text-xs border border-gray-300 rounded-md text-yellow-800 bg-yellow-100 hover:bg-yellow-200"
                      >Edit</router-link
                    >
                    <button
                    v-if="hasPermission('delete-users')"
                      @click="deleteUser(user.id)"
                      class="px-3 py-1 text-xs border border-red-300 rounded-md text-red-600 bg-red-50 hover:bg-red-100"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="filteredUsers.length === 0" class="text-center py-12">
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada user</h3>
          <p class="mt-1 text-sm text-gray-500">Mulai dengan menambahkan user pertama Anda.</p>
          <div class="mt-6">
            <router-link
              v-if="hasPermission('create-users')"
              to="/users/create"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Tambah User
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, computed } from 'vue'
import axios from '../services/api'
import { useUserStore } from '../stores/UserStore'
import Swal from 'sweetalert2'

const userStore = useUserStore()
const hasPermission = (perm) => userStore.permissions.includes(perm)

const users = ref([])

// Ambil user dengan role 'super-admin'
const superadminUsers = computed(() => {
  return users.value.filter(
    (user) =>
      user.roles && user.roles.some((role) => role.name.toLowerCase().includes('super admin')),
  ).length
})

// Ambil user dengan role 'admin' tetapi bukan 'super-admin'
const adminUsers = computed(() => {
  return users.value.filter(
    (user) =>
      user.roles &&
      user.roles.some((role) => role.name.toLowerCase().includes('admin')) &&
      !user.roles.some((role) => role.name.toLowerCase().includes('super admin')),
  ).length
})

// Ambil user tanpa role 'admin' atau 'super-admin'
const regularUsers = computed(() => {
  return users.value.filter(
    (user) =>
      !user.roles ||
      user.roles.length === 0 ||
      user.roles.every(
        (role) =>
          !role.name.toLowerCase().includes('admin') &&
          !role.name.toLowerCase().includes('super admin'),
      ),
  ).length
})

const filters = ref({
  role: '',
  search: '',
})

const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const role = filters.value.role
    const search = filters.value.search.toLowerCase()

    const hasRole = (name) =>
      user.roles && user.roles.some((r) => r.name.toLowerCase().includes(name))

    const matchRole =
      !role ||
      (role === 'super-admin' && hasRole('super-admin')) ||
      (role === 'admin' && hasRole('admin') && !hasRole('superadmin')) ||
      (role === 'user' &&
        (!user.roles ||
          user.roles.length === 0 ||
          user.roles.every(
            (r) =>
              !r.name.toLowerCase().includes('admin') &&
              !r.name.toLowerCase().includes('super admin'),
          )))

    const matchSearch =
      !search ||
      (user.name && user.name.toLowerCase().includes(search)) ||
      (user.email && user.email.toLowerCase().includes(search))

    return matchRole && matchSearch
  })
})

const getUsers = async () => {
  try {
    const res = await axios.get('/users')
    users.value = res.data.data
  } catch (error) {
    console.error('Error loading users:', error)
    Swal.fire({
      icon: 'error',
      title: 'Gagal memuat data user',
      text: 'Silakan coba lagi.',
    })
  }
}

const deleteUser = async (id) => {
  Swal.fire({
    title: 'Apakah Anda yakin?',
    text: 'User ini akan dihapus permanen!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`/users/${id}`)
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'User berhasil dihapus.',
          timer: 1500,
          showConfirmButton: false
        })
        getUsers()
      } catch (error) {
        console.error('Error deleting user:', error)
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'User gagal dihapus. Silakan coba lagi.',
        })
      }
    }
  })
}

const getRoleColor = (roleName) => {
  const role = roleName.toLowerCase()
  if (role.includes('admin')) {
    return 'bg-red-100 text-red-800'
  } else if (role.includes('admin')) {
    return 'bg-blue-100 text-blue-800'
  } else if (role.includes('user')) {
    return 'bg-green-100 text-green-800'
  } else {
    return 'bg-gray-100 text-gray-800'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const isVerified = (user) => {
  // This would typically check email_verified_at field
  return user.email_verified_at !== null
}

onMounted(() => {
  getUsers()
})
</script>
