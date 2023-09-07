"use strict";

//Importering af funktioner/variable
import { getArtists, createArtist, updateArtist, deleteArtist, endpoint } from "./rest-services.js";

//Kør startfunktionen automatisk på load
window.addEventListener("load", initApp);

//Globale variable
let artists;
let chosenArtist;
let favoriteList;
let savedFavorites = JSON.parse(localStorage.getItem("favorites"));
let view = "home";

//Fetcher kunstnerlisten og aktivierer eventListeners
async function initApp() {
  artists = await getArtists(`${endpoint}/artists`);
  console.log(artists);
  globalListeners();

  //Finder favoritlisten i localStorage
  if (savedFavorites) {
    favoriteList = savedFavorites;
    console.log(favoriteList);
  } else {
    favoriteList = [];
  }

  //Viser listen grafisk
  showArtists(artists);
}

//EventListeners
function globalListeners() {
  document.querySelector("#btn-close-create").addEventListener("click", () => closeDialog(document.querySelector("#create-dialog")));
  document.querySelector("#btn-close-update").addEventListener("click", () => closeDialog(document.querySelector("#update-dialog")));
  document.querySelector("#btn-create").addEventListener("click", createClicked);
  document.querySelector("#home-link").addEventListener("click", goHome);
  document.querySelector("#favorite-link").addEventListener("click", goToFavorites);
  document.querySelector("#sort-select").addEventListener("change", chooseSort);
  document.querySelector("#input-search").addEventListener("keyup", (event) => showArtists(artists.filter((artist) => artist.name.toLowerCase().includes(event.target.value.toLowerCase()))));
}

//Dom manipulation på kunstnerlisten
function showArtists(artistList) {
  document.querySelector("#grid-container").innerHTML = "";
  for (const artist of artistList) {
    document.querySelector("#grid-container").insertAdjacentHTML(
      "beforeend",
      /*HTML*/ `

    
        <article class="grid-box">

            <h2 class="artist-name">${artist.name}</h2>
            <div class="card-content-first">
              <img class="artist-image" src=${artist.image} alt="" />
              <p class="artist-genres">${artist.genres}</p>
              <p class="artist-desc">${artist.shortDescription}</p>
              <p class="artist-see-more press-this">SEE MORE</p>
            </div>
            <div class="card-btns">
              <button class="btn-favorite"><i class="fa-regular fa-heart fa-xl" style="color: #0f0f0f;"></i></button>
              <button class="btn-update">EDIT</button>
              <button class="btn-delete">DELETE</button>
            </div>
            <div class="card-content-second" class="hide">
              <p class="artist-labels">Labels: ${artist.labels}</p>
              <p class="artist-active">Active since ${artist.activeSince}</p>
              <p class="artist-birthdate">Birthdate: ${artist.birthdate}</p>
              <p class="artist-website">Website: ${artist.website}</p>
              <p class="artist-reset press-this">RESET</p>
            </div>

        </article>
    `
    );

    //eventlisteners på hvert kunstnerkort
    document.querySelector("article:last-child .btn-update").addEventListener("click", () => updateClicked(artist));
    document.querySelector("article:last-child .btn-delete").addEventListener("click", () => deleteClicked(artist.id, artist));
    document.querySelector("article:last-child .artist-see-more").addEventListener("click", scrollCardsUp);
    document.querySelector("article:last-child .artist-reset").addEventListener("click", scrollCardsDown);

    //Bestemmer om hjerteikonet skal være orange eller pink (alt efter om en kunstner er "liked")
    const favBtn = document.querySelector("article:last-child .btn-favorite");
    let favoritesString = JSON.stringify(favoriteList);
    if (favoritesString.includes(artist.id)) {
      console.log(true);
      favBtn.style.backgroundColor = "rgb(255, 68, 165)";
      favBtn.innerHTML = `<i class="fa-solid fa-heart fa-xl" style="color: #0f0f0f;"></i>`;
    } else {
      console.log(false);
    }
    favBtn.addEventListener("click", () => favoriteArtist(artist, favBtn));
  }
}

//Opdaterer den viste liste alt efter hvad der skal vises
async function updateGrid() {
  switch (view) {
    case "home":
      showArtists(artists);
      break;
    case "fave":
      showArtists(favoriteList);
      break;
  }
}

//Tilføjer/fjerner en kunstner fra favoritlisten og local storage
function favoriteArtist(artist, favBtn) {
  let favoritesString = JSON.stringify(favoriteList);
  console.log(favoritesString);

  if (favoritesString.includes(artist.id)) {
    const position = favoriteList.indexOf(artist);
    favoriteList.splice(position, 1);
    localStorage.setItem("favorites", JSON.stringify(favoriteList));
    console.log(favoriteList);
    favBtn.innerHTML = `<i class="fa-regular fa-heart fa-xl" style="color: #0f0f0f;"></i>`;
    favBtn.style.backgroundColor = "rgb(252, 176, 69)";
  } else {
    favoriteList.push(artist);
    console.log(favoriteList);
    localStorage.setItem("favorites", JSON.stringify(favoriteList));
    favBtn.innerHTML = `<i class="fa-solid fa-heart fa-xl" style="color: #0f0f0f;"></i>`;
    favBtn.style.backgroundColor = "rgb(255, 68, 165)";
  }
}

//Viser CREATE-formen
function createClicked() {
  document.querySelector("#create-dialog").showModal();
  document.querySelector("#create-form").addEventListener("submit", createArtist);
}

//Viser UPDATE-formen med gammle værdier
function updateClicked(artist) {
  document.querySelector("#update-dialog").showModal();

  chosenArtist = artist;

  document.querySelector("#updateName").value = artist.name;
  document.querySelector("#updateActive").value = artist.activeSince;
  document.querySelector("#updateGenres").value = artist.genres;
  document.querySelector("#updateLabels").value = artist.labels;
  document.querySelector("#updateBirthdate").value = artist.birthdate;
  document.querySelector("#updateDesc").value = artist.shortDescription;
  document.querySelector("#updateWebsite").value = artist.website;
  document.querySelector("#updateImage").value = artist.image;

  console.log(chosenArtist.id);

  document.querySelector("#update-form").addEventListener("submit", updateArtist);
}

//Viser DELETE-Dialogen
function deleteClicked(id, artist) {
  const delDialog = document.querySelector("#delete-dialog");
  delDialog.showModal();
  document.querySelector("#btn-delete-confirm").addEventListener("click", () => deleteArtist(id, artist));
  document.querySelector("#btn-delete-cancel").addEventListener("click", () => closeDialog(delDialog));
}

//Lukker den åbne dialog
function closeDialog(dialog) {
  dialog.close();
}

//Ændr nuværende view til "home" så den fulde liste skal vises
function goHome() {
  document.querySelector("#grid-container").innerHTML = "";
  view = "home";
  updateGrid();
}

//Ændr nuværende view til "fave" så favoritlisten skal vises
function goToFavorites() {
  document.querySelector("#grid-container").innerHTML = "";
  view = "fave";
  updateGrid();
}

//Vælg og kald den korrekte sorteingsfunktion baseret på valgt value i dropdownmenuen
function chooseSort() {
  let sortValue = document.querySelector("#sort-select").value;
  console.log(sortValue);
  switch (sortValue) {
    case "name":
      artists.sort(sortByName);
      console.log(artists);
      favoriteList.sort(sortByName);
      updateGrid();
      break;
    case "active":
      artists.sort(sortByActive);
      console.log(artists);
      favoriteList.sort(sortByActive);
      updateGrid();
      break;
  }
}

//Sorter efter Navn
function sortByName(a, b) {
  return a.name.localeCompare(b.name);
}

//Sorter efter Debutår
function sortByActive(a, b) {
  return a.activeSince - b.activeSince;
}

// async function search(searchValue) {
//   showArtists(artists.filter((artist) => artist.name.toLowerCase().includes(searchValue.toLowerCase())));
// }

//Kør animationen som viser yderligere info om kunstneren
function scrollCardsUp(event) {
  const gridbox = event.target.parentNode.parentNode;

  gridbox.querySelector(".card-content-first").classList.remove("scroll-down-show");
  gridbox.querySelector(".card-content-second").classList.remove("scroll-down-hide");

  gridbox.querySelector(".card-content-first").classList.add("scroll-up-hide");
  gridbox.querySelector(".card-content-second").classList.remove("hide");
  gridbox.querySelector(".card-content-second").classList.add("scroll-up-show");
}

//Kør animationen som viser original info om kunstneren
function scrollCardsDown(event) {
  const gridbox = event.target.parentNode.parentNode;

  gridbox.querySelector(".card-content-first").classList.remove("scroll-up-hide");
  gridbox.querySelector(".card-content-second").classList.remove("scroll-up-show");
  gridbox.querySelector(".card-content-first").classList.add("scroll-down-show");
  gridbox.querySelector(".card-content-second").classList.add("scroll-down-hide");
}

//Eksportering af funktioner/variable
export { updateGrid, chosenArtist, artists, favoriteList };
