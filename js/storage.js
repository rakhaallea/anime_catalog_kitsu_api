const BOOKMARK_KEY = 'anime_catalog_bookmarks';

function getBookmarks(){
    const data = localStorage.getItem(BOOKMARK_KEY);
    return data ? JSON.parse(data) : [];
}

function isBookmarked(animeId){
    const bookmarks = getBookmarks();
    return bookmarks.some(item => String(item.id) === String(animeId))
}

function toggleBookmark(animeObj) {
    let bookmarks = getBookmarks();
    const existsIndex = bookmarks.findIndex(item => String(item.id) === String(animeObj.id));

    let added = false;
    if(existsIndex > -1){
        bookmarks.splice(existsIndex, 1);
        added = false
    } else {
        bookmarks.push(animeObj);
        added = true
    }

    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks));
    updateBookmarkCountUI();
    return added
}

function updateBookmarkCountUI() {
    const countEl = document.getElementById('bookmarkCount');
    if(countEl) {
        const bookmarks =   getBookmarks();
        countEl.textContent = bookmarks.length;
    }
}

// STORAGE USER PROFILE (REGISTRASI & AUTH)
const USER_PROFILE_KEY = 'user_profile';

function getUserProfile() {
    const data = localStorage.getItem(USER_PROFILE_KEY);
    try {
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Error parsing user profile:', e);
        return null;
    }
}

function saveUserProfile(profile) {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
}

function clearUserProfile() {
    localStorage.removeItem(USER_PROFILE_KEY);
}