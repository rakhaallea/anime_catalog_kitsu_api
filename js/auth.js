// ==========================================
// MODUL AUTENTIKASI, VALIDASI & OTAKU PASS
// ==========================================

// Inisialisasi DOM Elements Auth
const registerModal = document.getElementById('registerModal');
const openRegisterBtn = document.getElementById('openRegisterBtn');
const closeRegisterBtn = document.getElementById('closeRegisterBtn');
const registerForm = document.getElementById('registerForm');

// Input fields
const regUsername = document.getElementById('regUsername');
const regEmail = document.getElementById('regEmail');
const regGenre = document.getElementById('regGenre');
const regPassword = document.getElementById('regPassword');
const regConfirmPassword = document.getElementById('regConfirmPassword');

// Error containers
const errorUsername = document.getElementById('errorUsername');
const errorEmail = document.getElementById('errorEmail');
const errorGenre = document.getElementById('errorGenre');
const errorPassword = document.getElementById('errorPassword');
const errorConfirmPassword = document.getElementById('errorConfirmPassword');

// Navbar Auth Elements
const userBadgeContainer = document.getElementById('userBadgeContainer');
const navAvatar = document.getElementById('navAvatar');
const navUsername = document.getElementById('navUsername');
const viewPassBtn = document.getElementById('viewPassBtn');
const logoutBtn = document.getElementById('logoutBtn');
const openProfileBtn = document.getElementById('openProfileBtn');

// Otaku Pass Modal Elements
const otakuPassModal = document.getElementById('otakuPassModal');
const closePassBtn = document.getElementById('closePassBtn');
const passAvatar = document.getElementById('passAvatar');
const passUsername = document.getElementById('passUsername');
const passGenre = document.getElementById('passGenre');
const passJoinedDate = document.getElementById('passJoinedDate');
const passMemberId = document.getElementById('passMemberId');

// HELPER: Format Tanggal Hari Ini (Indonesia)
function getFormattedCurrentDate() {
    const today = new Date();
    return today.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

// HELPER: Bersihkan Pesan Error dan Border Merah pada Input Tertentu
function clearFieldError(inputEl, errorEl) {
    if (inputEl) inputEl.classList.remove('input-error');
    if (errorEl) errorEl.textContent = '';
}

// HELPER: Tampilkan Pesan Error dan Beri Border Merah
function setFieldError(inputEl, errorEl, message) {
    if (inputEl) inputEl.classList.add('input-error');
    if (errorEl) errorEl.textContent = message;
}

// FUNGSI BUKA / TUTUP MODAL REGISTRASI
function openRegisterModal() {
    if (!registerModal) return;
    registerModal.classList.remove('hidden');
    clearAllFormErrors();
    if (regUsername) regUsername.focus();
}

function closeRegisterModal() {
    if (!registerModal) return;
    registerModal.classList.add('hidden');
    if (registerForm) registerForm.reset();
    clearAllFormErrors();
}

// FUNGSI BERSIHKAN SEMUA ERROR DI FORM
function clearAllFormErrors() {
    clearFieldError(regUsername, errorUsername);
    clearFieldError(regEmail, errorEmail);
    clearFieldError(regGenre, errorGenre);
    clearFieldError(regPassword, errorPassword);
    clearFieldError(regConfirmPassword, errorConfirmPassword);
}

// FUNGSI BUKA / TUTUP OTAKU PASS (VIRTUAL MEMBER CARD)
function openOtakuPassModal(profile) {
    if (!otakuPassModal) return;

    const user = profile || getUserProfile();
    if (!user) {
        showToast('Profil pengguna tidak ditemukan.', 'error');
        return;
    }

    if (passAvatar) passAvatar.textContent = (user.username || 'U').charAt(0).toUpperCase();
    if (passUsername) passUsername.textContent = user.username || 'Anonymous';
    if (passGenre) passGenre.textContent = user.favoriteGenre || 'All Genres';
    if (passJoinedDate) passJoinedDate.textContent = user.joinedDate || getFormattedCurrentDate();
    if (passMemberId) passMemberId.textContent = `#${user.memberId || 'OTK-0000'}`;

    otakuPassModal.classList.remove('hidden');
}

function closeOtakuPassModal() {
    if (!otakuPassModal) return;
    otakuPassModal.classList.add('hidden');
}

// UPDATE TAMPILAN NAVBAR BERDASARKAN STATUS LOGIN (SPA DOM MANIPULATION)
function updateAuthUI(profile) {
    if (profile) {
        // User dalam keadaan Logged-in
        if (openRegisterBtn) openRegisterBtn.classList.add('hidden');
        if (userBadgeContainer) {
            userBadgeContainer.classList.remove('hidden');
            if (navUsername) navUsername.textContent = profile.username;
            if (navAvatar) navAvatar.textContent = (profile.username || 'U').charAt(0).toUpperCase();
        }
    } else {
        // User dalam keadaan Guest / Belum Login
        if (openRegisterBtn) openRegisterBtn.classList.remove('hidden');
        if (userBadgeContainer) userBadgeContainer.classList.add('hidden');
    }
}

// LOGIKA VALIDASI FORM REGISTRASI
function validateAndRegister(e) {
    e.preventDefault();
    clearAllFormErrors();

    let isValid = true;
    let firstErrorInput = null;

    const usernameVal = regUsername.value.trim();
    const emailVal = regEmail.value.trim();
    const genreVal = regGenre.value;
    const passwordVal = regPassword.value;
    const confirmPasswordVal = regConfirmPassword.value;

    // 1. Validasi Username: minimal 3 karakter
    if (usernameVal.length < 3) {
        setFieldError(regUsername, errorUsername, 'Username minimal 3 karakter.');
        isValid = false;
        if (!firstErrorInput) firstErrorInput = regUsername;
    }

    // 2. Validasi Email: format email standar regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailVal)) {
        setFieldError(regEmail, errorEmail, 'Format email tidak valid (contoh: user@mail.com).');
        isValid = false;
        if (!firstErrorInput) firstErrorInput = regEmail;
    }

    // 3. Validasi Genre Favorit: wajib dipilih
    if (!genreVal || genreVal === '') {
        setFieldError(regGenre, errorGenre, 'Silakan pilih genre anime favoritmu.');
        isValid = false;
        if (!firstErrorInput) firstErrorInput = regGenre;
    }

    // 4. Validasi Password: minimal 8 karakter
    if (passwordVal.length < 8) {
        setFieldError(regPassword, errorPassword, 'Password minimal 8 karakter.');
        isValid = false;
        if (!firstErrorInput) firstErrorInput = regPassword;
    }

    // 5. Validasi Konfirmasi Password: harus sama dengan password
    if (confirmPasswordVal !== passwordVal || confirmPasswordVal === '') {
        setFieldError(regConfirmPassword, errorConfirmPassword, 'Konfirmasi password tidak cocok.');
        isValid = false;
        if (!firstErrorInput) firstErrorInput = regConfirmPassword;
    }

    // KONDISI GAGAL: Fokuskan kursor ke input pertama yang bermasalah & jangan tutup form
    if (!isValid) {
        if (firstErrorInput) {
            firstErrorInput.focus();
        }
        return;
    }

    // KONDISI BERHASIL: Buat profil pengguna baru
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const newProfile = {
        username: usernameVal,
        email: emailVal,
        favoriteGenre: genreVal,
        memberId: `OTK-${randomId}`,
        joinedDate: getFormattedCurrentDate()
    };

    // A. Simpan ke LocalStorage
    saveUserProfile(newProfile);

    // B. Umpan Balik Instan: Tutup Modal & Reset Form
    closeRegisterModal();

    // C. Toast Notification Sukses
    if (typeof showToast === 'function') {
        showToast(`🎉 Welcome aboard, ${newProfile.username}! Your Otaku ID has been created.`, 'success');
    }

    // D. Manipulasi Navbar DOM secara instan (SPA)
    updateAuthUI(newProfile);

    // E. Tampilkan Virtual Otaku Pass / Member Card langsung untuk efek visual yang menarik saat demo
    setTimeout(() => {
        openOtakuPassModal(newProfile);
    }, 400);
}

// LOGOUT PENGGUNA
function handleLogout() {
    const confirmLogout = confirm('Apakah kamu yakin ingin keluar dari Otaku Explorer?');
    if (!confirmLogout) return;

    clearUserProfile();
    updateAuthUI(null);
    closeOtakuPassModal();

    if (typeof showToast === 'function') {
        showToast('Anda telah logout. Sampai jumpa lagi!', 'info');
    }
}

// INISIALISASI EVENT LISTENERS & CEK STATUS LOGIN AWAL
function initAuth() {
    // 1. Cek persistensi LocalStorage saat halaman pertama kali dibuka
    const existingProfile = getUserProfile();
    updateAuthUI(existingProfile);

    // 2. Event Tombol Buka/Tutup Modal Registrasi
    if (openRegisterBtn) {
        openRegisterBtn.addEventListener('click', openRegisterModal);
    }
    if (closeRegisterBtn) {
        closeRegisterBtn.addEventListener('click', closeRegisterModal);
    }

    if (registerModal) {
        registerModal.addEventListener('click', (e) => {
            if (e.target === registerModal) closeRegisterModal();
        });
    }

    // 3. Event Submit Form Registrasi
    if (registerForm) {
        registerForm.addEventListener('submit', validateAndRegister);
    }

    // 4. Live Clear Error saat User Mengetik Ulang (Real-time Feedback)
    if (regUsername) {
        regUsername.addEventListener('input', () => clearFieldError(regUsername, errorUsername));
    }
    if (regEmail) {
        regEmail.addEventListener('input', () => clearFieldError(regEmail, errorEmail));
    }
    if (regGenre) {
        regGenre.addEventListener('change', () => clearFieldError(regGenre, errorGenre));
    }
    if (regPassword) {
        regPassword.addEventListener('input', () => clearFieldError(regPassword, errorPassword));
    }
    if (regConfirmPassword) {
        regConfirmPassword.addEventListener('input', () => clearFieldError(regConfirmPassword, errorConfirmPassword));
    }

    // 5. Event Tombol Kartu Member / Otaku Pass
    if (viewPassBtn) {
        viewPassBtn.addEventListener('click', () => openOtakuPassModal());
    }
    if (openProfileBtn) {
        openProfileBtn.addEventListener('click', () => openOtakuPassModal());
    }
    if (closePassBtn) {
        closePassBtn.addEventListener('click', closeOtakuPassModal);
    }
    if (otakuPassModal) {
        otakuPassModal.addEventListener('click', (e) => {
            if (e.target === otakuPassModal) closeOtakuPassModal();
        });
    }

    // 6. Event Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // 7. Shortcut Escape untuk menutup modal auth/pass
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (registerModal && !registerModal.classList.contains('hidden')) {
                closeRegisterModal();
            }
            if (otakuPassModal && !otakuPassModal.classList.contains('hidden')) {
                closeOtakuPassModal();
            }
        }
    });
}
