# ⛩️ Anime Explorer — Single Page Application (SPA)

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla%20JS%20(ES6+)-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![API](https://img.shields.io/badge/API-Kitsu%20REST%20API-red.svg)](https://kitsu.io/api/edge)
[![CSS3](https://img.shields.io/badge/UI%2FUX-3D%20Claymorphic%20%26%20Neo--Brutalist-blue.svg)](Design.md)
[![Font Awesome](https://img.shields.io/badge/Icons-Font%20Awesome%206-orange.svg)](https://fontawesome.com/)
[![Fonts](https://img.shields.io/badge/Typography-Nunito%20%26%20Quicksand-brightgreen.svg)](https://fonts.google.com/)

**Anime Explorer** adalah aplikasi katalog anime interaktif berbasis *Vanilla JavaScript* (SPA) yang mengintegrasikan **Kitsu REST API**. Aplikasi ini mengadopsi sistem desain **3D Claymorphic & Neo-Brutalist** dengan sentuhan retro yang ceria (*playful retro-toy aesthetic*), sudut membulat 28px, border gelap tegas, serta bayangan pop-out taktil.

Dibangun dengan standar arsitektur *Separation of Concerns* (SoC), proyek ini dilengkapi dengan sistem validasi formulir berbasis manipulasi DOM murni, kartu keanggotaan digital (**Otaku Pass**), sistem paginasi *Dynamic Sliding Window*, penelusuran dengan optimasi *Debouncing*, sistem penyimpanan *Watchlist* lokal, pemutar trailer resmi YouTube, tombol *Scroll to Top* dinamis (> 100vh), dan *custom scrollbar* tipis transparan.

---

## 🌟 Fitur Utama (Key Features)

- 🎨 **3D Claymorphic & Neo-Brutalist Design System**: Tampilan antarmuka retro modern mengacu pada spesifikasi [`Design.md`](Design.md) dengan palet *Cobalt Blue* (`#0047AB`), *Bright Yellow* (`#FFE000`), dan *Warm Cream* (`#F6EEDF`). Dilengkapi sudut kurva 28px dan efek elevasi taktil 3D.
- 🏷️ **Font Awesome 6 Iconography**: Standardisasi ikon resmi Font Awesome 6 pada seluruh elemen UI (header, tabs, cards, badges, modal, dan controls).
- 📝 **Interactive Form Validation (Pure DOM)**: Sistem registrasi akun dengan penanganan kondisi *Gagal* (border merah `.input-error`, pesan error dinamis per field, dan autofocus ke field pertama yang bermasalah) serta pembersihan pesan error secara real-time saat pengguna mengetik ulang.
- 🪪 **Virtual Otaku Member Pass (Arcade Trading Card)**: Kartu anggota virtual dengan nomor ID unik (misal: `#OTK-5539`), avatar, genre anime favorit, tanggal bergabung, dan barcode estetis yang langsung tersimpan di `localStorage`.
- 🔄 **Real-Time SPA Navbar Synchronization**: Perpindahan instan tanpa reload halaman antara tombol `[ Join Explorer ]` dan Badge Profil Pengguna (`Hi, [Username]!`, `[ Otaku Pass ]`, dan `[ Logout ]`).
- 🔍 **Live Realtime Search with Debounce**: Fitur pencarian instan yang dioptimalkan dengan teknik *debounce* (500ms) untuk mencegah *network overhead* dan pemborosan request ke API.
- 🎯 **Subtype & Format Filtering**: Memfilter anime berdasarkan format rilis (*TV Series, Movie, OVA*).
- 🔢 **Dynamic Sliding Window Pagination**: Sistem pagination dinamis berbasis offset Kitsu API yang secara cerdas merender rentang 10 tombol angka aktif yang bergeser mengikuti navigasi pengguna, dilengkapi kontrol `First`, `Prev`, `Next`, dan `Last`.
- 🎬 **Detail Modal with Embedded Trailer**: Modal popup responsif untuk melihat sinopsis lengkap, status tayang, episode, tanggal rilis, dan pemutaran trailer YouTube resmi. Mendukung penutupan modal via tombol `Escape` dan *overlay click*.
- ❤️ **LocalStorage Watchlist / Bookmark System**: Fitur simpan anime favorit ke memori browser lokal dengan *Tab View Switcher* sinkron antara grid katalog dan popup modal.
- ⬆️ **Smart Scroll to Top Button**: Tombol melayang *3D Neo-Brutalist* yang muncul secara otomatis ketika posisi scroll melewati **100vh** (`window.scrollY > window.innerHeight`) untuk navigasi cepat kembali ke puncak halaman.
- 📜 **Sleek & Transparent Custom Scrollbar**: Scrollbar kustom tipis (5px - 7px) dengan *track* 100% transparan pada halaman utama, kontainer modal, dan sinopsis anime.
- ⚡ **Skeleton Screen Loading**: Indikator memuat data dengan animasi *shimmer effect* yang selaras dengan bentuk kartu.
- 🔔 **Anti-Spam Toast Notification**: Notifikasi umpan balik aksi pengguna dengan penempatan cerdas bertingkat agar tidak bertumpukan dengan tombol mengambang.

---

## 🛠️ Tech Stack & Modular Architecture

- **Frontend Core**: HTML5 (Semantic Structure), CSS3 (Custom Properties, 3D Neo-Brutalism Shadows, Claymorphic Curves, Responsive Grid & Flexbox).
- **Scripting Logic**: Vanilla JavaScript (ES6+), Asynchronous JavaScript (`async`/`await`, `fetch`), DOM Event Delegation, Passive Event Listeners.
- **Iconography & Fonts**: Font Awesome 6 Free CDN, Google Fonts (Nunito & Quicksand).
- **Data Source**: [Kitsu REST API (JSON:API Specification)](https://kitsu.io/api/edge).
- **State & Storage**: Browser `localStorage` API untuk persistensi *Watchlist* dan *User Profile*.

```text
anime-catalog/
│
├── index.html          # Markup semantik, container grid, modal auth & pass, floating controls
├── Design.md           # Spesifikasi Design System (Warna, Tipografi, Elevasi, Aturan Desain)
├── css/
│   └── style.css       # 3D Claymorphic, neo-brutalist shadows, responsive layout, scrollbar
└── js/
    ├── api.js          # Service layer: Komunikasi HTTP Fetch ke Kitsu REST API
    ├── storage.js      # Persistence layer: Pengelolaan CRUD Bookmark & User Profile di LocalStorage
    ├── auth.js         # Auth controller: Validasi form DOM, status login SPA, modal Otaku Pass
    └── app.js          # Main controller: State, DOM rendering, pagination, scroll-to-top handler
```

---

## 🧠 Konsep & Pembelajaran Penting (What I Learned)

- **Separation of Concerns (SoC)**: Memisahkan tanggung jawab kode secara modular ke dalam 4 layer: komunikasi data (`api.js`), persistensi memori (`storage.js`), alur autentikasi & validasi form (`auth.js`), dan orkestrasi DOM utama (`app.js`).
- **Pure DOM Form Validation & Error Lifecycles**: Menangani validasi multi-input (panjang karakter, regex email, kecocokan konfirmasi password) dengan umpan balik visual real-time dan mekanisme *autofocus*.
- **Design System Implementation**: Menerjemahkan panduan desain formal (`Design.md`) menjadi CSS kustom berbasis variabel, memadukan estetika *Neo-Brutalist* dengan kelengkungan *Claymorphic*.
- **JSON:API Specification Handling**: Mengolah struktur data standar industri (`data`, `attributes`, dan `meta.count`).
- **Mathematical Sliding Window Logic**: Mengembangkan algoritma pagination dinamis menggunakan batas matematis `Math.max()` dan `Math.min()`.
- **Performance & Memory Optimization**:
  - *Event Delegation* pada grid container kartu untuk mengurangi memory footprint.
  - *Debounce Closure* pada kolom input pencarian untuk membatasi pemanggilan API.
  - *Passive Scroll Listener* untuk efisiensi render tombol *Scroll to Top*.

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