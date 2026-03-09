<template>
  <div class="max-w-xl mx-auto bg-white p-6 rounded shadow">
    <h2 class="text-xl font-bold mb-4">{{ isEdit ? 'Edit' : 'Tambah' }} Item</h2>

    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label class="block font-medium mb-1 text-gray-700">Nama</label>
        <input
          v-model="form.name"
          type="text"
          class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
        />
      </div>

      <div class="mb-4">
        <label for="serial_code" class="block text-sm font-medium text-gray-700">Serial Code</label>
        <div class="flex gap-2 items-center">
          <input
            v-model="form.serial_code"
            type="text"
            id="serial_code"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            readonly
          />
          <button
            type="button"
            @click="generateSerialCode"
            class="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Generate
          </button>
        </div>
      </div>

      <div class="mb-4">
        <label class="block font-medium mb-1 text-gray-700">Kategori</label>
        <select
          v-model="form.category_id"
          class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
        >
          <option :value="null">Pilih Kategori</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block font-medium mb-1 text-gray-700">Status Ketersediaan</label>
        <select
          v-model="form.is_available"
          class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
        >
          <option :value="true">Tersedia</option>
          <option :value="false">Dipinjam</option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block font-medium mb-1 text-gray-700">Aktif</label>
        <select
          v-model="form.is_active"
          class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
        >
          <option :value="true">Ya</option>
          <option :value="false">Tidak</option>
        </select>
      </div>

      <div class="mb-6">
        <label class="block font-medium mb-1 text-gray-700">Perlu Persetujuan Admin?</label>
        <select
          v-model="form.is_approval"
          class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500 px-4 py-2"
        >
          <option :value="true">Ya</option>
          <option :value="false">Tidak</option>
        </select>
      </div>

      <!-- Submit + Cancel -->
      <div class="flex gap-2">
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {{ isEdit ? 'Update' : 'Simpan' }}
        </button>
        <button
          type="button"
          @click="router.back()"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Batal
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

const categories = ref([])
const form = ref({
  name: '',
  serial_code: '',
  category_id: null,
  is_available: true,
  is_active: true,
  is_approval: false, // ✅ Default: Tidak perlu persetujuan
})

const generateSerialCode = () => {
  const prefix = 'IOT-'
  const randomNumber = Math.floor(100 + Math.random() * 900) // contoh: 4 digit acak
  form.value.serial_code = `${prefix}${randomNumber}`
}

const getCategories = async () => {
  try {
    const res = await axios.get('/categories')
    categories.value = res.data.data || res.data || []
  } catch (error) {
    console.error('Gagal memuat kategori:', error)
  }
}

const getItem = async () => {
  const { data } = await axios.get(`/items/${route.params.id}`)
  const itemData = data.data || data
  form.value = {
    name: itemData.name || '',
    serial_code: itemData.serial_code || '',
    category_id: itemData.category_id || itemData.category?.id || null,
    is_available: itemData.is_available ?? true,
    is_active: itemData.is_active ?? true,
    is_approval: itemData.is_approval ?? false,
  }
}

const handleSubmit = async () => {
  try {
    const url = isEdit.value ? `/items/${route.params.id}` : '/items'
    const method = isEdit.value ? 'put' : 'post'

    // Prepare payload - include category_id (can be null)
    const payload = {
      ...form.value,
      category_id: form.value.category_id || null,
    }

    await axios({ method, url, data: payload })

    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: isEdit.value ? 'Item berhasil diperbarui!' : 'Item berhasil ditambahkan!',
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      router.push('/items')
    })
  } catch (error) {
    console.error('Error saving item:', error)
    const errorMessage = error.response?.data?.message || 'Gagal menyimpan item. Silakan coba lagi.'

    Swal.fire({
      icon: 'error',
      title: 'Gagal!',
      text: errorMessage,
    })
  }
}

onMounted(async () => {
  await getCategories()
  if (isEdit.value) {
    await getItem()
  } else {
    // Generate serial code hanya saat tambah
    generateSerialCode()
  }
})
</script>
