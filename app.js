document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/artists')
    .then(response => response.json())
    .then(data => {
        const list = document.getElementById('artists-list');
        data.forEach(artist => {
            const listItem = document.createElement('li');
            listItem.textContent = artist.name;
            list.appendChild(listItem);
        });
    });
});
