<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border p-6">
      <!-- Header -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900">
          {{ isEdit ? 'Edit Meeting Schedule' : 'Tambah Meeting Schedule' }}
        </h2>
        <p class="text-gray-600 mt-1">Isi detail meeting schedule</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-4">
        <!-- Ruangan -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Ruangan</label>
          <select
            v-model="form.room_id"
            required
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Pilih Ruangan</option>
            <option v-for="room in rooms" :key="room.id" :value="room.id">
              {{ room.name }} ({{ room.location }})
            </option>
          </select>
        </div>

        <!-- Nama Peminjam -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nama Peminjam</label>
          <input
            type="text"
            v-model="form.borrower_name"
            required
            placeholder="Nama lengkap"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Kontak Peminjam -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Kontak</label>
          <input
            type="text"
            v-model="form.borrower_contact"
            required
            placeholder="Nomor HP atau WA"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="text"
            v-model="form.emails"
            required
            placeholder="Email"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Tujuan -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tujuan</label>
          <textarea
            v-model="form.purpose"
            placeholder="Contoh: Rapat Mingguan"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <!-- Hari -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Hari</label>
          <select
            v-model="form.day_of_week"
            required
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Pilih Hari</option>
            <option v-for="(day, index) in dayNames" :key="index" :value="index">{{ day }}</option>
          </select>
        </div>

        <!-- Waktu -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Waktu Mulai</label>
            <input
              type="time"
              v-model="form.start_time"
              required
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Waktu Selesai</label>
            <input
              type="time"
              v-model="form.end_time"
              required
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <!-- Periode -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
            <input
              type="date"
              v-model="form.start_date"
              required
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Akhir</label>
            <input
              type="date"
              v-model="form.end_date"
              required
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <!-- Tombol -->
        <div class="flex justify-end space-x-4 mt-6">
          <router-link
            to="/meeting-schedules"
            class="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700"
          >
            Batal
          </router-link>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
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
import axios from '../services/api'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()
const route = useRoute()

const rooms = ref([])
const isEdit = ref(false)
const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

const form = ref({
  room_id: '',
  borrower_name: '',
  borrower_contact: '',
  purpose: '',
  emails: '',
  day_of_week: '',
  start_time: '',
  end_time: '',
  start_date: '',
  end_date: '',
})

const getRooms = async () => {
  const res = await axios.get('/rooms')
  rooms.value = res.data.data || res.data
}

const getLoan = async (id) => {
  const res = await axios.get(`/meeting-schedules/${id}`)
  form.value = { ...res.data }
}

const submitForm = async () => {
  try {
    const payload = {
      ...form.value,
      emails: form.value.emails ? [form.value.emails] : [],
    }

    if (isEdit.value) {
      await axios.put(`/meeting-schedules/${route.params.id}`, payload)
    } else {
      await axios.post('/meeting-schedules', payload)
    }

    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: isEdit.value
        ? 'Meeting schedule berhasil diperbarui!'
        : 'Meeting schedule berhasil ditambahkan!',
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      router.push('/meeting-schedules')
    })
  } catch (error) {
    console.error(error)
    const errorMessage =
      error.response?.data?.message || 'Gagal menyimpan data. Silakan coba lagi.'

    Swal.fire({
      icon: 'error',
      title: 'Gagal!',
      text: errorMessage,
    })
  }
}

onMounted(() => {
  getRooms()
  if (route.params.id) {
    isEdit.value = true
    getLoan(route.params.id)
  }
})
</script>

