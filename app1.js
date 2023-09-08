"use strict";

// ========== Variabler ==========

// Liste med alle kunstnere
let artists = [];
// Lokal gemte favoritkunstnere
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
window.favorites = favorites;
// Gemmer nuværende genre, hvis valgt
let currentGenre = null; 
let currentContext = 'home';  // default value

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
            window.artists = artists; 
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
            document.getElementById('create-artist-link').addEventListener('click', showCreateArtistForm);
            document.getElementById('favorites-link').addEventListener('click', showFavorites);
            document.getElementById('about-link').addEventListener('click', showAbout);
        });
}

document.querySelector('.close-btn-create').addEventListener('click', function() {
    document.getElementById('createArtistModal').style.display = "none";
});

// Vis hjemmesiden
function showHome() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `<h1>Welcome to Artist Directory</h1><p>Explore the world of music artists!</p>`;
    history.pushState({ view: 'home' }, '', '/home');
}

// Vis kunstnersiden
function showArtists() {
    currentContext = 'artists';
    const contentDiv = document.getElementById('content');
    let artistHTML = '';
    artists.forEach(artist => {
        artistHTML += `
            <div class="artist-card">
                <img src="/images/${artist.image}" alt="${artist.name}">
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
    currentContext = 'genre';
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
    const formHTML = `
        <h1 id="createText">Create New Artist</h1>
        <form id="create-artist-form">
            <label for="name">Name:</label>
            <input type="text" id="name" required>
            <label for="birthdate">Birthdate:</label>
            <input type="date" id="birthdate" required>
            <label for="activeSince">Active Since:</label>
            <input type="date" id="activeSince" required>
            <label for="genres">Genres (comma-separated):</label>
            <input type="text" id="genres" required>
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
        genres: document.getElementById('genres').value.split(',').map(s => s.trim()),
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
    const contentDiv = document.getElementById('content');
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
    contentDiv.innerHTML = favoritesListHTML;
    history.pushState({ view: 'favorites' }, '', '/favorites');
}

// Skift kunstnerstatus til favorit
function toggleFavorite(artistId) {
    if (favorites.includes(artistId)) {
        const index = favorites.indexOf(artistId);
        favorites.splice(index, 1);
    } else {
        favorites.push(artistId);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));

    // Refresh the current view to reflect the change in favorites
    refreshCurrentView();
}

function refreshCurrentView() {
    const currentPath = window.location.pathname;
    if (currentPath === '/favorites') {
        showFavorites();
    } else if (currentPath === '/artists' || currentPath === '/') {
        showArtists();
    } else if (currentPath.startsWith('/genre')) {  // Adjusted to check for any genre
        if (currentGenre) {
            showArtistsByGenre(currentGenre);
        }
    }
}

// Delegate the click events for artist cards to the content div
document.getElementById('content').addEventListener('click', function(event) {
    if (event.target.tagName === 'BUTTON' && event.target.closest('.artist-card')) {
        const artistId = parseInt(event.target.getAttribute('data-id'), 10);  // Assuming each button will have a data-id attribute with artist's ID
        if (!isNaN(artistId)) {
            toggleFavorite(artistId);
        }
    }
});


// Vis Om Os side
function showAbout() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = "<h1>About Us</h1><p>We are a platform dedicated to showcasing music artists.</p>";
    history.pushState({ view: 'about' }, '', '/about');
}