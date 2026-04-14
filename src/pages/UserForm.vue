<template>
  <div class="max-w-xl mx-auto bg-white p-6 rounded shadow">
    <h2 class="text-xl font-bold mb-4">{{ isEdit ? 'Edit' : 'Tambah' }} User</h2>

    <form @submit.prevent="handleSubmit">
      <!-- Nama -->
      <div class="mb-4">
        <label class="block">Nama</label>
        <input v-model="form.name" type="text" class="w-full border p-2 rounded" />
      </div>

      <!-- Email -->
      <div class="mb-4">
        <label class="block">Email</label>
        <input v-model="form.email" type="email" class="w-full border p-2 rounded" />
      </div>

      <!-- Phone -->
      <div class="mb-4">
        <label class="block mb-1">Nomor Telepon</label>
        <div class="flex">
          <span
            class="inline-flex items-center px-3 rounded-l border border-r-0 border-gray-300 bg-gray-100 text-gray-700 text-sm"
          >
            +62
          </span>
          <input
            v-model="form.phone_without_prefix"
            type="tel"
            class="w-full border border-gray-300 p-2 rounded-r"
            placeholder="81234567890"
          />
        </div>
      </div>

      <!-- Password (hanya saat create) -->
      <div class="mb-4" v-if="!isEdit">
        <label class="block">Password</label>
        <input v-model="form.password" type="password" class="w-full border p-2 rounded" />
      </div>

      <div class="mb-4" v-if="!isEdit">
        <label class="block">Konfirmasi Password</label>
        <input
          v-model="form.password_confirmation"
          type="password"
          class="w-full border p-2 rounded"
        />
      </div>

      <!-- Code -->
      <div class="mb-4">
        <label class="block">Code</label>
        <input 
          v-model="form.code" 
          type="text" 
          class="w-full border p-2 rounded focus:outline-none" 
          :class="{'border-red-500 ring-1 ring-red-500': codeError}"
        />
        <p v-if="codeError" class="text-red-500 text-sm mt-1">{{ codeError }}</p>
      </div>

      <!-- Code NFC -->
      <!-- <div class="mb-4">
        <label class="block">Code NFC</label>
        <input v-model="form.code_nfc" type="text" class="w-full border p-2 rounded" />
      </div> -->

      <!-- Role -->
      <div class="mb-4">
        <label class="block">Role</label>
        <select v-model="form.roles" class="w-full border p-2 rounded">
          <option value="">Pilih Role</option>
          <option v-for="role in allRoles" :key="role" :value="role">{{ role }}</option>
        </select>
      </div>

      <!-- Submit + Cancel -->
      <div class="flex gap-2">
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
          {{ isEdit ? 'Update' : 'Simpan' }}
        </button>
        <button
          type="button"
          @click="router.back()"
          class="bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '../services/api'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)

const form = ref({
  name: '',
  email: '',
  phone_without_prefix: '',
  password: '',
  password_confirmation: '',
  code: '',
  code_nfc: '',
  roles: '',
})

const allRoles = ref([])
const allUsers = ref([])

const getRoles = async () => {
  try {
    const res = await axios.get('/roles/only-names')
    allRoles.value = res.data
  } catch (error) {
    console.error('Gagal mengambil roles:', error)
  }
}

const getAllUsers = async () => {
  try {
    const res = await axios.get('/users')
    allUsers.value = res.data.data || []
  } catch (error) {
    console.error('Gagal mengambil daftar users:', error)
  }
}

const codeError = computed(() => {
  if (!form.value.code) return ''
  const currentId = isEdit.value ? Number(route.params.id) : null
  const isExist = allUsers.value.some(
    (u) => u.code === form.value.code && u.id !== currentId
  )
  return isExist ? 'code sudah terdaftar' : ''
})

const getUser = async () => {
  try {
    const res = await axios.get(`/users/${route.params.id}`)
    const user = res.data.data
    form.value.name = user.name
    form.value.email = user.email
    form.value.code = user.code
    form.value.code_nfc = user.code_nfc || ''
    form.value.roles = user.roles.length > 0 ? user.roles[0].name : ''

    // Pisahkan nomor telepon dari +62
    if (user.phone && user.phone.startsWith('+62')) {
      form.value.phone_without_prefix = user.phone.slice(3)
    } else {
      form.value.phone_without_prefix = user.phone || ''
    }
  } catch (e) {
    console.error('Gagal mengambil data user:', e)
  }
}

const handleSubmit = async () => {
  const url = isEdit.value ? `/users/${route.params.id}` : '/users'
  const method = isEdit.value ? 'put' : 'post'

  const phoneWithoutZero = form.value.phone_without_prefix.replace(/^0+/, '')
  const payload = {
    name: form.value.name,
    email: form.value.email,
    phone: phoneWithoutZero ? '+62' + phoneWithoutZero : null,
    code: form.value.code,
    code_nfc: form.value.code_nfc,
    roles: form.value.roles ? [form.value.roles] : [],
  }

  if (!isEdit.value) {
    payload.password = form.value.password
    payload.password_confirmation = form.value.password_confirmation
  }

  try {
    await axios({ method, url, data: payload })
    await Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: isEdit.value ? 'User berhasil diperbarui.' : 'User berhasil ditambahkan.',
      timer: 2000,
      showConfirmButton: false,
    })
    router.push('/users')
  } catch (e) {
    console.error('Gagal menyimpan user:', e)
    let message = 'Terjadi kesalahan. Coba lagi.'
    if (e.response?.data?.errors) {
      const errors = e.response.data.errors
      const firstErrorKey = Object.keys(errors)[0]
      message = errors[firstErrorKey][0]
    } else if (e.response?.data?.message) {
      message = e.response.data.message
    }
    
    Swal.fire({
      icon: 'error',
      title: 'Gagal!',
      text: message,
    })
  }
}

onMounted(() => {
  getRoles()
  getAllUsers()
  if (isEdit.value) getUser()
})
</script>
