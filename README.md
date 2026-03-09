# CMS Peminjaman Barang & Ruangan

Sistem manajemen peminjaman barang dan ruangan berbasis web yang dibangun dengan Vue 3 dan Laravel. Aplikasi ini menyediakan fitur lengkap untuk mengelola inventaris, peminjaman, pengguna, dan notifikasi pengingat pengembalian.

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Persyaratan Sistem](#-persyaratan-sistem)
- [Instalasi](#-instalasi)
- [Konfigurasi](#-konfigurasi)
- [Penggunaan](#-penggunaan)
- [Struktur Project](#-struktur-project)
- [API Endpoints](#-api-endpoints)
- [Fitur Notifikasi Pengingat](#-fitur-notifikasi-pengingat-pengembalian)
- [Development](#-development)

## ✨ Fitur Utama

### 1. Dashboard

- Statistik lengkap sistem
- Grafik visualisasi data (Doughnut, Bar, Pie, Line Chart)
- Overview peminjaman, item, kategori, dan ruangan

### 2. Manajemen Users

- CRUD pengguna
- Manajemen role dan permission
- Sistem autentikasi dan autorisasi

### 3. Manajemen Item

- CRUD barang inventaris
- Kategori barang
- Status ketersediaan
- Sistem persetujuan peminjaman

### 4. Manajemen Kategori

- CRUD kategori barang
- Relasi dengan item
- Filter dan pencarian

### 5. Manajemen Peminjaman Barang

- CRUD peminjaman
- Status persetujuan (Pending, Approved, Rejected)
- Tracking pengembalian
- **Notifikasi pengingat pengembalian** (1 hari sebelum jatuh tempo)
- Export PDF dan Excel

### 6. Manajemen Ruangan

- CRUD ruangan
- Manajemen lokasi
- Peminjaman ruangan

### 7. Manajemen Meeting Schedule

- CRUD jadwal meeting
- Peminjaman ruangan terjadwal

## 🛠 Teknologi yang Digunakan

### Frontend

- **Vue 3** - Framework JavaScript progresif
- **Vite** - Build tool dan dev server
- **Vue Router** - Routing
- **Pinia** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - CSS framework
- **Chart.js** & **vue-chartjs** - Data visualization
- **SweetAlert2** - Alert notifications
- **jsPDF** & **jspdf-autotable** - PDF export
- **xlsx** - Excel export

### Backend (Laravel)

- Laravel Framework
- Laravel Sanctum (API Authentication)
- Spatie Laravel Permission (Role & Permission)
- Laravel Notifications (Email)

## 📦 Persyaratan Sistem

- Node.js >= 18.x
- npm atau yarn
- Backend Laravel API (terpisah)
- Browser modern (Chrome, Firefox, Edge, Safari)

## 🚀 Instalasi

### 1. Clone Repository

```sh
git clone <repository-url>
cd cms-peminjaman-barang
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Konfigurasi Environment

Buat file `.env` di root project (jika belum ada) dan sesuaikan konfigurasi:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

### 4. Jalankan Development Server

```sh
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

## ⚙️ Konfigurasi

### Konfigurasi API

File konfigurasi API berada di `src/services/api.js`. Pastikan `baseURL` sesuai dengan backend Laravel:

```javascript
baseURL: 'http://127.0.0.1:8000/api'
```

### Konfigurasi Backend

Pastikan backend Laravel sudah dikonfigurasi dengan:

- CORS enabled untuk frontend URL
- Laravel Sanctum untuk autentikasi
- Email configuration (SMTP) untuk fitur notifikasi

## 📖 Penggunaan

### Login

1. Akses halaman login
2. Masukkan email dan password
3. Setelah login, Anda akan diarahkan ke Dashboard

### Manajemen Peminjaman

1. Navigasi ke **Manajemen Peminjaman Barang**
2. Klik **Tambah Peminjaman** untuk membuat peminjaman baru
3. Pilih user, item, dan tanggal pinjam/kembali
4. Sistem akan otomatis menentukan status persetujuan berdasarkan kebutuhan item

### Notifikasi Pengingat Pengembalian

1. Di halaman **Manajemen Peminjaman Barang**
2. Button **"Kirim Notifikasi"** akan muncul otomatis untuk peminjaman yang:
   - Status: **Approved**
   - Belum dikembalikan
   - **1 hari sebelum** atau pada tanggal jatuh tempo pengembalian
3. Klik button untuk mengirim email pengingat ke peminjam

### Export Data

1. Klik button **Export** di halaman list
2. Pilih format: **PDF** atau **Excel**
3. File akan otomatis terdownload

## 📁 Struktur Project

```
cms-peminjaman-barang/
├── src/
│   ├── assets/          # Static assets (images, etc)
│   ├── components/      # Reusable Vue components
│   │   ├── charts/      # Chart components (Doughnut, Bar, Pie, Line)
│   │   ├── Navbar.vue
│   │   └── Sidebar.vue
│   ├── layouts/         # Layout components
│   │   └── MainLayout.vue
│   ├── pages/           # Page components
│   │   ├── Dashboard.vue
│   │   ├── BorrowingList.vue
│   │   ├── BorrowingForm.vue
│   │   ├── ItemList.vue
│   │   ├── CategoryList.vue
│   │   └── ...
│   ├── router/          # Vue Router configuration
│   │   └── index.js
│   ├── services/        # API services
│   │   └── api.js
│   ├── stores/          # Pinia stores
│   │   └── UserStore.js
│   ├── utils/           # Utility functions
│   │   └── chartConfig.js
│   ├── App.vue
│   └── main.js
├── public/
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication

- `POST /api/login` - Login user
- `POST /api/logout` - Logout user
- `POST /api/forgot-password` - Request password reset

### Borrowings

- `GET /api/borrowings` - List semua peminjaman
- `POST /api/borrowings` - Buat peminjaman baru
- `GET /api/borrowings/{id}` - Detail peminjaman
- `PUT /api/borrowings/{id}` - Update peminjaman
- `DELETE /api/borrowings/{id}` - Hapus peminjaman
- `POST /api/borrowings/{id}/send-return-reminder` - Kirim notifikasi pengingat

### Items

- `GET /api/items` - List semua item
- `POST /api/items` - Buat item baru
- `GET /api/items/{id}` - Detail item
- `PUT /api/items/{id}` - Update item
- `DELETE /api/items/{id}` - Hapus item

### Categories

- `GET /api/categories` - List semua kategori
- `POST /api/categories` - Buat kategori baru
- `GET /api/categories/{id}` - Detail kategori
- `PUT /api/categories/{id}` - Update kategori
- `DELETE /api/categories/{id}` - Hapus kategori

## 📧 Fitur Notifikasi Pengingat Pengembalian

### Alur Kerja

1. **Kondisi Tampil Button**

   - Peminjaman belum dikembalikan (`is_returned = false`)
   - Status persetujuan: `approved`
   - Tanggal `return_date` = hari ini atau besok (≤ 1 hari sebelum jatuh tempo)

2. **Proses Pengiriman**

   - User klik button **"Kirim Notifikasi"**
   - Frontend mengirim request ke: `POST /api/borrowings/{id}/send-return-reminder`
   - Backend memproses dan mengirim email ke peminjam
   - Email berisi:
     - Detail peminjaman (nama peminjam, barang, tanggal)
     - Sisa hari hingga jatuh tempo
     - Link ke frontend untuk detail peminjaman

3. **Notifikasi Email**
   - Email dikirim menggunakan Laravel Notifications
   - Format: `ReturnReminderNotification`
   - Menggunakan template email Laravel

### Konfigurasi Email Backend

Pastikan di backend Laravel (`.env`):

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"
```

### Route Backend yang Diperlukan

Tambahkan route berikut di `routes/api.php`:

```php
Route::middleware('auth:api')->group(function () {
    // ... routes lainnya ...

    Route::post('/borrowings/{id}/send-return-reminder',
        [BorrowingControllerApi::class, 'sendReturnReminder']);
});
```

## 🛠 Development

### Development Server

```sh
npm run dev
```

### Build untuk Production

```sh
npm run build
```

### Preview Production Build

```sh
npm run preview
```

### Format Code

```sh
npm run format
```

### Run Tests

```sh
npm run test:unit
```

## 📝 Catatan

- Pastikan backend Laravel sudah berjalan sebelum menggunakan aplikasi
- Untuk fitur notifikasi email, pastikan konfigurasi SMTP sudah benar
- Button notifikasi hanya muncul untuk peminjaman yang memenuhi kriteria
- Semua route memerlukan autentikasi kecuali login dan forgot password

## 📄 License

Private Project

## 👥 Author

Samuel Marcel Jeperson Hasibuan

---

**Note**: Dokumentasi ini akan terus diperbarui seiring dengan perkembangan aplikasi.
