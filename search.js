document.addEventListener('DOMContentLoaded', () => {

    let searchBar = document.getElementById("search-bar");

    // Search functions
    function performSearch() {
        const query = searchBar.value.toLowerCase();
    
        const filteredArtists = window.artists.filter(artist => 
            artist.name.toLowerCase().includes(query)
        );
    
        displayFilteredArtists(filteredArtists);
    }

    function displayFilteredArtists(filteredArtists) {
        let artistHTML = '';
        filteredArtists.forEach(artist => {
            artistHTML += `
                <div class="artist-card">
                    <img src="images/${artist.image}" alt="${artist.name}">
                    <h3>${artist.name}</h3>
                    <p>${artist.shortDescription}</p>
                    <a href="${artist.website}" target="_blank">Visit Website</a>
                    <button onclick="toggleFavorite(${artist.id})">${window.favorites.includes(artist.id) ? 'Remove from Favorites' : 'Add to Favorites'}</button>
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