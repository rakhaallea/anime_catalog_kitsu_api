// DEKLARASI GLOBAL STATE (MEMORI APLIKASI)

let currentPage = 1;
const itemsPerPage = 20;
let totalPages = 1;
let currentQuery = "";
let currentSubtype = "";
let searchTimer = null;

// DEKLARASI DOM ELEMENTS
const animeContainer = document.getElementById("animeContainer");
const searchInput = document.getElementById("searchInput");
const typeSelect = document.getElementById("typeSelect");

const firstBtn = document.getElementById("firstBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const lastBtn = document.getElementById("lastBtn");
const pageNumbersContainer = document.getElementById("pageNumbers");

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

function showLoading() {
    if (animeContainer) {
        animeContainer.innerHTML = `<div class="loading">Memuat data anime...</div>`;
    }
}

function renderAnime(animeList) {
    if (!animeList || animeList.length === 0) {
        animeContainer.innerHTML = `<div class="empty">Anime tidak ditemukan.</div>`;
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

        return `
            <div class="anime-card" data-id="${item.id}">
            <img src="${posterUrl}" alt="${attr.canonicalTitle}" loading="lazy">
            <div class="anime-info">
                <span class="badge">${attr.subtype || "N/A"}</span>
                <span class="score">⭐ ${score}</span>
                <h3>${attr.canonicalTitle}</h3>
                <p class="episodes">${attr.episodeCount ? attr.episodeCount + " Ep" : "On Going"}</p>
            </div>
            </div>
        `;
        }).join('');
}

// MAIN CONTROLLER
async function loadAnimeData(){
    showLoading();

    try {
        const result = await fetchAnimeFromKitsu(currentQuery, currentSubtype, currentPage, itemsPerPage);

        if(result.totalCount){
            totalPages = Math.ceil(result.totalCount / itemsPerPage);
        } else {
            totalPages = 1;
        }

        renderAnime(result.data);
        updatePaginationUI();
    } catch (error) {
        if(animeContainer) {
            animeContainer.innerHTML = `<div class="error-msg">${error.message}</div>`;
            throw error;
        }
    }
}

// EVENT LISTENERS INTERAKSI USER
if(searchInput) {
    searchInput.addEventListener("input", debounce((e) => {
        currentQuery = e.target.value.trim();
        curentPage = 1;
        loadAnimeData();
    }, 500));
}

if(typeSelect) {
    typeSelect.addEventListener("change", (e) => {
        currentSubtype = e.target.value;
        currentPage = 1;
        loadAnimeData();
    })
}

firstBtn.addEventListener("click", () => {
    if(currentPage > 1) {
        currentPage = 1;
        loadAnimeData();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
})

prevBtn.addEventListener("click", () => {
    if(currentPage > 1) {
        currentPage--;
        loadAnimeData();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
})

nextBtn.addEventListener("click", () => {
    if(currentPage < totalPages) {
        currentPage++;
        loadAnimeData();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
})

lastBtn.addEventListener("click", () => {
    if(currentPage < totalPages) {
        currentPage = totalPages;
        loadAnimeData();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
})

document.addEventListener("DOMContentLoaded", loadAnimeData);
