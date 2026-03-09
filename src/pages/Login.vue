<template>
  <div class="login-page">
    <!-- Animated Background -->
    <div class="bg-animated">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
      <div class="grid-overlay"></div>
    </div>

    <!-- Login Container -->
    <div class="login-wrapper">
      <!-- Left Panel - Branding -->
      <div class="brand-panel">
        <div class="brand-content">
          <div class="brand-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
              <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
              <line x1="12" y1="12" x2="12" y2="16" />
              <circle cx="12" cy="12" r="1" />
            </svg>
          </div>
          <h1 class="brand-title">CMS Peminjaman</h1>
          <p class="brand-subtitle">Sistem Manajemen Peminjaman Barang</p>

          <div class="brand-features">
            <div class="feature-item">
              <div class="feature-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>Kelola peminjaman barang dengan mudah</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>Pantau status barang secara real-time</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>Laporan lengkap & manajemen inventaris</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel - Form -->
      <div class="form-panel">
        <div class="form-card">
          <div class="form-header">
            <div class="form-logo">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
                <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                <circle cx="12" cy="13" r="2" />
              </svg>
            </div>
            <h2 class="form-title">Selamat Datang</h2>
            <p class="form-subtitle">Masuk ke akun administrator Anda</p>
          </div>

          <form @submit.prevent="handleLogin" class="form-body">
            <!-- Email Field -->
            <div
              class="field-group"
              :class="{ 'field-focused': emailFocused, 'field-filled': email }"
            >
              <label class="field-label">Email</label>
              <div class="field-input-wrapper">
                <div class="field-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                    />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <input
                  v-model="email"
                  type="email"
                  required
                  placeholder="admin@example.com"
                  class="field-input"
                  autocomplete="username"
                  @focus="emailFocused = true"
                  @blur="emailFocused = false"
                />
              </div>
            </div>

            <!-- Password Field -->
            <div
              class="field-group"
              :class="{ 'field-focused': passwordFocused, 'field-filled': password }"
            >
              <label class="field-label">Password</label>
              <div class="field-input-wrapper">
                <div class="field-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </div>
                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  required
                  placeholder="••••••••"
                  class="field-input"
                  autocomplete="current-password"
                  @focus="passwordFocused = true"
                  @blur="passwordFocused = false"
                />
                <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                  <svg
                    v-if="!showPassword"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
                    />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Forgot Password -->
            <div class="form-options">
              <span @click="router.push({ name: 'ForgotPassword' })" class="forgot-link">
                Lupa Password?
              </span>
            </div>

            <!-- Error Message -->
            <transition name="error-fade">
              <div v-if="error" class="error-message">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{{ error }}</span>
              </div>
            </transition>

            <!-- Submit Button -->
            <button
              type="submit"
              class="submit-btn"
              :class="{ loading: isLoading }"
              :disabled="isLoading"
            >
              <span v-if="!isLoading" class="btn-text">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Masuk
              </span>
              <span v-else class="btn-loading">
                <svg
                  class="spin-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
                Memproses...
              </span>
            </button>
          </form>

          <div class="form-footer">
            <span>© 2025 CMS Peminjaman Barang</span>
          </div>
        </div>
      </div>
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
const emailFocused = ref(false)
const passwordFocused = ref(false)

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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

* {
  box-sizing: border-box;
}

/* ========================
   PAGE LAYOUT
======================== */
.login-page {
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0e1a;
  position: relative;
  overflow: hidden;
}

/* ========================
   ANIMATED BACKGROUND
======================== */
.bg-animated {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: float 8s ease-in-out infinite;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, transparent 70%);
  top: -150px;
  left: -100px;
  animation-delay: 0s;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%);
  bottom: -100px;
  right: -50px;
  animation-delay: -3s;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -5s;
}

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 50px 50px;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) scale(1);
  }
  33% {
    transform: translateY(-30px) scale(1.05);
  }
  66% {
    transform: translateY(20px) scale(0.95);
  }
}

/* ========================
   WRAPPER
======================== */
.login-wrapper {
  position: relative;
  z-index: 10;
  display: flex;
  width: 100%;
  max-width: 900px;
  min-height: 540px;
  margin: 20px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.06),
    0 25px 80px rgba(0, 0, 0, 0.6),
    0 0 100px rgba(99, 102, 241, 0.1);
}

/* ========================
   BRAND PANEL (LEFT)
======================== */
.brand-panel {
  flex: 1;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #6d28d9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 40px;
  position: relative;
  overflow: hidden;
}

.brand-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(0, 0, 0, 0.2) 0%, transparent 50%);
}

.brand-panel::after {
  content: '';
  position: absolute;
  top: -50%;
  right: -30%;
  width: 100%;
  height: 200%;
  background: radial-gradient(ellipse, rgba(255, 255, 255, 0.05) 0%, transparent 60%);
  transform: rotate(-15deg);
}

.brand-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
}

.brand-icon {
  width: 72px;
  height: 72px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.brand-icon svg {
  width: 36px;
  height: 36px;
  color: white;
}

.brand-title {
  font-size: 26px;
  font-weight: 700;
  margin: 0 0 8px;
  letter-spacing: -0.5px;
}

.brand-subtitle {
  font-size: 14px;
  opacity: 0.75;
  margin: 0 0 40px;
  line-height: 1.5;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13.5px;
  opacity: 0.9;
}

.feature-icon {
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-icon svg {
  width: 16px;
  height: 16px;
  color: #a5f3fc;
}

/* ========================
   FORM PANEL (RIGHT)
======================== */
.form-panel {
  width: 380px;
  background: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 36px;
}

.form-card {
  width: 100%;
}

/* ========================
   FORM HEADER
======================== */
.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.form-logo {
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
}

.form-logo svg {
  width: 26px;
  height: 26px;
  color: white;
}

.form-title {
  font-size: 22px;
  font-weight: 700;
  color: #f9fafb;
  margin: 0 0 6px;
  letter-spacing: -0.3px;
}

.form-subtitle {
  font-size: 13.5px;
  color: #6b7280;
  margin: 0;
}

/* ========================
   FORM FIELDS
======================== */
.form-body {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 13px;
  font-weight: 500;
  color: #9ca3af;
  transition: color 0.2s;
}

.field-focused .field-label {
  color: #818cf8;
}

.field-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: #1f2937;
  border: 1.5px solid #374151;
  border-radius: 10px;
  transition: all 0.25s;
  overflow: hidden;
}

.field-focused .field-input-wrapper {
  border-color: #6366f1;
  background: #1e1f2e;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
}

.field-icon {
  padding: 0 12px 0 14px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.field-icon svg {
  width: 16px;
  height: 16px;
  color: #4b5563;
  transition: color 0.2s;
}

.field-focused .field-icon svg {
  color: #6366f1;
}

.field-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  color: #f3f4f6;
  padding: 13px 14px 13px 0;
  font-family: 'Inter', sans-serif;
}

.field-input::placeholder {
  color: #4b5563;
}

.toggle-password {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0 14px;
  display: flex;
  align-items: center;
  color: #4b5563;
  transition: color 0.2s;
}

.toggle-password:hover {
  color: #818cf8;
}

.toggle-password svg {
  width: 16px;
  height: 16px;
}

/* ========================
   FORM OPTIONS
======================== */
.form-options {
  display: flex;
  justify-content: flex-end;
  margin-top: -6px;
}

.forgot-link {
  font-size: 12.5px;
  color: #6366f1;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #818cf8;
  text-decoration: underline;
}

/* ========================
   ERROR MESSAGE
======================== */
.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 8px;
  padding: 10px 14px;
  color: #f87171;
  font-size: 13px;
}

.error-message svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

.error-fade-enter-active,
.error-fade-leave-active {
  transition: all 0.3s ease;
}

.error-fade-enter-from,
.error-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ========================
   SUBMIT BUTTON
======================== */
.submit-btn {
  width: 100%;
  padding: 13px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.35);
  margin-top: 4px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 28px rgba(99, 102, 241, 0.5);
  background: linear-gradient(135deg, #5b52f0, #8b48f3);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0px);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-text,
.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-text svg {
  width: 16px;
  height: 16px;
}

.spin-icon {
  width: 16px;
  height: 16px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ========================
   FORM FOOTER
======================== */
.form-footer {
  text-align: center;
  margin-top: 28px;
  font-size: 11.5px;
  color: #374151;
}

/* ========================
   RESPONSIVE
======================== */
@media (max-width: 700px) {
  .brand-panel {
    display: none;
  }

  .login-wrapper {
    max-width: 420px;
    border-radius: 20px;
  }

  .form-panel {
    width: 100%;
    padding: 36px 28px;
  }
}
</style>
