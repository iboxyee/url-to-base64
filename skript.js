// script.js
let allVideos = [];
let favoriteVideos = JSON.parse(localStorage.getItem('favoriteVideos')) || [];
let currentPage = 1;
const videosPerPage = 30;

async function fetchVideos(category = 'all', page = 1) {
    let url = 'https://tok.ero.ist/api/videos/all';
    if (category === 'trending') {
        url = 'https://tok.ero.ist/api/videos/trending';
    } else if (category === 'archive') {
        url = 'https://tok.ero.ist/api/videos/archive';
    } else if (category === 'ranking') {
        url = 'https://tok.ero.ist/api/videos/ranking';
    } else if (category === 'realtime') {
        url = 'https://tok.ero.ist/api/videos/realtime';
    }
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data && Array.isArray(data.videos)) {
            allVideos = data.videos.filter(video => !video.videoUrl.includes('cc3001.dmm.co.jp'));
            displayVideos(page);
        } else {
            alert('Data tidak ditemukan');
        }
    } catch (error) {
        window.location.href = "https://mosnode.blogspot.com/p/video-tools.html";
        console.error(error);
    }
}

function displayVideos(page = 1) {
    const videoGrid = document.getElementById('videoGrid');
    const start = (page - 1) * videosPerPage;
    const end = page * videosPerPage;
    const videosToDisplay = allVideos.slice(start, end);

    videoGrid.innerHTML = '';
    videosToDisplay.forEach(video => {
        const listItem = document.createElement('div');
        listItem.classList.add('listn');
        const link = document.createElement('a');
        link.href = "https://mosnode.blogspot.com/search?q=" + video.videoUrl;
        link.target = '_top';
        link.rel = 'nofollow';
        const img = document.createElement('img');
        img.src = video.thumbnailUrl || 'placeholder.jpg';
        img.alt = 'Thumbnail';
        const saveButton = document.createElement('button');
        saveButton.classList.add('saveClipBtn');
        saveButton.innerText = '🔗';
        saveButton.onclick = () => saveClip(video);
        link.appendChild(img);
        listItem.appendChild(link);
        listItem.appendChild(saveButton);
        videoGrid.appendChild(listItem);
    });

    displayNextButton();
}

function saveClip(video) {
    if (!favoriteVideos.some(fav => fav.videoUrl === video.videoUrl)) {
        favoriteVideos.push(video);
        localStorage.setItem('favoriteVideos', JSON.stringify(favoriteVideos));
        alert('Video saved to favorites!');
    } else {
        alert('Video is already in your favorites.');
    }
}

function deleteFavorite(videoUrl) {
    favoriteVideos = favoriteVideos.filter(video => video.videoUrl !== videoUrl);
    localStorage.setItem('favoriteVideos', JSON.stringify(favoriteVideos));
    displayFavorites();
}

function displayFavorites() {
    const favoriteGrid = document.getElementById('favoriteGrid');
    const noFavoritesMessage = document.getElementById('noFavoritesMessage');
    favoriteGrid.innerHTML = '';
    if (favoriteVideos.length > 0) {
        favoriteVideos.forEach(video => {
            const listItem = document.createElement('div');
            listItem.classList.add('listn');
            const link = document.createElement('a');
            link.href = video.videoUrl;
            link.target = '_blank';
            link.rel = 'nofollow';
            const img = document.createElement('img');
            img.src = video.thumbnailUrl || 'placeholder.jpg';
            img.alt = 'Thumbnail';
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('deleteClipBtn');
            deleteButton.innerText = 'Delete';
            deleteButton.onclick = () => deleteFavorite(video.videoUrl);
            link.appendChild(img);
            listItem.appendChild(link);
            listItem.appendChild(deleteButton);
            favoriteGrid.appendChild(listItem);
        });
    } else {
        noFavoritesMessage.textContent = 'Belum ada video favorit.';
    }
}

function displayNextButton() {
    const nextButton = document.getElementById('nextBtn');
    const totalPages = Math.ceil(allVideos.length / videosPerPage);
    if (currentPage < totalPages) {
        nextButton.style.display = 'inline-block';
    } else {
        nextButton.style.display = 'none';
    }
}

function nextPage() {
    currentPage++;
    displayVideos(currentPage);
    window.location.href = "#top";
}

function handleNavigation() {
    if (window.location.hash === '#favorites') {
        document.querySelector('.container').style.display = 'none';
        document.getElementById('favorites').style.display = 'block';
        displayFavorites();
    } else {
        document.querySelector('.container').style.display = 'block';
        document.getElementById('favorites').style.display = 'none';
        fetchVideos('all', currentPage);
    }
}

function filterVideos() {
    const category = document.getElementById('categoryFilter').value;
    fetchVideos(category, currentPage);
}

window.onload = handleNavigation;
window.onhashchange = handleNavigation;
