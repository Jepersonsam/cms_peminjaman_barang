<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
      <!-- Icon -->
      <div class="flex justify-center mb-4">
        <div
          class="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center shadow-md"
        >
          <svg
            class="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">
        Lupa Password
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <!-- Email Field -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="you@example.com"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <!-- Success / Error Messages -->
        <div v-if="success" class="text-green-600 text-sm text-center">
          {{ success }}
        </div>
        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>

        <!-- Submit Button -->
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
          <template v-else>Kirim Link Reset Password</template>
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
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const email = ref('')
const success = ref('')
const error = ref('')
const loading = ref(false)

const router = useRouter()

const handleSubmit = async () => {
  error.value = ''
  success.value = ''
  loading.value = true

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/forgot-password', {
      email: email.value,
    })

    success.value =
      response.data.message ||
      'Link reset password telah dikirim ke email Anda.'
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      'Terjadi kesalahan saat mengirim permintaan.'
  } finally {
    loading.value = false
  }
}
</script>
