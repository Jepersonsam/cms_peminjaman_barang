<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border p-6">
      <!-- Header -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900">
          {{ isEdit ? 'Edit Kategori' : 'Tambah Kategori' }}
        </h2>
        <p class="text-gray-600 mt-1">Isi detail kategori</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-4">
        <!-- Nama Kategori -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Nama Kategori <span class="text-red-500">*</span></label
          >
          <input
            type="text"
            v-model="form.name"
            required
            placeholder="Contoh: Elektronik, Furniture, dll"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
            maxlength="100"
          />
          <p class="mt-1 text-xs text-gray-500">Maksimal 100 karakter</p>
        </div>

        <!-- Deskripsi -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea
            v-model="form.description"
            placeholder="Deskripsi kategori (opsional)"
            rows="4"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <!-- Tombol -->
        <div class="flex justify-end space-x-4 mt-6">
          <router-link
            to="/categories"
            class="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700"
          >
            Batal
          </router-link>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
          >
            {{ isEdit ? 'Update' : 'Simpan' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '../services/api'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()
const route = useRoute()
const isEdit = ref(false)

const form = ref({
  name: '',
  description: '',
})

const getCategory = async (id) => {
  try {
    const res = await axios.get(`/categories/${id}`)
    form.value = {
      name: res.data.data?.name || res.data.name || '',
      description: res.data.data?.description || res.data.description || '',
    }
  } catch (error) {
    console.error('Error fetching category:', error)
    Swal.fire({
      icon: 'error',
      title: 'Gagal!',
      text: 'Gagal memuat data kategori.',
    })
  }
}

const submitForm = async () => {
  try {
    if (isEdit.value) {
      await axios.put(`/categories/${route.params.id}`, form.value)
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Kategori berhasil diperbarui.',
        timer: 1500,
        showConfirmButton: false,
      })
    } else {
      await axios.post('/categories', form.value)
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Kategori berhasil ditambahkan.',
        timer: 1500,
        showConfirmButton: false,
      })
    }

    router.push('/categories')
  } catch (error) {
    console.error('Error saving category:', error)
    const errorMessage =
      error.response?.data?.message || 'Gagal menyimpan kategori. Silakan coba lagi.'

    Swal.fire({
      icon: 'error',
      title: 'Gagal!',
      text: errorMessage,
    })
  }
}

onMounted(() => {
  if (route.params.id) {
    isEdit.value = true
    getCategory(route.params.id)
  }
})
</script>

