document.addEventListener('DOMContentLoaded', () => {

    let searchBar = document.getElementById("search-bar");

    function performSearch() {
        const query = searchBar.value.toLowerCase();
    
        const artistCards = document.querySelectorAll('.artist-card'); // select all artist cards on the page
        artistCards.forEach(card => {
            const artistName = card.querySelector('h3').textContent.toLowerCase(); // get the artist name from the card
            if (artistName.includes(query)) {
                card.style.display = 'block'; // show card if name matches query
            } else {
                card.style.display = 'none'; // hide card if name doesn't match query
            }
        });
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
