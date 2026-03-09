<template>
  <div class="reset-page">
    <!-- Animated Background -->
    <div class="bg-animated">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
      <div class="grid-overlay"></div>
    </div>

    <!-- Main Container -->
    <div class="reset-wrapper">
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
              <circle cx="12" cy="13" r="2" />
            </svg>
          </div>
          <h1 class="brand-title">CMS Peminjaman</h1>
          <p class="brand-subtitle">Sistem Manajemen Peminjaman Barang</p>

          <div class="security-info">
            <div class="security-item">
              <div class="security-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <span>Password dienkripsi dengan aman</span>
            </div>
            <div class="security-item">
              <div class="security-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <span>Link reset berlaku 60 menit</span>
            </div>
            <div class="security-item">
              <div class="security-icon">
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
              <span>Satu kali penggunaan per token</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel - Form -->
      <div class="form-panel">
        <div class="form-card">
          <!-- Loading State -->
          <transition name="fade-slide" mode="out-in">
            <div v-if="loadingToken" key="loading" class="state-screen">
              <div class="state-spinner">
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
              </div>
              <p class="state-text">Memvalidasi token keamanan...</p>
            </div>

            <!-- Token Error State -->
            <div v-else-if="tokenError" key="error" class="state-screen">
              <div class="state-icon error-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <h2 class="state-title error-title">Token Tidak Valid</h2>
              <p class="state-desc">{{ tokenError }}</p>
              <button @click="router.push({ name: 'ForgotPassword' })" class="state-btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Kembali ke Lupa Password
              </button>
            </div>

            <!-- Success State -->
            <div v-else-if="success" key="success" class="state-screen">
              <div class="state-icon success-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h2 class="state-title success-title">Password Berhasil Direset!</h2>
              <p class="state-desc">{{ success }}</p>
              <div class="redirect-info">
                <div class="redirect-bar">
                  <div class="redirect-progress"></div>
                </div>
                <span class="redirect-text">Mengalihkan ke halaman login...</span>
              </div>
            </div>

            <!-- Form State -->
            <div v-else key="form">
              <div class="form-header">
                <div class="form-logo">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                    <circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="none" />
                  </svg>
                </div>
                <h2 class="form-title">Buat Password Baru</h2>
                <p class="form-subtitle">Masukkan password baru yang kuat untuk akun Anda</p>
              </div>

              <form @submit.prevent="handleSubmit" class="form-body">
                <!-- Password Baru -->
                <div
                  class="field-group"
                  :class="{ 'field-focused': passwordFocused, 'field-filled': password }"
                >
                  <label class="field-label">Password Baru</label>
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
                      placeholder="Min. 8 karakter"
                      class="field-input"
                      @focus="passwordFocused = true"
                      @blur="passwordFocused = false"
                    />
                    <button
                      type="button"
                      class="toggle-password"
                      @click="showPassword = !showPassword"
                    >
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

                  <!-- Password Strength -->
                  <div v-if="password" class="strength-wrapper">
                    <div class="strength-bars">
                      <div
                        v-for="i in 4"
                        :key="i"
                        class="strength-bar"
                        :class="getStrengthBarClass(i)"
                      ></div>
                    </div>
                    <span class="strength-label" :class="strengthColor">{{ strengthLabel }}</span>
                  </div>
                </div>

                <!-- Konfirmasi Password -->
                <div
                  class="field-group"
                  :class="{ 'field-focused': confirmFocused, 'field-filled': passwordConfirmation }"
                >
                  <label class="field-label">Konfirmasi Password</label>
                  <div
                    class="field-input-wrapper"
                    :class="{
                      'field-mismatch': passwordConfirmation && password !== passwordConfirmation,
                    }"
                  >
                    <div class="field-icon">
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
                    <input
                      :type="showConfirm ? 'text' : 'password'"
                      v-model="passwordConfirmation"
                      required
                      placeholder="Ulangi password baru"
                      class="field-input"
                      @focus="confirmFocused = true"
                      @blur="confirmFocused = false"
                    />
                    <button
                      type="button"
                      class="toggle-password"
                      @click="showConfirm = !showConfirm"
                    >
                      <svg
                        v-if="!showConfirm"
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
                  <transition name="error-fade">
                    <p
                      v-if="passwordConfirmation && password !== passwordConfirmation"
                      class="match-error"
                    >
                      Password tidak cocok
                    </p>
                  </transition>
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
                  :class="{ loading: loading }"
                  :disabled="loading || (passwordConfirmation && password !== passwordConfirmation)"
                >
                  <span v-if="!loading" class="btn-text">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v14a2 2 0 01-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                    Simpan Password Baru
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
                    Menyimpan...
                  </span>
                </button>

                <!-- Back to Login -->
                <p class="back-link">
                  Sudah ingat password?
                  <span @click="router.push({ name: 'Login' })">Login di sini</span>
                </p>
              </form>
            </div>
          </transition>

          <div class="form-footer">
            <span>© 2025 CMS Peminjaman Barang</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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

const showPassword = ref(false)
const showConfirm = ref(false)
const passwordFocused = ref(false)
const confirmFocused = ref(false)

// -- Password Strength --
const strengthScore = computed(() => {
  const p = password.value
  if (!p) return 0
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  return score
})

const strengthLabel = computed(() => {
  const labels = ['', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat']
  return labels[strengthScore.value] || 'Sangat Lemah'
})

const strengthColor = computed(() => {
  const classes = ['', 'strength-weak', 'strength-fair', 'strength-good', 'strength-strong']
  return classes[strengthScore.value] || 'strength-weak'
})

const getStrengthBarClass = (index) => {
  if (index > strengthScore.value) return 'bar-empty'
  const classes = ['', 'bar-weak', 'bar-fair', 'bar-good', 'bar-strong']
  return classes[strengthScore.value]
}

// -- Validate Token on Mount --
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
      tokenError.value = res.data.message || 'Token tidak valid atau sudah kedaluwarsa.'
    }
  } catch (err) {
    tokenError.value =
      err.response?.data?.message || 'Gagal memvalidasi token. Token mungkin sudah kedaluwarsa.'
  } finally {
    loadingToken.value = false
  }
})

// -- Submit --
const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  if (password.value !== passwordConfirmation.value) {
    error.value = 'Password tidak cocok.'
    loading.value = false
    return
  }

  if (password.value.length < 8) {
    error.value = 'Password minimal 8 karakter.'
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

    success.value = res.data.message || 'Password berhasil direset. Silakan login kembali.'
    setTimeout(() => router.push({ name: 'Login' }), 2500)
  } catch (err) {
    error.value = err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.'
  } finally {
    loading.value = false
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
.reset-page {
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
.reset-wrapper {
  position: relative;
  z-index: 10;
  display: flex;
  width: 100%;
  max-width: 920px;
  min-height: 560px;
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

.security-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
}

.security-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13.5px;
  opacity: 0.9;
}

.security-icon {
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.security-icon svg {
  width: 14px;
  height: 14px;
  color: #a5f3fc;
}

/* ========================
   FORM PANEL (RIGHT)
======================== */
.form-panel {
  width: 400px;
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
   STATE SCREENS
======================== */
.state-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px 0;
  gap: 12px;
}

.state-spinner svg {
  width: 48px;
  height: 48px;
  color: #6366f1;
  animation: spin 0.8s linear infinite;
}

.state-text {
  color: #6b7280;
  font-size: 14px;
}

.state-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.state-icon svg {
  width: 36px;
  height: 36px;
}

.error-icon {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #f87171;
}

.success-icon {
  background: rgba(34, 197, 94, 0.12);
  border: 1px solid rgba(34, 197, 94, 0.25);
  color: #4ade80;
}

.state-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.3px;
}

.error-title {
  color: #f87171;
}
.success-title {
  color: #4ade80;
}

.state-desc {
  color: #6b7280;
  font-size: 13.5px;
  line-height: 1.6;
  max-width: 280px;
}

.state-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 10px 20px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 10px;
  color: #818cf8;
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s;
  font-family: 'Inter', sans-serif;
}

.state-btn:hover {
  background: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
  transform: translateY(-1px);
}

.state-btn svg {
  width: 15px;
  height: 15px;
}

/* Redirect Progress */
.redirect-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  width: 100%;
  max-width: 240px;
}

.redirect-bar {
  width: 100%;
  height: 3px;
  background: rgba(34, 197, 94, 0.15);
  border-radius: 99px;
  overflow: hidden;
}

.redirect-progress {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #4ade80);
  border-radius: 99px;
  animation: progress 2.5s linear forwards;
}

@keyframes progress {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}

.redirect-text {
  font-size: 12px;
  color: #4b5563;
}

/* ========================
   FORM HEADER
======================== */
.form-header {
  text-align: center;
  margin-bottom: 28px;
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
  font-size: 21px;
  font-weight: 700;
  color: #f9fafb;
  margin: 0 0 6px;
  letter-spacing: -0.3px;
}

.form-subtitle {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

/* ========================
   FORM FIELDS
======================== */
.form-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.field-mismatch {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
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
   PASSWORD STRENGTH
======================== */
.strength-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 2px;
}

.strength-bars {
  display: flex;
  gap: 4px;
  flex: 1;
}

.strength-bar {
  height: 3px;
  flex: 1;
  border-radius: 99px;
  transition: all 0.4s ease;
}

.bar-empty {
  background: #374151;
}
.bar-weak {
  background: #ef4444;
}
.bar-fair {
  background: #f97316;
}
.bar-good {
  background: #eab308;
}
.bar-strong {
  background: #22c55e;
}

.strength-label {
  font-size: 11px;
  font-weight: 500;
  min-width: 70px;
  text-align: right;
}

.strength-weak {
  color: #ef4444;
}
.strength-fair {
  color: #f97316;
}
.strength-good {
  color: #eab308;
}
.strength-strong {
  color: #22c55e;
}

/* ========================
   MATCH ERROR
======================== */
.match-error {
  font-size: 12px;
  color: #f87171;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
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
  opacity: 0.6;
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

/* ========================
   BACK LINK
======================== */
.back-link {
  text-align: center;
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

.back-link span {
  color: #6366f1;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.2s;
}

.back-link span:hover {
  color: #818cf8;
  text-decoration: underline;
}

/* ========================
   FORM FOOTER
======================== */
.form-footer {
  text-align: center;
  margin-top: 24px;
  font-size: 11.5px;
  color: #374151;
}

/* ========================
   TRANSITIONS
======================== */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.35s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* ========================
   ANIMATIONS
======================== */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spin-icon {
  width: 18px;
  height: 18px;
  animation: spin 0.8s linear infinite;
}

/* ========================
   RESPONSIVE
======================== */
@media (max-width: 700px) {
  .brand-panel {
    display: none;
  }

  .form-panel {
    width: 100%;
    padding: 32px 28px;
  }

  .reset-wrapper {
    margin: 0;
    border-radius: 0;
    min-height: 100vh;
  }
}
</style>
