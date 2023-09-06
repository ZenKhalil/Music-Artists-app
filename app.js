"use strict";

let artists = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentGenre = null; 

document.addEventListener('DOMContentLoaded', () => {
    fetchArtists();
});

function fetchArtists() {
    fetch('http://localhost:3000/artists')
        .then(response => response.json())
        .then(data => {
            artists = data;
            // Check current URL to display the correct content
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
            
            document.getElementById('home-link').addEventListener('click', showHome);
            document.getElementById('artists-link').addEventListener('click', showArtists);
            document.getElementById('genre-link').addEventListener('click', showGenre);
            document.getElementById('favorites-link').addEventListener('click', showFavorites);
            document.getElementById('about-link').addEventListener('click', showAbout);
        });
}

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


const contentDiv = document.getElementById('content');

function showHome() {
    contentDiv.innerHTML = `<h1>Welcome to Artist Directory</h1>
                            <p>Explore the world of music artists!</p>`;
    history.pushState({ view: 'home' }, '', '/home');
}

function showArtists() {
    let artistListHTML = '<ul>';
    artists.forEach(artist => {
        artistListHTML += `
        <li>
            <h2>${artist.name}</h2>
            <img src="images/${artist.image}" alt="${artist.name}" width="100" />
            <p>${artist.shortDescription}</p>
            <a href="${artist.website}">Website</a>
            <button onclick="toggleFavorite(${artist.id})">${favorites.includes(artist.id) ? 'Remove from Favorites' : 'Add to Favorites'}</button>
        </li>`;
    });
    artistListHTML += '</ul>';
    contentDiv.innerHTML = artistListHTML;
   history.pushState({ view: 'artists' }, '', '/artists');
}

function getUniqueGenres() {
    const genres = new Set();
    artists.forEach(artist => {
        artist.genres.forEach(genre => {
            genres.add(genre);
        });
    });
    return [...genres];
}

function showGenre() {
    const uniqueGenres = getUniqueGenres();
    let genreListHTML = '<ul>';
    uniqueGenres.forEach(genre => {
        genreListHTML += `<li><a href="#" onclick="showArtistsByGenre('${genre}')">${genre}</a></li>`;
    });
    genreListHTML += '</ul>';
    contentDiv.innerHTML = genreListHTML;
 history.pushState({ view: 'genre' }, '', '/genre');
}

function showArtistsByGenre(genre) {
    currentGenre = genre; 
    const filteredArtists = artists.filter(artist => artist.genres.includes(genre));
    let artistListHTML = `<h1>${genre}</h1><ul>`;
    filteredArtists.forEach(artist => {
        artistListHTML += `
        <li>
            <h2>${artist.name}</h2>
            <img src="images/${artist.image}" alt="${artist.name}" width="100" />
            <p>${artist.shortDescription}</p>
            <a href="${artist.website}">Website</a>
            <button onclick="toggleFavorite(${artist.id})">${favorites.includes(artist.id) ? 'Remove from Favorites' : 'Add to Favorites'}</button>
        </li>`;
    });
    artistListHTML += '</ul>';
    contentDiv.innerHTML = artistListHTML;
}

function showFavorites() {
    let favoritesListHTML = '<h1>Favorites</h1><ul>';
    const favoriteArtists = artists.filter(artist => favorites.includes(artist.id));
    favoriteArtists.forEach(artist => {
        favoritesListHTML += `
        <li>
            <h2>${artist.name}</h2>
            <img src="images/${artist.image}" alt="${artist.name}" width="100" />
            <p>${artist.shortDescription}</p>
            <a href="${artist.website}">Website</a>
            <button onclick="toggleFavorite(${artist.id})">Remove from Favorites</button>
        </li>`;
    });
    favoritesListHTML += '</ul>';
    contentDiv.innerHTML = favoritesListHTML;
  history.pushState({ view: 'favorites' }, '', '/favorites');
}

function toggleFavorite(artistId) {
    if (favorites.includes(artistId)) {
        const index = favorites.indexOf(artistId);
        favorites.splice(index, 1);
    } else {
        favorites.push(artistId);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));

    // Check current URL to display the correct content
    const currentPath = window.location.pathname;

    if (currentPath === '/favorites') {
        showFavorites();  // Update the favorites list immediately
    } else if (currentPath === '/artists' || currentPath === '/') {
        showArtists();
    } else if (currentPath === '/genre' && currentGenre) {
        showArtistsByGenre(currentGenre); 
    } 
    // ... add other paths as needed
}



function showAbout() {
    contentDiv.innerHTML = "<h1>About Us</h1><p>We are a platform dedicated to showcasing music artists.</p>";
    history.pushState({ view: 'about' }, '', '/about');
}
