<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="you@example.com"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            autocomplete="username"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div class="flex items-center border border-gray-300 rounded-md px-3 py-2">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              required
              placeholder="••••••••"
              class="flex-1 outline-none"
              autocomplete="current-password"
            />
            <button
              type="button"
              class="text-sm text-blue-600 hover:underline ml-2"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
        </div>

        <!-- Forgot Password -->
        <p
          @click="router.push({ name: 'ForgotPassword' })"
          class="text-sm text-blue-600 text-center hover:underline cursor-pointer"
        >
          Forgot Password?
        </p>

        <!-- Error Message -->
        <div v-if="error" class="text-center text-sm text-red-500">
          {{ error }}
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          :disabled="isLoading"
        >
          <template v-if="isLoading">
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
            Logging in...
          </template>
          <template v-else>Login</template>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/UserStore'

const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)
const showPassword = ref(false)

const router = useRouter()
const userStore = useUserStore()

const handleLogin = async () => {
  error.value = ''
  isLoading.value = true

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/login', {
      email: email.value,
      password: password.value,
    })

    const { token, user, permissions } = response.data
    userStore.setUser({ user, token, permissions })
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

    router.push({ name: 'Dashboard' })
  } catch (err) {
    error.value = err.response?.data?.message || 'Login gagal. Coba lagi.'
  } finally {
    isLoading.value = false
  }
}
</script>
