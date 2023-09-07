// search.js

document.addEventListener('DOMContentLoaded', () => {

    let searchBar = document.getElementById("search-bar");

    // Search functions
function performSearch() {
    if (!window.artists) {
        console.error("Artists data has not been loaded yet.");
        return;
    }

    const query = searchBar.value.toLowerCase();
    let filteredArtists = window.artists;

    // Filter based on context
    if (currentContext === 'artists') {
        filteredArtists = filteredArtists.filter(artist => artist.name.toLowerCase().includes(query));
    } else if (currentContext === 'genre') {
        filteredArtists = filteredArtists.filter(artist => artist.genres.includes(currentGenre) && artist.name.toLowerCase().includes(query));
    }
    // Add conditions for other contexts if necessary...

    displayFilteredArtists(filteredArtists);
}



function displayFilteredArtists(filteredArtists) {
    let artistHTML = '';
    filteredArtists.forEach(artist => {
        artistHTML += `
            <div class="artist-card">
                <img src="/images/${artist.image}" alt="${artist.name}">
                <h3>${artist.name}</h3>
                <p>${artist.shortDescription}</p>
                <a href="${artist.website}" target="_blank">Visit Website</a>
                <button onclick="toggleFavorite(${artist.id})">${(window.favorites && window.favorites.includes(artist.id)) ? 'Remove from Favorites' : 'Add to Favorites'}</button>
            </div>`;
    });
    document.getElementById('content').innerHTML = artistHTML;
}

    // Event listeners
    searchBar.addEventListener("input", performSearch);

    searchBar.addEventListener("focus", function() {
        searchBar.placeholder = "Search";
    });

    searchBar.addEventListener("blur", function() {
        if (!searchBar.value) {
            searchBar.placeholder = "";
        }
    });

});
