# ARTIST-APP

Projektet opfylder kravene for CRUD-operationer. De nævnte funktioner spiller sammen med get, post, put og delete metoderne i backenden.

Applikation har også fået inkorporeret et søgefelt og en dropdown menu som fungerer gennem brugen af hhv. filtrering og sortering. Derudover Kan brugeren tilføje sine favorit kunstnere til en favoritliste som kan vises i sit eget “view”.

## Forudsætninger

Inden du begynder, skal du sikre dig, at følgende software er installeret på din computer:

Node.js - JavaScript runtime-miljø

npm (Node Package Manager) - Installeret sammen med Node.js

Git - Versionsstyringssystem (valgfrit, men anbefales)

## Installation

Lave en klon af dette Repo.

Åbn projektmappen i en bash terminal og find backend mappen

```bash
cd backend
```

Brug package manager [npm](https://www.npmjs.com/) til at installere de korrekte dependencies.

```bash
npm install
```

Find index.html-filen og åbn den i en live server.

## Brug

I live serveren kan du se en liste af kort med adskillige kunstnere.

Tryk på hjerte-ikonet på det enekelte kort for at tilføje den valgte kunstner til din favoritliste.

Favoritlisten findes øverst på siden ved tryk på "FAVORITES"-linket

Øverst i venstre hjørne findes sorteringsmenuen sammen med en søgebar.

Samme sted er "CREATE ARTIST"-kneppen placeret som viser en formula til oprettelsen af nye kunstnere.

På hvert kort findes også "EDIT" og "DELETE-knapper som gør det muligt at hhv. rette i dataen og slette en kunstner.

"SEE MORE" knappen placeret i bunden af hvert kort viser yderligere information om den valgte kunstner, på samme måde fungerer "RESET" knappen til at genvise den originale infoliste.
