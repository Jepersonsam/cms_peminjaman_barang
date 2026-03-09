<template>
  <div class="max-w-xl mx-auto bg-white p-6 rounded shadow">
    <h2 class="text-xl font-bold mb-4">
      {{ isEdit ? 'Edit Peminjaman' : 'Tambah Peminjaman' }}
    </h2>

    <div v-if="loading">🔄 Memuat data...</div>
    <form v-else @submit.prevent="submit">
      <!-- Peminjam -->
      <div class="mb-4">
        <label class="block font-medium mb-1 text-gray-700">Peminjam</label>
        <template v-if="isEdit">
          <input
            type="text"
            :value="selectedUserLabel"
            class="w-full bg-gray-100 border-gray-300 rounded-lg shadow-sm px-4 py-2 text-gray-700"
            readonly
          />
        </template>
        <template v-else>
          <select
            v-model="form.users_id"
            class="w-full border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option disabled value="">Pilih Peminjam</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </select>
        </template>
      </div>

      <!-- Barang -->
      <div class="mb-4">
        <label class="block font-medium mb-1 text-gray-700">Barang</label>
        <template v-if="isEdit">
          <input
            type="text"
            :value="selectedItemLabel"
            class="w-full bg-gray-100 border-gray-300 rounded-lg shadow-sm px-4 py-2 text-gray-700"
            readonly
          />
        </template>
        <template v-else>
          <select
            v-model="form.item_id"
            class="w-full border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option disabled value="">Pilih Barang</option>
            <option v-for="item in items" :key="item.id" :value="item.id">
              {{ item.name }} - {{ item.serial_code }}
              <span v-if="item.is_approval"> (Perlu Persetujuan)</span>
            </option>
          </select>
        </template>
      </div>

      <!-- Info Persetujuan -->
      <div v-if="isEdit" class="mb-4">
        <label class="block font-medium mb-1 text-gray-700">Kebutuhan Persetujuan</label>
        <input
          type="text"
          :value="requiresApproval ? 'Ya, perlu persetujuan admin' : 'Tidak perlu persetujuan'"
          class="w-full bg-gray-100 border-gray-300 rounded-lg shadow-sm px-4 py-2 text-gray-700"
          readonly
        />
      </div>

      <!-- Tanggal Pinjam -->
      <div class="mb-4">
        <label class="block font-medium mb-1 text-gray-700">Tanggal Pinjam</label>
        <input
          type="date"
          v-model="form.borrow_date"
          class="w-full border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <!-- Tanggal Kembali -->
      <div class="mb-4">
        <label class="block font-medium mb-1 text-gray-700">Tanggal Kembali</label>
        <input
          type="date"
          v-model="form.return_date"
          class="w-full border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <!-- Status Persetujuan (Admin) -->
      <div v-if="isEdit && requiresApproval" class="mb-4">
        <label class="block font-medium mb-1 text-gray-700">Status Persetujuan</label>
        <select
          v-model="form.approval_status"
          class="w-full border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="pending">Menunggu Persetujuan</option>
          <option value="approved">Disetujui</option>
          <option value="rejected">Ditolak</option>
        </select>
      </div>

      <!-- Tombol Aksi -->
      <div class="flex gap-2">
        <button
          type="submit"
          :disabled="saving"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {{ saving ? 'Menyimpan...' : 'Simpan' }}
        </button>
        <button
          type="button"
          @click="router.push('/borrowings')"
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
const loading = ref(false)
const saving = ref(false)

const form = ref({
  users_id: '',
  item_id: '',
  borrow_date: '',
  return_date: '',
  approval_status: '',
})

const users = ref([])
const items = ref([])
const requiresApproval = ref(false)

const selectedUserLabel = computed(() => {
  const user = users.value.find(u => u.id === form.value.users_id)
  return user ? `${user.name} (${user.code})` : 'User tidak ditemukan'
})

const selectedItemLabel = computed(() => {
  const item = items.value.find(i => i.id === form.value.item_id)
  return item ? `${item.name} - ${item.serial_code}` : 'Barang tidak ditemukan'
})

const loadData = async () => {
  loading.value = true
  try {
    const [userRes, itemRes] = await Promise.all([
      axios.get('/users'),
      axios.get('/items')
    ])

    users.value = userRes.data.data
    const allItems = itemRes.data.data
    items.value = isEdit.value ? allItems : allItems.filter(i => i.is_available)

    if (isEdit.value) {
      const res = await axios.get(`/borrowings/${route.params.id}`)
      const b = res.data

      if (!users.value.find(u => u.id === b.user?.id)) {
        users.value.push({
          id: b.user?.id,
          name: b.user?.name || 'User tidak ditemukan',
          code: b.user?.code || '',
        })
      }

      if (!items.value.find(i => i.id === b.item?.id)) {
        items.value.push({
          id: b.item?.id,
          name: b.item?.name || 'Barang tidak ditemukan',
          serial_code: b.item?.serial_code || '',
          is_approval: b.item?.is_approval || false
        })
      }

      form.value = {
        users_id: Number(b.user?.id) || '',
        item_id: Number(b.item?.id) || '',
        borrow_date: b.borrow_date || '',
        return_date: b.return_date || '',
        approval_status: b.approval_status || 'pending',
      }

      requiresApproval.value = b.item?.is_approval || false
    }
  } catch (err) {
    console.error('Gagal load data:', err)
    Swal.fire({
      icon: 'error',
      title: 'Gagal!',
      text: 'Gagal memuat data. Silakan coba lagi.',
    })
  } finally {
    loading.value = false
  }
}

const submit = async () => {
  if (!form.value.users_id || !form.value.item_id) {
    Swal.fire({
      icon: 'warning',
      title: 'Perhatian!',
      text: 'Peminjam dan barang wajib dipilih.',
    })
    return
  }

  if (form.value.return_date < form.value.borrow_date) {
    Swal.fire({
      icon: 'error',
      title: 'Tanggal Tidak Valid!',
      text: 'Tanggal kembali tidak boleh lebih awal dari tanggal pinjam!',
    })
    return
  }

  saving.value = true
  try {
    if (isEdit.value) {
      await axios.put(`/borrowings/${route.params.id}`, form.value)
    } else {
      await axios.post('/borrowings', form.value)
    }

    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Data berhasil disimpan!',
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
    router.push('/borrowings')
    })
  } catch (err) {
    console.error('Gagal simpan:', err)

    const errorMessage =
      err.response?.data?.message || 'Gagal menyimpan data. Silakan coba lagi.'

    Swal.fire({
      icon: 'error',
      title: 'Gagal!',
      text: errorMessage,
    })
  } finally {
    saving.value = false
  }
}

onMounted(loadData)
</script>