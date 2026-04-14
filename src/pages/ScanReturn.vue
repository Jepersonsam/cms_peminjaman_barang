<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-3xl mx-auto">
      <div class="bg-white rounded-lg shadow-sm border p-6 mb-6 flex flex-col items-center">
        <div class="w-full flex justify-between items-center mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Scan Pengembalian Barang</h1>
            <p class="text-gray-600 mt-1">Gunakan scanner QR/Barcode atau masukkan kode manual untuk menemukan data peminjaman</p>
          </div>
        </div>

        <!-- Scanner Card -->
        <div class="bg-gray-100 rounded-xl p-4 w-full relative overflow-hidden flex flex-col items-center max-w-md">
          <!-- Camera View -->
          <div class="relative rounded-lg overflow-hidden bg-black shadow-inner aspect-square w-full mb-6">
            <qrcode-stream
              :key="scannerKey"
              @detect="onDetect"
              @init="onInit"
              class="w-full h-full object-cover"
            >
              <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div class="w-48 h-48 border-2 border-white/50 rounded-lg relative">
                  <div class="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-500 rounded-tl-sm"></div>
                  <div class="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-500 rounded-tr-sm"></div>
                  <div class="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-500 rounded-bl-sm"></div>
                  <div class="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-500 rounded-br-sm"></div>
                  <!-- Scanning Animation -->
                  <div class="absolute top-0 left-0 w-full h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-scan"></div>
                </div>
              </div>
            </qrcode-stream>
          </div>

          <!-- Manual Input -->
          <div class="w-full relative flex flex-col sm:flex-row items-center gap-3">
            <input
              v-model="manualCode"
              type="text"
              placeholder="Masukkan kode barang..."
              class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keyup.enter="submitManualCode"
              :disabled="!!scannedBorrowing"
            />
            <button
              @click="submitManualCode"
              class="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50"
              :disabled="isScanning || !!scannedBorrowing"
            >
              Cari
            </button>
          </div>
        </div>

        <!-- Scanned Borrowing Details Card -->
        <div v-if="scannedBorrowing" class="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6 w-full max-w-lg shadow-sm">
          <h2 class="text-xl font-bold text-gray-800 mb-4 border-b border-blue-200 pb-2">Detail Peminjaman</h2>
          
          <div class="space-y-3 mb-6 text-sm sm:text-base">
            <div class="flex justify-between items-center border-b border-blue-100 pb-2">
              <span class="text-gray-600">Status Peminjaman</span>
              <span class="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-yellow-100 text-yellow-800">Sedang Dipinjam</span>
            </div>
            <div class="flex justify-between border-b border-blue-100 pb-2">
              <span class="text-gray-600">Peminjam:</span>
              <span class="font-semibold text-gray-900">{{ scannedBorrowing.user?.name || '-' }}</span>
            </div>
            <div class="flex justify-between border-b border-blue-100 pb-2">
              <span class="text-gray-600">Barang:</span>
              <span class="font-semibold text-gray-900">{{ scannedBorrowing.item?.name || '-' }}</span>
            </div>
            <div class="flex justify-between border-b border-blue-100 pb-2">
              <span class="text-gray-600">Tanggal Pinjam:</span>
              <span class="font-semibold text-gray-900">{{ formatDate(scannedBorrowing.borrow_date) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Jadwal Pengembalian:</span>
              <span class="font-semibold text-red-600">{{ formatDate(scannedBorrowing.return_date) }}</span>
            </div>
          </div>
          
          <div v-if="lateDays > 0" class="mb-6 flex justify-between items-center p-3 bg-red-50 border border-red-200 rounded-lg">
             <span class="text-red-700 font-semibold flex items-center gap-2 text-sm sm:text-base">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                Terlambat Dikembalikan
             </span>
             <span class="font-bold text-red-700 bg-red-200 px-2.5 py-1 rounded text-sm whitespace-nowrap">{{ lateDays }} Hari</span>
          </div>

          <div class="flex flex-col sm:flex-row gap-3">
            <button
              @click="processReturn"
              class="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg shadow-sm transition-colors text-center"
            >
              Dikembalikan
            </button>
            <button
              @click="cancelReturn"
              class="px-4 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition-colors"
            >
              Batal
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { QrcodeStream } from 'vue-qrcode-reader'
import axios from '@/services/api'
import Swal from 'sweetalert2'

const manualCode = ref('')
const isScanning = ref(false)
const scannerKey = ref(0)
const allBorrowings = ref([])
const scannedBorrowing = ref(null)

onMounted(async () => {
  await fetchBorrowings()
})

const lateDays = computed(() => {
  if (!scannedBorrowing.value?.return_date) return 0
  const returnDate = new Date(scannedBorrowing.value.return_date)
  const today = new Date()
  
  returnDate.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  
  if (today > returnDate) {
    const diffTime = Math.abs(today - returnDate)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
  return 0
})

const fetchBorrowings = async () => {
  try {
    const res = await axios.get('/borrowings')
    allBorrowings.value = res.data.data || []
  } catch (err) {
    console.error('Error fetching borrowings:', err)
  }
}

const onDetect = async (detectedCodes) => {
  // Hanya proses jika belum ada data peminjaman yang sedang ditampilkan
  if (!scannedBorrowing.value && detectedCodes && detectedCodes.length > 0) {
    const serialCode = detectedCodes[0].rawValue
    if (serialCode) {
      await handleReturnScan(serialCode)
    }
  }
}

const submitManualCode = async () => {
  if (!manualCode.value.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Kode Kosong',
      text: 'Silakan masukkan kode barang terlebih dahulu.',
    })
    return
  }
  await handleReturnScan(manualCode.value)
}

const handleReturnScan = async (code) => {
  if (isScanning.value) return
  isScanning.value = true
  const trimmedCode = code.trim()
  
  // Jika kode barcode berupa URL (cth: http://domain.com/barang/KODE123), coba ambil bagian terakhirnya
  let possibleCode = trimmedCode
  if (trimmedCode.includes('/')) {
    possibleCode = trimmedCode.substring(trimmedCode.lastIndexOf('/') + 1)
  }

  try {
    // Pastikan data terbaru
    await fetchBorrowings()
    
    // Cari peminjaman yang cocok dengan kode barang dan belum dikembalikan
    const targetBorrowing = allBorrowings.value.find(b => {
      const serial = b.item?.serial_code;
      const isMatch = serial === trimmedCode || serial === possibleCode;
      const isNotReturned = !b.is_returned || b.is_returned === '0' || b.is_returned === 0;
      const isApproved = b.approval_status === 'approved' || !b.approval_status;
      return isMatch && isNotReturned && isApproved;
    });

    if (targetBorrowing) {
      scannedBorrowing.value = targetBorrowing
      manualCode.value = targetBorrowing.item?.serial_code || possibleCode
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Tidak Ditemukan',
        text: `Barang dengan kode "${trimmedCode}" tidak ditemukan di data peminjaman aktif. (Pastikan barang sedang dipinjam dan sudah disetujui)`,
      })
      scannedBorrowing.value = null
    }
  } catch (err) {
    console.error('Gagal mencocokkan barang:', err)
    let errorMessage = err.response?.data?.message || 'Terjadi kesalahan sistem.'
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: errorMessage,
    })
  } finally {
    isScanning.value = false
    scannerKey.value += 1 // Refresh scanner component
  }
}

const processReturn = async () => {
  if (!scannedBorrowing.value) return

  try {
    // Tandai sebagai dikembalikan
    await axios.put(`/borrowings/${scannedBorrowing.value.id}`, { is_returned: true })
    
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: `Barang "${scannedBorrowing.value.item?.name}" berhasil dikembalikan dan siap dipinjam kembali.`,
      timer: 3000,
      showConfirmButton: false
    })
    
    // Reset state 
    scannedBorrowing.value = null
    manualCode.value = ''
    await fetchBorrowings()
  } catch (err) {
    console.error('Gagal memproses pengembalian:', err)
    let errorMessage = err.response?.data?.message || 'Terjadi kesalahan saat memproses.'
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: errorMessage,
    })
  }
}

const cancelReturn = () => {
  scannedBorrowing.value = null
  manualCode.value = ''
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const onInit = (promise) => {
  promise.catch((err) => {
    Swal.fire({
      icon: 'error',
      title: 'Kamera Tidak Terakses',
      text: 'Pastikan izin kamera sudah diberikan atau perangkat memiliki kamera.',
    })
    console.error('Init scanner gagal:', err)
  })
}
</script>

<style scoped>
@keyframes scan {
  0% { top: 0; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}
.animate-scan {
  animation: scan 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
</style>
