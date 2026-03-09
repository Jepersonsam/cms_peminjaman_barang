<template>
  <div class="max-w-xl mx-auto bg-white p-6 rounded shadow">
    <h2 class="text-xl font-bold mb-4">
      {{ isEdit ? 'Edit Peminjaman Ruangan' : 'Tambah Peminjaman Ruangan' }}
    </h2>

    <form @submit.prevent="submit">
      <!-- Ruangan -->
      <div class="mb-4">
        <label class="block font-medium mb-1 text-gray-700">Ruangan</label>
        <select
          v-model="form.room_id"
          class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
          required
        >
          <option disabled value="">Pilih Ruangan</option>
          <option v-for="room in rooms" :key="room.id" :value="room.id">
            {{ room.name }} ({{ room.location }})
          </option>
        </select>
      </div>

      <!-- Nama Peminjam -->
      <div class="mb-4">
        <label class="block font-medium mb-1 text-gray-700">Nama Peminjam</label>
        <input
          v-model="form.borrower_name"
          type="text"
          class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
          required
        />
      </div>

      <!-- Kontak Peminjam -->
      <div class="mb-4">
        <label class="block font-medium mb-1 text-gray-700">Kontak Peminjam</label>
        <input
          v-model="form.borrower_contact"
          type="text"
          class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
        />
      </div>

      <!-- Tujuan -->
      <div class="mb-4">
        <label class="block font-medium mb-1 text-gray-700">Tujuan</label>
        <textarea
          v-model="form.purpose"
          class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
        ></textarea>
      </div>

      <!-- Waktu Mulai -->
      <div class="mb-4">
        <label class="block font-medium mb-1 text-gray-700">Waktu Mulai</label>
        <input
          type="datetime-local"
          v-model="form.start_time"
          class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
          required
        />
      </div>

      <!-- Waktu Selesai -->
      <div class="mb-4">
        <label class="block font-medium mb-1 text-gray-700">Waktu Selesai</label>
        <input
          type="datetime-local"
          v-model="form.end_time"
          class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
          required
        />
      </div>

      <!-- Email Notifikasi (opsional) -->
      <div class="mb-4">
        <label class="block font-medium mb-1 text-gray-700"
          >Email Notifikasi (opsional, pisahkan dengan koma)</label
        >
        <input
          v-model="form.emails"
          type="text"
          class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
        />
      </div>

      <!-- Status (hanya edit) -->
      <div class="mb-4" v-if="isEdit">
        <label class="block font-medium mb-1 text-gray-700">Status</label>
        <select
          v-model="form.status"
          class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
        >
          <option value="pending">Menunggu</option>
          <option value="approved">Disetujui</option>
          <option value="rejected">Ditolak</option>
          <option value="cancelled">Dibatalkan</option>
        </select>
      </div>

      <!-- Tombol Aksi -->
      <div class="flex gap-2">
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Simpan
        </button>
        <button
          type="button"
          @click="router.push('/room-loans')"
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

const form = ref({
  room_id: '',
  borrower_name: '',
  borrower_contact: '',
  purpose: '',
  start_time: '',
  end_time: '',
  emails: '',
  status: 'pending',
})

const rooms = ref([])

const loadData = async () => {
  try {
    // Ambil semua ruangan
    const roomRes = await axios.get('/rooms')
    rooms.value = roomRes.data.data

    // Jika edit, ambil data room loan
    if (isEdit.value) {
      const res = await axios.get(`/room-loans/${route.params.id}`)
      const loan = res.data

      form.value = {
        room_id: loan.room_id ?? '',
        borrower_name: loan.borrower_name ?? '',
        borrower_contact: loan.borrower_contact ?? '',
        purpose: loan.purpose ?? '',
        start_time: loan.start_time ? loan.start_time.slice(0, 16) : '',
        end_time: loan.end_time ? loan.end_time.slice(0, 16) : '',
        emails: Array.isArray(loan.emails) ? loan.emails.join(', ') : (loan.emails ?? ''),
        status: loan.status ?? 'pending',
      }
    }
  } catch (err) {
    console.error('Gagal memuat data:', err)
  }
}

const submit = async () => {
  try {
    // Pastikan emails berbentuk array sebelum dikirim
    let payload = { ...form.value }
    if (typeof payload.emails === 'string' && payload.emails.trim() !== '') {
      payload.emails = payload.emails
        .split(',')
        .map((email) => email.trim())
        .filter((email) => email !== '')
    } else {
      payload.emails = [] // jika kosong, kirim array kosong
    }

    if (isEdit.value) {
      await axios.put(`/room-loans/${route.params.id}`, payload)
    } else {
      await axios.post('/room-loans', payload)
    }

    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: isEdit.value ? 'Peminjaman ruangan berhasil diperbarui!' : 'Peminjaman ruangan berhasil ditambahkan!',
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
    router.push('/room-loans')
    })
  } catch (err) {
    console.error(err)
    const errorMessage =
      err.response?.data?.message || 'Gagal menyimpan data. Silakan coba lagi.'

    Swal.fire({
      icon: 'error',
      title: 'Gagal!',
      text: errorMessage,
    })
  }
}

onMounted(loadData)
</script>
