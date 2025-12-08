<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Reset Password</h2>

      <!-- Loading -->
      <div v-if="loadingToken" class="text-center text-gray-500">Memvalidasi token...</div>

      <!-- Error saat token invalid -->
      <div v-else-if="tokenError" class="text-center text-red-500">
        {{ tokenError }}
        <p class="mt-3">
          <span
            @click="router.push({ name: 'ForgotPassword' })"
            class="text-blue-600 hover:underline cursor-pointer"
          >
            Kembali ke halaman lupa password
          </span>
        </p>
      </div>

      <!-- Form Reset Password -->
      <form v-else @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"> Password Baru </label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="Masukkan password baru"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"> Konfirmasi Password </label>
          <input
            v-model="passwordConfirmation"
            type="password"
            required
            placeholder="Ulangi password baru"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <!-- Pesan Error / Sukses -->
        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>
        <div v-if="success" class="text-green-600 text-sm text-center">
          {{ success }}
        </div>

        <!-- Tombol -->
        <button
          type="submit"
          class="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-60"
          :disabled="loading"
        >
          <template v-if="loading">
            <svg
              class="animate-spin h-5 w-5 inline mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            Mengirim...
          </template>
          <template v-else>Reset Password</template>
        </button>

        <p class="text-sm text-center mt-4 text-gray-600">
          Sudah ingat password?
          <span
            @click="router.push({ name: 'Login' })"
            class="text-blue-600 hover:underline cursor-pointer"
          >
            Login di sini
          </span>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const token = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')

const error = ref('')
const success = ref('')
const loading = ref(false)
const loadingToken = ref(true)
const tokenError = ref('')

// 🔹 Saat halaman dibuka, validasi token dulu
onMounted(async () => {
  token.value = route.query.token || ''
  email.value = route.query.email || ''

  if (!token.value || !email.value) {
    tokenError.value = 'Token atau email tidak ditemukan.'
    loadingToken.value = false
    return
  }

  try {
    const res = await axios.get('http://127.0.0.1:8000/api/validate-reset-token', {
      params: { token: token.value, email: email.value },
    })

    if (!res.data.valid) {
      tokenError.value = res.data.message || 'Token tidak valid.'
    }
  } catch (err) {
    tokenError.value = err.response?.data?.message || 'Gagal memvalidasi token.'
  } finally {
    loadingToken.value = false
  }
})

// 🔹 Submit reset password
const handleSubmit = async () => {
  error.value = ''
  success.value = ''
  loading.value = true

  if (password.value !== passwordConfirmation.value) {
    error.value = 'Password tidak cocok.'
    loading.value = false
    return
  }

  try {
    const res = await axios.post('http://127.0.0.1:8000/api/reset-password', {
      token: token.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    })

    success.value = res.data.message || 'Password berhasil direset.'
    setTimeout(() => router.push({ name: 'Login' }), 2000)
  } catch (err) {
    error.value = err.response?.data?.message || 'Terjadi kesalahan.'
  } finally {
    loading.value = false
  }
}
</script>
