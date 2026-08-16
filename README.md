# ⛩️ Anime Explorer — Single Page Application (SPA)

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla%20JS%20(ES6+)-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![API](https://img.shields.io/badge/API-Kitsu%20REST%20API-red.svg)](https://kitsu.io/api/edge)
[![CSS3](https://img.shields.io/badge/CSS3-Dark%20Glassmorphism-blue.svg)](https://www.w3.org/Style/CSS/)

**Anime Explorer** adalah aplikasi katalog anime interaktif berbasis *Vanilla JavaScript* yang mengintegrasikan **Kitsu REST API**. Aplikasi ini dibangun dengan standar arsitektur *Separation of Concerns* (SoC), dilengkapi sistem navigasi *Dynamic Sliding Window Pagination*, penelusuran dengan optimasi *Debouncing*, sistem penyimpanan *Watchlist/Bookmark* lokal, pemutaran trailer YouTube, serta peningkatan pengalaman pengguna (*Skeleton Loading* & *Anti-Spam Toast Notification*).

---

## 🌟 Fitur Utama (Key Features)

- 🔍 **Live Realtime Search with Debounce**: Fitur pencarian instan yang dioptimalkan dengan teknik *debounce* (500ms) untuk mencegah *network overhead* dan pemborosan request ke API.
- 🎯 **Subtype Filtering**: Memfilter anime berdasarkan format rilis (*TV Series, Movie, OVA*).
- 🔢 **Dynamic Sliding Window Pagination**: Sistem pagination dinamis berbasis offset Kitsu API yang secara cerdas merender rentang 10 tombol angka aktif yang bergeser mengikuti navigasi pengguna, dilengkapi tombol kontrol `First`, `Prev`, `Next`, dan `Last`.
- 🎬 **Detail Modal with Embedded Trailer**: Modal popup responsif untuk melihat sinopsis lengkap, status tayang, episode, tanggal rilis, dan video trailer resmi YouTube tanpa berpindah halaman (*Single Page Experience*). Mendukung penutupan modal via tombol `Escape` dan *overlay click*.
- ❤️ **LocalStorage Watchlist / Bookmark System**: Pengguna dapat menyimpan anime favorit ke memori browser lokal. Dilengkapi fitur *Tab View Switcher* untuk beralih antara tampilan penjelajahan katalog utama dan daftar favorit.
- ⚡ **Skeleton Screen Loading**: Menggunakan animasi *shimmer effect* sebagai indikator memuat data agar transisi visual terasa mulus.
- 🔔 **Anti-Spam Toast Notification**: Notifikasi umpan balik aksi bookmark yang dilengkapi mekanisme *single-active toast* dan *click throttle* untuk mencegah tumpukan antarmuka akibat *spam click*.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Core**: HTML5 (Semantic Structure), CSS3 (Modern Responsive Grid, Flexbox, Custom Properties, Glassmorphism).
- **Scripting Logic**: Vanilla JavaScript (ES6+), Asynchronous JavaScript (`async`/`await`, `fetch`), DOM Event Delegation.
- **Data Source**: [Kitsu REST API (JSON:API Specification)](https://kitsu.io/api/edge).
- **State & Storage**: Browser `localStorage` API untuk sinkronisasi persistensi data *Watchlist*.

```text
anime-catalog/
│
├── index.html          # Markup semantik, container grid, modal & toast wrappers
├── css/
│   └── style.css       # Dark glassmorphism theme, responsive layout, animations
└── js/
    ├── api.js          # Layanan komunikasi HTTP Fetch ke Kitsu API
    ├── storage.js      # Pengelolaan operasi CRUD bookmark di LocalStorage
    └── app.js          # Controller utama: State, DOM rendering, pagination, events
```

---

## 🧠 Konsep & Pembelajaran Penting (What I Learned)

- **Separation of Concerns (SoC)**: Memisahkan tanggung jawab kode secara modular antara layer komunikasi data (`api.js`), layer persistensi lokal (`storage.js`), dan layer manipulasi antarmuka/DOM (`app.js`).
- **JSON:API Specification Handling**: Memahami dan mengolah format payload JSON standar industri (`data`, `attributes`, dan `meta.count`).
- **Mathematical Sliding Window Logic**: Mengembangkan algoritma pagination matematis menggunakan `Math.max()` dan `Math.min()` untuk menghitung batas jendela tombol halaman secara dinamis.
- **Performance & Memory Optimization**:
  - Menerapkan *Event Delegation* pada container grid untuk efisiensi event listener.
  - Menerapkan *Debounce Closure* pada kolom input pencarian.
  - Menerapkan *Execution Lock / Throttle* pada tombol aksi berfrekuensi tinggi.

---

## 🚀 Cara Menjalankan Secara Lokal (Getting Started)

1. **Clone repository ini:**
   ```bash
   git clone https://github.com/rakhaallea/anime_catalog_kitsu_api.git
   ```

2. **Masuk ke direktori proyek:**
   ```bash
   cd anime-catalog
   ```

3. **Buka di Browser:**
   - Cukup buka file `index.html` langsung di browser favoritmu, atau
   - Jalankan menggunakan ekstensi **Live Server** di VS Code untuk pengalaman terbaik.

---

## 📄 Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat file `LICENSE` untuk informasi lebih lanjut.