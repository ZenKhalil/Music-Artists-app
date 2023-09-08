"use strict";

// ========== Variabler ==========

// Liste med alle kunstnere
let artists = [];
window.toggleFavorite = toggleFavorite; // Add this line
// Lokal gemte favoritkunstnere
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
// Gemmer nuværende genre, hvis valgt
let currentGenre = null; 

// ========== Event Listeners ==========

// Hent kunstnere, når dokumentet er loaded
document.addEventListener('DOMContentLoaded', () => {
    fetchArtists();

    // Luk modal, når der klikkes på luk-knappen
    document.querySelector('.close-btn').addEventListener('click', function() {
        document.getElementById('genreModal').style.display = "none";
    });
});

// Vis den relevante side, når browserens tilbage/frem-knapper bruges
window.addEventListener('popstate', (event) => {
    if (event.state) {
        switch (event.state.view) {
            case 'home':
                showHome();
                break;
            case 'artists':
                showArtists();
                break;
            case 'genre':
                showGenre();
                break;
            case 'favorites':
                showFavorites();
                break;
            case 'about':
                showAbout();
                break;
        }
    }
});

// Åbn genremodal, når der klikkes på genre-linket
document.getElementById('genre-link').addEventListener('click', showGenre);

// ========== Funktioner ==========

// Hent kunstnere fra API
function fetchArtists() {
    fetch('http://localhost:3000/artists')
        .then(response => response.json())
        .then(data => {
            artists = data;
            // Tjek nuværende URL for at vise det korrekte indhold
            const currentPath = window.location.pathname;
            if (currentPath === '/artists') {
                showArtists();
            } else if (currentPath === '/genre') {
                showGenre();
            } else if (currentPath === '/favorites') {
                showFavorites();
            } else if (currentPath === '/about') {
                showAbout();
            } else {
                showHome();
            }
            
            // Tilføj event listeners til navigation links
            document.getElementById('home-link').addEventListener('click', showHome);
            document.getElementById('artists-link').addEventListener('click', showArtists);
            document.getElementById('favorites-link').addEventListener('click', showFavorites);
            document.getElementById('about-link').addEventListener('click', showAbout);
        });
}

// Vis hjemmesiden
function showHome() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `<h1>Welcome to Artist Directory</h1><p>Explore the world of music artists!</p>`;
    history.pushState({ view: 'home' }, '', '/home');
}

// Vis kunstnersiden
function showArtists() {
    const contentDiv = document.getElementById('content');
    let artistHTML = '';
    artists.forEach(artist => {
        artistHTML += `
            <div class="artist-card">
                <img src="images/${artist.image}" alt="${artist.name}">
                <h3>${artist.name}</h3>
                <p>${artist.shortDescription}</p>
                <a href="${artist.website}" target="_blank">Visit Website</a>
                <button onclick="toggleFavorite(${artist.id})">${favorites.includes(artist.id) ? 'Remove from Favorites' : 'Add to Favorites'}</button>
            </div>`;
    });
    contentDiv.innerHTML = artistHTML;
    history.pushState({ view: 'artists' }, '', '/artists');
}

// Få en unik liste over genrer
function getUniqueGenres() {
    const genres = new Set();
    artists.forEach(artist => {
        artist.genres.forEach(genre => {
            genres.add(genre);
        });
    });
    return [...genres];
}

// Vis genrer i modal
function showGenre(event) {
    if(event) event.preventDefault();
    const uniqueGenres = getUniqueGenres();

let genreListHTML = '';
uniqueGenres.forEach((genre, index) => {
    if (index % 5 === 0) genreListHTML += `<div class="genre-row">`; // Begin a new row every 5 items

    genreListHTML += `<div class="genre-icon" onclick="showArtistsByGenre('${genre}')">
        <img src="/images/genre-icons/${genre}.png" alt="${genre}"> 
        <p>${genre}</p>
    </div>`;

    if ((index + 1) % 5 === 0 || index === uniqueGenres.length - 1) genreListHTML += `</div>`; // End the row
});
    document.getElementById('genre-content').innerHTML = genreListHTML;
    document.getElementById('genreModal').style.display = "block";
}

// Vis kunstnere baseret på genre
function showArtistsByGenre(genre) {
    const contentDiv = document.getElementById('content');
    currentGenre = genre; 
    const filteredArtists = artists.filter(artist => artist.genres.includes(genre));
    let artistListHTML = `<h1 class="genre">${genre}</h1>`;
    filteredArtists.forEach(artist => {
        artistListHTML += `
            <div class="artist-card">
                <img src="/images/${artist.image}" alt="${artist.name}">
                <h3>${artist.name}</h3>
                <p>${artist.shortDescription}</p>
                <a href="${artist.website}" target="_blank">Visit Website</a>
                <button onclick="toggleFavorite(${artist.id})">${favorites.includes(artist.id) ? 'Remove from Favorites' : 'Add to Favorites'}</button>
            </div>`;
    });
   contentDiv.innerHTML = artistListHTML;
    history.pushState({ view: 'genre', genre: genre }, '', '/genre/' + genre);
    document.getElementById('genreModal').style.display = "none";
}

// Vis favoritkunstnereside
function showFavorites() {
    const contentDiv = document.getElementById('content'); // Define the contentDiv here.
  let favoritesListHTML = '<h1 class="favorites">Favorites</h1>';
    const favoriteArtists = artists.filter(artist => favorites.includes(artist.id));
    favoriteArtists.forEach(artist => {
       favoritesListHTML += `
            <div class="artist-card">
                <img src="images/${artist.image}" alt="${artist.name}">
                <h3>${artist.name}</h3>
                <p>${artist.shortDescription}</p>
                <a href="${artist.website}" target="_blank">Visit Website</a>
                <button onclick="toggleFavorite(${artist.id})">Remove from Favorites</button>
            </div>`;
    });
    favoritesListHTML += '</ul>';
    contentDiv.innerHTML = favoritesListHTML;
    history.pushState({ view: 'favorites' }, '', '/favorites');
}



// Skift kunstnerstatus til favorit
function toggleFavorite(artistId) {
    const wasFavorited = favorites.includes(artistId);

    if (wasFavorited) {
        const index = favorites.indexOf(artistId);
        favorites.splice(index, 1);
    } else {
        favorites.push(artistId);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));

    // Update only the specific artist's favorite button, without refreshing the whole page
    const favoriteButton = document.querySelector(`button[onclick="toggleFavorite(${artistId})"]`);
    if (favoriteButton) {
        favoriteButton.textContent = wasFavorited ? 'Add to Favorites' : 'Remove from Favorites';
    }

    // Refresh favorites view if an artist is removed and the current page is favorites
    if (wasFavorited && window.location.pathname === '/favorites') {
        showFavorites();
    }
}



// Vis Om Os side
function showAbout() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = "<h1>About Us</h1><p>We are a platform dedicated to showcasing music artists.</p>";
    history.pushState({ view: 'about' }, '', '/about');
}