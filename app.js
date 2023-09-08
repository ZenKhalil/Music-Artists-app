"use strict";

// ========== Variabler ==========

// Liste med alle kunstnere
let artists = [];
window.toggleFavorite = toggleFavorite; // Gør denne funktion tilgængelig globalt

// Lokal gemte favoritkunstnere
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Gemmer nuværende genre, hvis valgt
let currentGenre = null; 

// ========== Event Listeners ==========

// Når dokumentet er loaded
document.addEventListener('DOMContentLoaded', () => {
    // Hent kunstnerne
    fetchArtists();

    // Tilføj event listener for at lukke modalen
    document.querySelector('.close-btn').addEventListener('click', () => {
        document.getElementById('genreModal').style.display = "none";
    });
});

// Når browserens tilbage/frem-knapper bruges
window.addEventListener('popstate', (event) => {
    navigateBasedOnState(event.state);
});

// Åbn genremodal, når der klikkes på genre-linket
document.getElementById('genre-link').addEventListener('click', showGenre);

// Luk "Create Artist" modalen
document.querySelector('.close-btn-create').addEventListener('click', () => {
    document.getElementById('createArtistModal').style.display = "none";
});

// ========== Funktioner ==========

// Hent kunstnere fra API
function fetchArtists() {
    fetch('http://localhost:3000/artists')
        .then(response => response.json())
        .then(data => {
            artists = data;
            navigateBasedOnURL(window.location.pathname);
            setupNavigationLinks();
        });
}

// Håndter navigation baseret på nuværende URL
function navigateBasedOnURL(path) {
    switch (path) {
        case '/artists':
            showArtists();
            break;
        case '/genre':
            showGenre();
            break;
        case '/favorites':
            showFavorites();
            break;
        case '/about':
            showAbout();
            break;
        default:
            showHome();
    }
}

// Håndter navigation baseret på state
function navigateBasedOnState(state) {
    if (state) {
        switch (state.view) {
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
}

// Sæt event listeners til navigation links
function setupNavigationLinks() {
    document.getElementById('home-link').addEventListener('click', showHome);
    document.getElementById('artists-link').addEventListener('click', showArtists);
    document.getElementById('create-artist-link').addEventListener('click', showCreateArtistForm);
    document.getElementById('favorites-link').addEventListener('click', showFavorites);
    document.getElementById('about-link').addEventListener('click', showAbout);
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
    contentDiv.innerHTML = generateArtistsHTML();
    history.pushState({ view: 'artists' }, '', '/artists');
}

// Generer HTML for kunstnere
function generateArtistsHTML() {
    return artists.map(artist => `
        <div class="artist-card">
            <img src="images/${artist.image}" alt="${artist.name}">
            <h3>${artist.name}</h3>
            <p>${artist.shortDescription}</p>
            <a href="${artist.website}" target="_blank">Visit Website</a>
            <button onclick="toggleFavorite(${artist.id})">${favorites.includes(artist.id) ? 'Remove from Favorites' : 'Add to Favorites'}</button>
        </div>`
    ).join('');
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

// Vis Lav en ny Artists form
function showCreateArtistForm(event) {
    if(event) event.preventDefault();
    const uniqueGenres = getUniqueGenres();
 const genreBobbles = uniqueGenres.map(genre => `
    <input type="checkbox" id="genre-${genre}" name="genres" value="${genre}">
    <label class="genre-bobble" for="genre-${genre}">
        <span>${genre}</span>
        </label>
        `).join('');

    const formHTML = `
        <h1 id="createText">Create New Artist</h1>
        <form id="create-artist-form">
            <label for="name">Name:</label>
            <input type="text" id="name" required>
            <label for="birthdate">Birthdate:</label>
            <input type="date" id="birthdate" required>
            <label for="activeSince">Active Since:</label>
            <input type="date" id="activeSince" required>
            <label>Genres:</label>
            <div id="genres-bobbles">
                ${genreBobbles}
            </div>
            <label for="labels">Labels (comma-separated):</label>
            <input type="text" id="labels" required>
            <label for="website">Website:</label>
            <input type="url" id="website" required>
            <label for="image">Image File Name:</label>
            <input type="text" id="image" required>
            <label for="shortDescription">Short Description:</label>
            <textarea id="shortDescription" required></textarea>
            <button type="submit">Create Artist</button>
        </form>
    `;

    document.getElementById('create-artist-content').innerHTML = formHTML;
    document.getElementById('createArtistModal').style.display = "block";

    // Add event listener to handle form submission
    document.getElementById('create-artist-form').addEventListener('submit', handleCreateArtistFormSubmission);
}

function handleCreateArtistFormSubmission(event) {
    event.preventDefault();
    
    const newArtist = {
        name: document.getElementById('name').value,
        birthdate: document.getElementById('birthdate').value,
        activeSince: document.getElementById('activeSince').value,
        genres: Array.from(document.querySelectorAll('input[name="genres"]:checked')).map(checkbox => checkbox.value),
        labels: document.getElementById('labels').value.split(',').map(s => s.trim()),
        website: document.getElementById('website').value,
        image: document.getElementById('image').value,
        shortDescription: document.getElementById('shortDescription').value
    };

    // POST the new artist data to the server
    fetch('http://localhost:3000/artists', {
        method: 'POST',
        headers: {        'Content-Type': 'application/json'
        },
        body: JSON.stringify(newArtist)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Failed to create a new artist");
        }
    })
    .then(artist => {
        // Assuming you want to immediately add the newly created artist to the local array and then display them
        artists.push(artist);
        showArtists(); // Or any other function you'd like to call to refresh your content after adding a new artist
        alert('Artist added successfully!');
    })
    .catch(error => {
        console.error("Error adding artist:", error);
        alert('There was an issue adding the artist. Please try again.');
    });
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