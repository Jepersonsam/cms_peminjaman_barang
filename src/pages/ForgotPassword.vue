<template>
  <div class="page">
    <!-- Animated Background -->
    <div class="bg-animated">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
      <div class="grid-overlay"></div>
    </div>

    <!-- Main Container -->
    <div class="wrapper">
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

          <div class="brand-info">
            <div class="info-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div class="info-text">
              <p class="info-title">Cek Kotak Masuk Anda</p>
              <p class="info-desc">
                Link reset password akan dikirim ke alamat email yang terdaftar dalam sistem.
              </p>
            </div>
          </div>

          <div class="brand-steps">
            <div class="step-item">
              <div class="step-num">1</div>
              <span>Masukkan email yang terdaftar</span>
            </div>
            <div class="step-divider"></div>
            <div class="step-item">
              <div class="step-num">2</div>
              <span>Cek kotak masuk email Anda</span>
            </div>
            <div class="step-divider"></div>
            <div class="step-item">
              <div class="step-num">3</div>
              <span>Klik link untuk reset password</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel - Form -->
      <div class="form-panel">
        <div class="form-card">
          <!-- SUCCESS STATE -->
          <transition name="slide-fade" mode="out-in">
            <div v-if="success" key="success" class="success-state">
              <div class="success-icon-wrap">
                <div class="success-ring"></div>
                <div class="success-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>
              <h2 class="success-title">Email Terkirim!</h2>
              <p class="success-desc">{{ success }}</p>
              <p class="success-hint">
                Tidak menerima email? Periksa folder <strong>Spam</strong> atau coba lagi.
              </p>
              <button class="btn-secondary" @click="resetForm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 .49-3.35" />
                </svg>
                Kirim Ulang
              </button>
              <span class="back-link" @click="router.push({ name: 'Login' })">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Kembali ke halaman login
              </span>
            </div>

            <!-- FORM STATE -->
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
                  </svg>
                </div>
                <h2 class="form-title">Lupa Password?</h2>
                <p class="form-subtitle">
                  Masukkan email Anda dan kami akan mengirimkan link untuk reset password.
                </p>
              </div>

              <form @submit.prevent="handleSubmit" class="form-body">
                <!-- Email Field -->
                <div
                  class="field-group"
                  :class="{ 'field-focused': emailFocused, 'field-filled': email }"
                >
                  <label class="field-label">Alamat Email</label>
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
                      @focus="emailFocused = true"
                      @blur="emailFocused = false"
                    />
                  </div>
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
                  :disabled="loading"
                >
                  <span v-if="!loading" class="btn-text">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    Kirim Link Reset Password
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
                    Mengirim...
                  </span>
                </button>

                <!-- Back to login -->
                <span class="back-link" @click="router.push({ name: 'Login' })">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  Kembali ke halaman login
                </span>
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
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const email = ref('')
const success = ref('')
const error = ref('')
const loading = ref(false)
const emailFocused = ref(false)

const router = useRouter()

const handleSubmit = async () => {
  error.value = ''
  success.value = ''
  loading.value = true

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/forgot-password', {
      email: email.value,
    })
    success.value = response.data.message || 'Link reset password telah dikirim ke email Anda.'
  } catch (err) {
    error.value = err.response?.data?.message || 'Terjadi kesalahan saat mengirim permintaan.'
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  success.value = ''
  error.value = ''
  email.value = ''
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

* {
  box-sizing: border-box;
}

/* ========================
   PAGE
======================== */
.page {
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
    transform: translateY(0) scale(1);
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
.wrapper {
  position: relative;
  z-index: 10;
  display: flex;
  width: 100%;
  max-width: 900px;
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
   BRAND PANEL
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
  margin: 0 0 32px;
  line-height: 1.5;
}

/* Info Box */
.brand-info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 14px;
  padding: 16px;
  text-align: left;
  margin-bottom: 28px;
}
.info-icon {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.info-icon svg {
  width: 18px;
  height: 18px;
}
.info-title {
  font-size: 13.5px;
  font-weight: 600;
  margin: 0 0 4px;
}
.info-desc {
  font-size: 12px;
  opacity: 0.75;
  margin: 0;
  line-height: 1.5;
}

/* Steps */
.brand-steps {
  display: flex;
  flex-direction: column;
  gap: 0;
  text-align: left;
}
.step-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  opacity: 0.9;
  padding: 6px 0;
}
.step-num {
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
}
.step-divider {
  width: 1px;
  height: 16px;
  background: rgba(255, 255, 255, 0.2);
  margin-left: 11.5px;
}

/* ========================
   FORM PANEL
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

/* Header */
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
  font-size: 22px;
  font-weight: 700;
  color: #f9fafb;
  margin: 0 0 8px;
  letter-spacing: -0.3px;
}
.form-subtitle {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
  line-height: 1.6;
}

/* Form Body */
.form-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Fields */
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

/* Error */
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

/* Submit Button */
.submit-btn {
  width: 100%;
  padding: 13px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.35);
}
.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 28px rgba(99, 102, 241, 0.5);
}
.submit-btn:active:not(:disabled) {
  transform: translateY(0);
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
  width: 15px;
  height: 15px;
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

/* Back Link */
.back-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.2s;
  margin-top: 4px;
}
.back-link:hover {
  color: #818cf8;
}
.back-link svg {
  width: 14px;
  height: 14px;
}

/* ========================
   SUCCESS STATE
======================== */
.success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  padding: 8px 0;
}

.success-icon-wrap {
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 8px;
}

.success-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgba(34, 197, 94, 0.3);
  animation: pulse-ring 2s ease-in-out infinite;
}
@keyframes pulse-ring {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.12);
    opacity: 1;
  }
}

.success-icon {
  position: absolute;
  inset: 8px;
  background: linear-gradient(135deg, #16a34a, #22c55e);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(34, 197, 94, 0.35);
}
.success-icon svg {
  width: 28px;
  height: 28px;
  color: white;
}

.success-title {
  font-size: 22px;
  font-weight: 700;
  color: #f9fafb;
  margin: 0;
}
.success-desc {
  font-size: 13.5px;
  color: #9ca3af;
  line-height: 1.6;
  margin: 0 0 4px;
}
.success-hint {
  font-size: 12.5px;
  color: #4b5563;
  margin: 0 0 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid #1f2937;
  border-radius: 8px;
  padding: 10px 14px;
  line-height: 1.5;
}
.success-hint strong {
  color: #6b7280;
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  background: #1f2937;
  border: 1.5px solid #374151;
  color: #d1d5db;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Inter', sans-serif;
  justify-content: center;
  margin-top: 4px;
}
.btn-secondary:hover {
  background: #283141;
  border-color: #4b5563;
  color: white;
}
.btn-secondary svg {
  width: 15px;
  height: 15px;
}

/* Slide Fade Transition */
.slide-fade-enter-active {
  transition: all 0.4s ease;
}
.slide-fade-leave-active {
  transition: all 0.25s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* Footer */
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
  .wrapper {
    max-width: 420px;
    border-radius: 20px;
  }
  .form-panel {
    width: 100%;
    padding: 36px 28px;
  }
}
</style>
