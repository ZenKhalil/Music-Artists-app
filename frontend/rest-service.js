//Endpoint
const endpoint = "http://localhost:3000"; 

export function fetchArtistsFromAPI() {
    return fetch(`${endpoint}/artists`).then(response => response.json());
}

export function createNewArtist(artistData) {
    return fetch(`${endpoint}/artists`, {
        method: 'POST',
        headers: {        
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(artistData)
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Failed to create a new artist");
        }
    });
}

// Function to update artist data
export function updateArtist(artistId, updatedData) {
    return fetch(`${endpoint}/artists/${artistId}`, {
        method: 'PUT',
        headers: {        
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Failed to update artist");
        }
    });
}

// Function to delete an artist
export function deleteArtistFromAPI(artistId) {
    return fetch(`${endpoint}/artists/${artistId}`, {
        method: 'DELETE',
    }).then(response => {
        if (response.ok) {
            return true;
        } else {
            return response.text().then(error => {
                throw new Error(error || "Failed to delete artist");
            });
        }
    });
}