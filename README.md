# BelanjaYuk Web Apps (e-Commerce)

Sistem e-Commerce modern berbasis **.NET 8 Web API** dan **React Single Page Application (SPA)** yang terintegrasi penuh dengan 12 Tabel ERD Database (Lookup, Master, dan Transaksi).

---

## 🌟 Fitur Utama (Feature Scope)

1. **Authentication & Security (JWT)**
   - **Register User:** Pendaftaran pengguna baru (`MsUser` & `MsUserPassword`).
   - **Login User:** Login menggunakan **Email ATAU Nomor Telepon** + Password. Mengembalikan token JWT yang aman.

2. **Beranda & Browsing Produk**
   - **Header dengan Search:** Bilah pencarian produk secara *real-time*.
   - **Katalog Produk Default:** Menampilkan daftar produk (`MsProduct`) lengkap dengan kategori (`LtCategory`), gambar (`TrProductImages`), harga asli (`Price`), diskon produk (`DiscountProduct`), dan harga akhir setelah diskon (`DiscountedPrice`).

3. **Cart Management (Pembeli)**
   - **Manajemen Keranjang (`TrBuyerCart`):** Menambah produk, mengubah jumlah (*quantity*), serta menghapus item dari keranjang.
   - **Kalkulasi Rincian Harga:** Menghitung Total Harga Asli, Total Hemat/Diskon, dan Total Akhir Pembayaran secara otomatis.
   - **Pilihan Metode Pembayaran (`LtPayment`):** Mendukung pilihan **Transfer Bank** dan **Cash On Delivery (COD)**.

4. **Checkout & Order History**
   - **Checkout Process:** Mengubah item di keranjang menjadi transaksi di `TrBuyerTransaction` & `TrBuyerTransactionDetail`, memotong stok produk (`Qty`), dan mengosongkan keranjang.
   - **Riwayat Pesanan:** Menampilkan histori transaksi pengguna.

---

## 📐 Arsitektur Sistem & Struktur ERD Database

Aplikasi menerapkan **Clean Architecture** pada Backend .NET 8 dan **Component-based State Management** pada Frontend React SPA:

### 12 Tabel ERD Database:
1. **`LtGender`**: Lookup data jenis kelamin (`IdGender`, `GenderName`).
2. **`LtCategory`**: Lookup kategori produk (`IdCategory`, `CategoryName`).
3. **`LtPayment`**: Lookup metode pembayaran (`IdPayment`, `PaymentName`).
4. **`MsUser`**: Data master pengguna (`IdUser`, `UserName`, `Email`, `PhoneNumber`, `FirstName`, `LastName`, `DOB`, `IdGender`).
5. **`MsUserPassword`**: Hash password pengguna berelasi 1-to-1 dengan `MsUser`.
6. **`MsUserSeller`**: Data master toko/penjual (`IdUserSeller`, `IdUser`, `SellerName`, `SellerDesc`, `Address`, `SellerCode`, `PhoneNumber`).
7. **`MsProduct`**: Data master produk (`IdProduct`, `IdUserSeller`, `ProductName`, `ProductDesc`, `IdCategory`, `Price`, `DiscountProduct`, `Qty`).
8. **`TrProductImages`**: Foto/gambar produk (`IdProductImages`, `IdProduct`, `ProductImage`).
9. **`TrHomeAddress`**: Alamat pengiriman pengguna (`IdHomeAddress`, `IdUser`, `Provinsi`, `KotaKabupaten`, `Kecamatan`, `KodePos`, `HomeAddressDesc`).
10. **`TrBuyerCart`**: Keranjang belanja pembeli (`IdBuyerCart`, `IdUser`, `IdProduct`, `Qty`).
11. **`TrBuyerTransaction`**: Header transaksi pembeli (`IdBuyerTransaction`, `IdUser`, `IdPayment`, `FinalPrice`, `Rating`, `RatingComment`).
12. **`TrBuyerTransactionDetail`**: Detail item transaksi (`IdBuyerTransactionDetail`, `IdBuyerTransaction`, `IdProduct`, `Qty`, `PriceProduct`, `DiscountProduct`).

Setiap tabel dilengkapi kolom audit penjelas: `DateIn`, `UserIn`, `DateUp`, `UserUp`, `IsActive`.

---

## 🔑 Kredensial Testing / Dummy Accounts

Gunakan kredensial berikut untuk melakukan pengujian langsung pada aplikasi:

| Role | Email / No. HP | Password | Deskripsi |
|---|---|---|---|
| **Buyer 1** | `buyer@belanjayuk.com` / `081234567890` | `Password123!` | Akun pembeli bawaan |
| **Buyer 2** | `stephanie@belanjayuk.com` / `089876543210` | `Password123!` | Akun pembeli testing |

---

## 🚀 Langkah Menjalankan Aplikasi

### Metode 1: Menjalankan Menggunakan Docker (Rekomendasi)

Pastikan **Docker** dan **Docker Compose** telah terpasang di sistem Anda.

1. Buka terminal pada direktori utama proyek (`d:\BelanjaYuk - Technical Test - Stephanie Halim`).
2. Jalankan perintah berikut untuk membangun dan menjalankan seluruh kontainer (`db`, `api`, `frontend`):

```bash
docker-compose up --build
```

3. Akses aplikasi melalui browser:
   - **Frontend WebClient:** `http://localhost`
   - **Backend RESTful API Swagger UI:** `http://localhost:5000/swagger`
   - **Database PostgreSQL:** `localhost:5432` (User: `postgres`, Password: `postgres`, Database: `belanjayuk_db`)

---

### Metode 2: Menjalankan Secara Lokal (Development Mode)

#### 1. Menjalankan Backend API (.NET 8)
```bash
cd backend
dotnet restore
dotnet run --project src/BelanjaYuk.Api
```
API akan berjalan di `http://localhost:5000` (atau port yang tertera pada konsol).

#### 2. Menjalankan Frontend SPA (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Frontend akan berjalan di `http://localhost:5173`.

---

## ⚙️ Konfigurasi Environment Variables

### Backend (`backend/src/BelanjaYuk.Api/appsettings.json`):
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=db;Port=5432;Database=belanjayuk_db;Username=postgres;Password=postgres"
  },
  "JwtSettings": {
    "Secret": "BelanjaYukSuperSecretKey1234567890!@#$%_SignatureTokenKeyForAuth2026",
    "Issuer": "BelanjaYukApi",
    "Audience": "BelanjaYukWebClient"
  }
}
```

---

## 📁 Berkas Penyerahan (Submission Deliverables)
- `backend/` : Source code .NET 8 Web API (Domain, Application, Infrastructure, Api)
- `frontend/` : Source code React SPA TypeScript (Components, Context, Services, Types)
- `init-db.sql` : Skrip SQL DDL Schema & Seed Data 12 Tabel ERD
- `docker-compose.yml` & `Dockerfile` : Konfigurasi Docker multi-container
- `README.md` : Dokumentasi lengkap aplikasi
