<template>
  <div class="max-w-xl mx-auto bg-white p-6 rounded shadow mt-6">
    <h2 class="text-xl font-bold mb-4">{{ isEdit ? 'Edit' : 'Tambah' }} Permission</h2>

    <form @submit.prevent="submitForm">
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-1">Nama Permission</label>
        <input
          v-model="form.name"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Contoh: create-user"
          required
        />
        <p class="text-xs text-gray-500 mt-1">Gunakan huruf kecil dan tanda hubung (kebab-case).</p>
      </div>

      <div class="flex gap-2 justify-end">
        <button
          type="button"
          @click="router.back()"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Batal
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {{ loading ? 'Menyimpan...' : isEdit ? 'Update' : 'Simpan' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/services/api'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const isEdit = computed(() => !!id)

const form = ref({
  name: '',
})
const loading = ref(false)

onMounted(async () => {
  if (isEdit.value) {
    await fetchPermission()
  }
})

const fetchPermission = async () => {
  try {
    const res = await axios.get(`/permissions/${id}`)
    // Adjust depending on API response structure
    const data = res.data.data || res.data
    form.value.name = data.name
  } catch (error) {
    console.error(error)
    Swal.fire('Error', 'Gagal memuat data permission', 'error')
    router.push('/permissions')
  }
}

const submitForm = async () => {
  loading.value = true
  try {
    if (isEdit.value) {
      await axios.put(`/permissions/${id}`, { name: form.value.name })
    } else {
      await axios.post('/permissions', { name: form.value.name })
    }

    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: isEdit.value ? 'Permission berhasil diperbarui.' : 'Permission berhasil ditambahkan.',
      timer: 1500,
      showConfirmButton: false,
    })
    router.push('/permissions')
  } catch (error) {
    console.error(error)
    const msg = error.response?.data?.message || 'Gagal menyimpan data.'
    Swal.fire('Gagal', msg, 'error')
  } finally {
    loading.value = false
  }
}
</script>
