<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-8">
    <div class="bg-white rounded-xl shadow-md w-full max-w-xl p-8">
      <h2 class="text-2xl font-bold mb-6 text-gray-900">
        {{ roomId ? 'Edit Ruangan' : 'Tambah Ruangan' }}
      </h2>
      <form @submit.prevent="saveRoom" class="space-y-5">
        <div>
          <label class="block font-medium mb-1 text-gray-700">Nama Ruangan</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
            required
            placeholder="Contoh: Ruang Rapat 1"
          />
        </div>
        <div>
          <label class="block font-medium mb-1 text-gray-700">Lokasi</label>
          <input
            v-model="form.location"
            type="text"
            class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
            placeholder="Contoh: Lantai 2"
          />
        </div>
        <div>
          <label class="block font-medium mb-1 text-gray-700">Kapasitas</label>
          <input
            v-model.number="form.capacity"
            type="number"
            min="0"
            class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
            placeholder="Contoh: 20"
          />
        </div>
        <div>
          <label class="block font-medium mb-1 text-gray-700">Deskripsi</label>
          <textarea
            v-model="form.description"
            class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
            rows="3"
            placeholder="Deskripsi tambahan (opsional)"
          ></textarea>
        </div>
        <div>
          <label class="inline-flex items-center">
            <input type="checkbox" v-model="form.is_active" class="mr-2" />
            Aktif
          </label>
        </div>
        <div class="flex justify-end gap-2 pt-4">
          <router-link
            to="/rooms"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Batal
          </router-link>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '../services/api'

const route = useRoute()
const router = useRouter()

const form = ref({
  name: '',
  location: '',
  capacity: '',
  description: '',
  is_active: true,
})

const roomId = route.params.id

onMounted(async () => {
  if (roomId) {
    const res = await axios.get(`/rooms/${roomId}`)
    form.value = {
      ...res.data.data,
      is_active: !!res.data.data.is_active,
    }
  }
})

const saveRoom = async () => {
  if (!form.value.name) return
  if (roomId) {
    await axios.put(`/rooms/${roomId}`, form.value)
  } else {
    await axios.post('/rooms', form.value)
  }
  router.push('/rooms')
}
</script>
