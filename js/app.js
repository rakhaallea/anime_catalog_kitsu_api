// DEKLARASI GLOBAL STATE (MEMORI APLIKASI)
let currentPage = 1;
const itemsPerPage = 20;
let totalPages = 1;
let currentQuery = "";
let currentSubtype = "";
let searchTimer = null;
let currentView = 'all';
let currentFetchedList = [];

let isProcessingBookmark = false;

// DEKLARASI DOM ELEMENTS
const animeContainer = document.getElementById("animeContainer");
const searchInput = document.getElementById("searchInput");
const typeSelect = document.getElementById("typeSelect");

const firstBtn = document.getElementById("firstBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const lastBtn = document.getElementById("lastBtn");
const pageNumbersContainer = document.getElementById("pageNumbers");

const animeModal = document.getElementById('animeModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalBody = document.getElementById('modalBody');

const tabAllBtn = document.getElementById('tabAllBtn');
const tabBookmarkBtn = document.getElementById('tabBookmarkBtn');
const filterSection = document.getElementById('filterSection');
const paginationContainer = document.querySelector('.pagination-container');

const toastContainer = document.getElementById('toastContainer');
const scrollTopBtn = document.getElementById('scrollTopBtn');

// LOGIKA DYNAMIC SLIDING WINDOW PAGINATION
function renderPageNumbers() {
    pageNumbersContainer.innerHTML = "";

    const maxVisiblePages = 10;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const numBtn = document.createElement("button");
        numBtn.classList.add("num-btn");
        if (i === currentPage) {
            numBtn.classList.add("active");
        }

        numBtn.textContent = i;

        numBtn.addEventListener("click", () => {
            if (currentPage !== i) {
                currentPage = i;
                loadAnimeData();
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });

        pageNumbersContainer.appendChild(numBtn);
    }
}

function updatePaginationUI() {
    renderPageNumbers();

    firstBtn.disabled = currentPage === 1;
    prevBtn.disabled = currentPage === 1;

    nextBtn.disabled = currentPage === totalPages;
    lastBtn.disabled = currentPage === totalPages;
}

// HELPER & UI RENDER FUNCTIONS
function debounce(func, delay = 500) {
    return function (...args) {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => func.apply(this, args), delay);
    };
}

function renderAnime(animeList) {
    if (!animeList || animeList.length === 0) {
        const msg = currentView === "bookmark"
            ? '<i class="fa-regular fa-heart"></i> Belum ada anime favorit yang disimpan.'
            : '<i class="fa-solid fa-magnifying-glass"></i> Anime tidak ditemukan.'
        animeContainer.innerHTML = `<div class="empty">${msg}</div>`;
        return;
    }

    animeContainer.innerHTML = animeList.map((item) => {
        const attr = item.attributes;
        const posterUrl =
            attr.posterImage?.large ||
            attr.posterImage?.medium ||
            "https://placehold.co/300x400?text=No+Image";

        const score = attr.averageRating
            ? (attr.averageRating / 10).toFixed(1)
            : "N/A";

        const bookmarked = isBookmarked(item.id);

        return `
            <article class="anime-card" data-id="${item.id}">
                <button class="bookmark-card-btn ${bookmarked ? 'active' : ''}" data-id="${item.id}" title="Simpan Favorit" aria-label="Simpan ${attr.canonicalTitle} ke favorit" aria-pressed="${bookmarked ? 'true' : 'false'}">
                    <i class="fa-${bookmarked ? 'solid' : 'regular'} fa-heart" aria-hidden="true"></i>
                </button>

                <figure class="card-poster-box">
                    <img src="${posterUrl}" alt="${attr.canonicalTitle}" loading="lazy">
                    <span class="badge"><i class="fa-solid fa-tv" aria-hidden="true"></i> ${attr.subtype || "N/A"}</span>
                </figure>
                <div class="anime-info">
                    <div class="meta-row">
                        <span class="score"><i class="fa-solid fa-star" aria-hidden="true"></i> ${score}</span>
                        <span class="episodes"><i class="fa-solid fa-film" aria-hidden="true"></i> ${attr.episodeCount ? attr.episodeCount + " Ep" : "Ongoing"}</span>
                    </div>
                    <h3>${attr.canonicalTitle}</h3>
                </div>
            </article>
        `;
    }).join('');
}

function switchView(view) {
    currentView = view;

    if (view === 'all') {
        tabAllBtn.classList.add('active');
        tabBookmarkBtn.classList.remove('active');
        filterSection.style.display = 'flex';
        paginationContainer.style.display = 'flex';
        loadAnimeData();
    } else if (view === 'bookmark') {
        tabBookmarkBtn.classList.add('active');
        tabAllBtn.classList.remove('active');
        filterSection.style.display = 'none';
        paginationContainer.style.display = 'none';

        const bookmarks = getBookmarks();
        renderAnime(bookmarks);
    }
}

function showToast(message, type = "info") {
    if (!toastContainer) return;

    toastContainer.innerHTML = '';

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = type === 'success'
        ? '<i class="fa-solid fa-circle-check"></i>'
        : type === 'error'
            ? '<i class="fa-solid fa-triangle-exclamation"></i>'
            : '<i class="fa-solid fa-circle-info"></i>';

    toast.innerHTML = `<span class="toast-icon">${icon}</span> <span class="toast-text">${message}</span>`;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function showLoading() {
    if (!animeContainer) return;

    const skeletonCards = Array(8).fill(0).map(() => `
        <article class="skeleton-card" aria-hidden="true">
            <div class="skeleton-img shimmer"></div>
            <div class="skeleton-info">
                <div class="skeleton-meta-row">
                    <div class="skeleton-pill shimmer"></div>
                    <div class="skeleton-pill shimmer"></div>
                </div>
                <div class="skeleton-title shimmer"></div>
                <div class="skeleton-title short shimmer"></div>
            </div>
        </article>
    `).join('');

    animeContainer.innerHTML = skeletonCards;
}


async function openAnimeModal(animeId) {
    modalBody.innerHTML = `<div class="loading">Memuat detail anime...</div>`;
    animeModal.classList.remove('hidden');

    try {
        const anime = await fetchAnimeDetailById(animeId);
        const attr = anime.attributes;

        const posterUrl = attr.posterImage?.large || attr.posterImage?.medium || 'https://placehold.co/300x400?text=No+Image';
        const score = attr.averageRating ? (attr.averageRating / 10).toFixed(1) : 'N/A';
        const youtubeId = attr.youtubeVideoId;

        const bookmarked = isBookmarked(anime.id);

        modalBody.innerHTML = `
        <div class="modal-grid">
            <figure class="modal-poster">
                <img src="${posterUrl}" alt="Poster ${attr.canonicalTitle}">
            </figure>
            <div class="modal-details">
                <h2 id="modalAnimeTitle">${attr.canonicalTitle}</h2>
                <div class="modal-meta">
                    <span class="badge"><i class="fa-solid fa-tv" aria-hidden="true"></i> ${attr.subtype || 'N/A'}</span>
                    <span class="badge score"><i class="fa-solid fa-star" aria-hidden="true"></i> ${score}</span>
                    <span class="badge status"><i class="fa-solid fa-circle-dot" aria-hidden="true"></i> ${attr.status || 'N/A'}</span>
                </div>
                <p><strong><i class="fa-solid fa-film" aria-hidden="true"></i> Episode:</strong> ${attr.episodeCount || 'N/A'}</p>
                <p><strong><i class="fa-solid fa-calendar-days" aria-hidden="true"></i> Rilis:</strong> ${attr.startDate ? `<time datetime="${attr.startDate}">${attr.startDate}</time>` : 'N/A'}</p>

                <button id="modalBookmarkBtn" class="modal-bookmark-btn ${bookmarked ? 'active' : ''}" aria-pressed="${bookmarked ? 'true' : 'false'}" aria-label="${bookmarked ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}">
                    <span class="icon"><i class="fa-${bookmarked ? 'solid' : 'regular'} fa-heart" aria-hidden="true"></i></span>
                    <span class="text">${bookmarked ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}</span>
                </button>

                <section class="modal-synopsis-section" aria-labelledby="synopsisHeading">
                    <h3 id="synopsisHeading"><i class="fa-solid fa-align-left" aria-hidden="true"></i> Sinopsis</h3>
                    <p class="modal-synopsis">${attr.synopsis || 'Sinopsis tidak tersedia.'}</p>
                </section>
            </div>
        </div>

        ${youtubeId ? `
            <section class="modal-trailer-box" aria-labelledby="trailerHeading">
                <h3 id="trailerHeading"><i class="fa-brands fa-youtube" aria-hidden="true"></i> Trailer Resmi</h3>
                <div class="trailer-container">
                    <iframe 
                        src="https://www.youtube.com/embed/${youtubeId}?autoplay=1" 
                        title="Trailer Resmi ${attr.canonicalTitle}" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
            </section>
        ` : '<p class="no-trailer"><i class="fa-solid fa-video-slash" aria-hidden="true"></i> Trailer tidak tersedia untuk anime ini.</p>'}
        `;

        const modalBookmarkBtn = document.getElementById('modalBookmarkBtn');
        if (modalBookmarkBtn) {
            modalBookmarkBtn.addEventListener('click', () => {
                const added = toggleBookmark(anime);

                // Update modal button UI
                modalBookmarkBtn.classList.toggle('active', added);
                modalBookmarkBtn.setAttribute('aria-pressed', added ? 'true' : 'false');
                modalBookmarkBtn.setAttribute('aria-label', added ? 'Hapus dari Favorit' : 'Tambah ke Favorit');
                modalBookmarkBtn.querySelector('.icon').innerHTML = added ? '<i class="fa-solid fa-heart" aria-hidden="true"></i>' : '<i class="fa-regular fa-heart" aria-hidden="true"></i>';
                modalBookmarkBtn.querySelector('.text').textContent = added ? 'Hapus dari Favorit' : 'Tambah ke Favorit';

                // Update card button UI in grid if present
                const cardBookmarkBtn = animeContainer.querySelector(`.bookmark-card-btn[data-id="${anime.id}"]`);
                if (cardBookmarkBtn) {
                    cardBookmarkBtn.classList.toggle('active', added);
                    cardBookmarkBtn.setAttribute('aria-pressed', added ? 'true' : 'false');
                    cardBookmarkBtn.innerHTML = added ? '<i class="fa-solid fa-heart" aria-hidden="true"></i>' : '<i class="fa-regular fa-heart" aria-hidden="true"></i>';
                }

                if (currentView === 'bookmark') {
                    renderAnime(getBookmarks());
                }
            });
        }
    } catch (error) {
        modalBody.innerHTML = `<div class="error-msg">${error.message}</div>`;
        console.error(error)
    }
}

// MAIN CONTROLLER
async function loadAnimeData() {
    showLoading();

    try {
        const result = await fetchAnimeFromKitsu(currentQuery, currentSubtype, currentPage, itemsPerPage);

        currentFetchedList = result.data || [];

        if (result.totalCount) {
            totalPages = Math.ceil(result.totalCount / itemsPerPage);
        } else {
            totalPages = 1;
        }

        renderAnime(result.data);
        updatePaginationUI();
    } catch (error) {
        if (animeContainer) {
            animeContainer.innerHTML = `<div class="error-msg">${error.message}</div>`;
            throw error;
        }
    }
}

function closeModal() {
    animeModal.classList.add('hidden');
    modalBody.innerHTML = '';
}

// EVENT LISTENERS INTERAKSI USER
if (searchInput) {
    searchInput.addEventListener("input", debounce((e) => {
        currentQuery = e.target.value.trim();
        currentPage = 1;
        loadAnimeData();
    }, 500));
}

if (typeSelect) {
    typeSelect.addEventListener("change", (e) => {
        currentSubtype = e.target.value;
        currentPage = 1;
        loadAnimeData();
    })
}

firstBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage = 1;
        loadAnimeData();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
})

prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        loadAnimeData();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
})

nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
        currentPage++;
        loadAnimeData();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
})

lastBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
        currentPage = totalPages;
        loadAnimeData();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
})

animeContainer.addEventListener('click', (e) => {
    const bookmarkBtn = e.target.closest('.bookmark-card-btn');

    if (bookmarkBtn) {
        e.stopPropagation();

        if (isProcessingBookmark) return;
        isProcessingBookmark = true;

        const card = bookmarkBtn.closest('.anime-card');
        const animeId = bookmarkBtn.dataset.id;

        const animeObj = currentView === "bookmark"
            ? getBookmarks().find(item => String(item.id) === String(animeId))
            : currentFetchedList.find(item => String(item.id) === String(animeId));

        if (animeObj) {
            const isAdded = toggleBookmark(animeObj);

            if (currentView === "bookmark") {
                renderAnime(getBookmarks());
            } else {
                const isNowBookmarked = isBookmarked(animeId);
                bookmarkBtn.classList.toggle('active', isNowBookmarked);
                bookmarkBtn.setAttribute('aria-pressed', isNowBookmarked ? 'true' : 'false');
                bookmarkBtn.innerHTML = isNowBookmarked ? '<i class="fa-solid fa-heart" aria-hidden="true"></i>' : '<i class="fa-regular fa-heart" aria-hidden="true"></i>';
            }

            const title = animeObj.attributes?.canonicalTitle || 'Anime';
            showToast(
                isAdded ? `"${title}" ditambahkan ke Favorit!` : `"${title}" dihapus dari Favorit.`,
                isAdded ? 'success' : 'info'
            )
        }

        setTimeout(() => {
            isProcessingBookmark = false;
        }, 300);

        return;
    }

    const card = e.target.closest('.anime-card');
    if (card) {
        const animeId = card.dataset.id;
        openAnimeModal(animeId);
    }
});

tabAllBtn.addEventListener('click', () => switchView('all'));
tabBookmarkBtn.addEventListener('click', () => switchView('bookmark'));

closeModalBtn.addEventListener('click', closeModal);

animeModal.addEventListener('click', (e) => {
    if (e.target === animeModal) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !animeModal.classList.contains('hidden')) {
        closeModal();
    };
})

document.addEventListener('DOMContentLoaded', () => {
    updateBookmarkCountUI();
    if (typeof initAuth === 'function') {
        initAuth();
    }
    loadAnimeData();
    handleScrollTopVisibility();
});

// SCROLL TO TOP CONTROLLER (TAMPIL JIKA SCROLL MELEBIHI 100VH)
function handleScrollTopVisibility() {
    if (!scrollTopBtn) return;
    // window.innerHeight merepresentasikan ukuran 100vh pada layar
    if (window.scrollY > window.innerHeight) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
}

if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

window.addEventListener('scroll', handleScrollTopVisibility, { passive: true });

