"use strict";

import { fetchArtistsFromAPI, createNewArtist, updateArtist, deleteArtistFromAPI } from "./rest-service.js";

"use strict";

// ========== Variables ==========

let artists = [];
window.toggleFavorite = toggleFavorite; // Make this function globally available
window.showArtists = showArtists;
window.showArtistsByGenre = showArtistsByGenre;
window.showCreateArtistForm = showCreateArtistForm;
window.showEditArtistForm = showEditArtistForm;
window.showArtistPreview = showArtistPreview;
window.closeArtistPreview = closeArtistPreview;
window.deleteArtist = deleteArtist;
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentGenre = null;

// ========== Event Listeners ==========

document.addEventListener('DOMContentLoaded', () => {
    fetchArtists();
    document.querySelector('.close-btn').addEventListener('click', () => {
        document.getElementById('genreModal').style.display = "none";
    });
});

window.addEventListener('popstate', (event) => {
    navigateBasedOnState(event.state);
});

document.getElementById('genre-link').addEventListener('click', showGenre);
document.querySelector('.close-btn-create').addEventListener('click', () => {
    document.getElementById('createArtistModal').style.display = "none";
});
document.querySelector('.close-btn-edit').addEventListener('click', () => {
    document.getElementById('editArtistModal').style.display = "none";
});

// ========== Functions ==========

function fetchArtists() {
    fetchArtistsFromAPI().then(data => {
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
    
    // Add the necessary HTML structure for the typing effect
    contentDiv.innerHTML = `
        <div class="cont">
            <h1><span class="auto-type"></span></h1>
        </div>
    `;
    
    history.pushState({ view: 'home' }, '', '/home');

    // Initiate the Typed.js instance for the home page
    var typed = new Typed(".auto-type", {
        strings: ["WELCOME TO", "GrooveMuze"],
        typeSpeed: 100,
        backSpeed: 100,
        loop: true
    });
}

// Using Typed.js library for typing animations
// GitHub: https://github.com/mattboldt/typed.js
// Created by Matt Boldt

// Vis kunstnersiden
function showArtists() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = generateArtistsHTML();
    history.pushState({ view: 'artists' }, '', '/artists');
}

// Generer HTML for kunstnere
function generateArtistsHTML() {
    return artists.map(artist => `
        <div class="artist-card" data-artist-id="${artist.id}">
            <div class="artist-image-container" onclick="showArtistPreview(${artist.id})">
                ${isLoggedIn ? `<i class="delete-icon" onclick="deleteArtist(${artist.id})" title="Delete">✖</i>` : ''}
                <img src="images/${artist.image}" alt="${artist.name}">
            </div>
            <h3>${artist.name}</h3>
            <p>${artist.shortDescription}</p>
            <a href="${artist.website}" target="_blank">Visit Website</a>
            <button onclick="toggleFavorite(${artist.id})">${favorites.includes(artist.id) ? 'Remove from Favorites' : 'Add to Favorites'}</button>
            ${isLoggedIn ? `<i class="edit-icon" onclick="showEditArtistForm(${artist.id})">🖊️</i>` : ''}
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

// En preview af kunster
function showArtistPreview(artistId) {
    // Check if a preview modal is already open
    const existingModal = document.querySelector('.preview-modal');
    if (existingModal) {
        return; // Do nothing if a modal is already open
    }

    // Get the artist card element by artist ID
    const artistCard = document.querySelector(`.artist-card[data-artist-id="${artistId}"]`);

    if (artistCard) {
        const artist = artists.find(a => a.id === artistId);

        const genres = artist.genres.join(', ');

        const modalHTML = `
            <div class="preview-modal">
                <i class="close-preview-icon" onclick="closeArtistPreview()" title="Close">Close</i>
                <img src="images/${artist.image}" alt="${artist.name}">
                <h3>${artist.name}</h3>
                <p><strong>Birthdate:</strong> ${artist.birthdate}</p>
                <p><strong>Active Since:</strong> ${artist.activeSince}</p>
                <p><strong>Genres:</strong> ${genres}</p>
                <p>${artist.shortDescription}</p>
                <a href="${artist.website}" target="_blank">Visit Website</a>
                <button onclick="toggleFavorite(${artist.id})">${favorites.includes(artist.id) ? 'Remove from Favorites' : 'Add to Favorites'}</button>
            </div>
        `;

        // Append modal to body or any container you want
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);
        document.querySelector('.preview-modal').style.display = 'block';
    }
}

function closeArtistPreview() {
    // Remove the modal from the body
    const modal = document.querySelector('.preview-modal');
    modal.parentElement.remove();
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

    const formHTML =  `
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
            <label>Image:</label>
            <div>
                <input type="radio" id="uploadImage" name="imageSource" value="upload" checked>
                <label for="uploadImage">Upload</label>
                <input type="radio" id="imageLink" name="imageSource" value="link">
                <label for="imageLink">Link</label>
            </div>
            <input type="file" id="imageUpload" accept="image/*">
            <input type="text" id="imageLinkInput" placeholder="Image Link" style="display: none;">
            <label for="shortDescription">Short Description:</label>
            <textarea id="shortDescription" required></textarea>
            <button type="submit">Create Artist</button>
        </form>
    `;

   document.getElementById('create-artist-content').innerHTML = formHTML;
   document.getElementById('createArtistModal').style.display = "block";
   document.getElementById('create-artist-form').addEventListener('submit', handleCreateArtistFormSubmission);

   // Add event listeners for image source options just like in edit
   const imageUploadRadio = document.getElementById('uploadImage');
   const imageLinkRadio = document.getElementById('imageLink');
   const imageUploadInput = document.getElementById('imageUpload');
   const imageLinkInput = document.getElementById('imageLinkInput');

   imageUploadRadio.addEventListener('change', () => {
       if (imageUploadRadio.checked) {
           imageUploadInput.style.display = 'block';
           imageLinkInput.style.display = 'none';
       }
   });

   imageLinkRadio.addEventListener('change', () => {
       if (imageLinkRadio.checked) {
           imageLinkInput.style.display = 'block';
           imageUploadInput.style.display = 'none';
       }
   });
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
        image: '', // Initialize image as an empty string
        shortDescription: document.getElementById('shortDescription').value
    };

    // Check which image source option is selected
    const uploadImageRadio = document.getElementById('uploadImage');
    if (uploadImageRadio.checked) {
        // Handle image upload
        const imageFile = document.getElementById('imageUpload').files[0];
        if (imageFile) {
            newArtist.image = imageFile.name;
        }
    } else {
        // Handle image link
        newArtist.image = document.getElementById('imageLinkInput').value;
    }
    
    // Function from rest-service.js to create the artist.
    createNewArtist(newArtist)
        .then(artist => {
            artists.push(artist);
            showArtists();

            document.getElementById('createArtistModal').style.display = "none";
            alert('Artist has been created :)');
        })
        .catch(error => {
            console.error("Error adding artist:", error);
            alert('There was an issue adding the artist. Please try again.');
        });
}

// Redigere kunstner
function showEditArtistForm(artistId) {
    const artist = artists.find(a => a.id === artistId);

    // Set the image source
    document.getElementById('EditArtistImage').src = `images/${artist.image}`;

    const uniqueGenres = getUniqueGenres();
    const genreBobbles = uniqueGenres.map(genre => `
        <input type="checkbox" id="genre-${genre}" name="genres" value="${genre}" ${artist.genres.includes(genre) ? 'checked' : ''}>
        <label class="genre-bobble" for="genre-${genre}">
            <span>${genre}</span>
        </label>
    `).join('');

    const formHTML = `
        <h1 id="editText">Edit Artist</h1>
        <form id="edit-artist-form" data-artist-id="${artistId}">
            <label for="name">Name:</label>
            <input type="text" id="name">
            <label for="birthdate">Birthdate:</label>
            <input type="date" id="birthdate">
            <label for="activeSince">Active Since:</label>
            <input type="date" id="activeSince">
            <label>Genres:</label>
            <div id="genres-bobbles">
                ${genreBobbles}
            </div>
            <label for="labels">Labels (comma-separated):</label>
            <input type="text" id="labels">
            <label for="website">Website:</label>
            <input type="url" id="website">
            <label>Image:</label>
            <div>
                <input type="radio" id="uploadImage" name="imageSource" value="upload" checked>
                <label for="uploadImage">Upload</label>
                <input type="radio" id="imageLink" name="imageSource" value="link">
                <label for="imageLink">Link</label>
            </div>
            <input type="file" id="imageUpload" accept="image/*">
            <input type="text" id="imageLinkInput" placeholder="Image Link">
            <label for="shortDescription">Short Description:</label>
            <textarea id="shortDescription"></textarea>
            <button type="submit">Save Changes</button>
        </form>
    `;

    document.getElementById('edit-artist-content').innerHTML = formHTML;

    // Pre-populate the fields
    document.getElementById('name').value = artist.name;
    document.getElementById('birthdate').value = artist.birthdate;
    document.getElementById('activeSince').value = artist.activeSince;
    document.getElementById('labels').value = artist.labels.join(', ');
    document.getElementById('website').value = artist.website;
    document.getElementById('shortDescription').value = artist.shortDescription;

    // Add event listeners for image source options
    const imageUploadRadio = document.getElementById('uploadImage');
    const imageLinkRadio = document.getElementById('imageLink');
    const imageUploadInput = document.getElementById('imageUpload');
    const imageLinkInput = document.getElementById('imageLinkInput');

    imageUploadRadio.addEventListener('change', () => {
        if (imageUploadRadio.checked) {
            imageUploadInput.style.display = 'block';
            imageLinkInput.style.display = 'none';
        }
    });

    imageLinkRadio.addEventListener('change', () => {
        if (imageLinkRadio.checked) {
            imageLinkInput.style.display = 'block';
            imageUploadInput.style.display = 'none';
        }
    });

    document.getElementById('editArtistModal').style.display = "block";
    document.getElementById('edit-artist-form').addEventListener('submit', handleEditArtistFormSubmission);
}


// Send data videre
function handleEditArtistFormSubmission(event) {
    event.preventDefault();
    
    const artistId = event.target.getAttribute('data-artist-id');
    
    const updatedArtist = {
        name: document.getElementById('name').value,
        birthdate: document.getElementById('birthdate').value,
        activeSince: document.getElementById('activeSince').value,
        genres: Array.from(document.querySelectorAll('input[name="genres"]:checked')).map(checkbox => checkbox.value),
        labels: document.getElementById('labels').value.split(',').map(s => s.trim()),
        website: document.getElementById('website').value,
        image: '', // Initialize image as an empty string
        shortDescription: document.getElementById('shortDescription').value
    };

    // Check which image source option is selected
    const uploadImageRadio = document.getElementById('uploadImage');
    if (uploadImageRadio.checked) {
        // Handle image upload
        const imageFile = document.getElementById('imageUpload').files[0];
        if (imageFile) {
            // For this example, setting it to the file name, 
            // but you might want to upload it and then set to a returned URL
            updatedArtist.image = imageFile.name;
        }
    } else {
        // Handle image link
        updatedArtist.image = document.getElementById('imageLinkInput').value;
    }

    // Using the function from rest-service.js to update the artist
    updateArtist(artistId, updatedArtist)
        .then(artist => {
            const artistIndex = artists.findIndex(a => a.id === artistId);
            artists[artistIndex] = artist;
            showArtists();

            document.getElementById('editArtistModal').style.display = "none";
            alert('Artist has been updated :)');
        })
        .catch(error => {
            console.error("Error updating artist:", error);
            alert('There was an issue updating the artist. Please try again.');
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

// Slet kunstner
function deleteArtist(artistId) {
    const confirmDelete = window.confirm("Are you sure you want to delete this artist?");
    if (!confirmDelete) return;

    // Using the function from rest-service.js to delete the artist
    deleteArtistFromAPI(artistId)
        .then(() => {
            artists = artists.filter(artist => artist.id !== artistId);
            showArtists();
            alert('Artist has been deleted :)');
        })
        .catch(error => {
            console.error("Error deleting artist:", error);
            alert('There was an issue deleting the artist. Please try again.');
        });
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
    contentDiv.innerHTML = `
        <section id="about">
            <h1>About GrooveMuze</h1>
            <p>Welcome to GrooveMuze, where music becomes art, and artists become legends. Our platform is a symphony of creativity, dedicated to celebrating the diverse world of music. Explore, discover, and connect with an array of talented musicians, each a unique note in the grand composition of sound. Curate your own masterpiece by collecting your favorite artists, and immerse yourself in a harmonious journey of music appreciation.</p>
            <p>Whether you're a passionate music enthusiast or a budding artist, GrooveMuze invites you to join our rhythm and contribute to the ever-evolving melody of music. Unleash your inner maestro and explore the artistic tapestry of music like never before.</p>
        </section>
    `;
    history.pushState({ view: 'about' }, '', '/about');
}
