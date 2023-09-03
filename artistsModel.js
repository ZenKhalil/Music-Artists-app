// artistModel.js
class Artist {
  constructor(id, name, birthdate, activeSince, genres, labels, website, image, shortDescription) {
    this.id = id;
    this.name = name;
    this.birthdate = birthdate;
    this.activeSince = activeSince;
    this.genres = genres;
    this.labels = labels;
    this.website = website;
    this.image = image;
    this.shortDescription = shortDescription;
  }
}

module.exports = Artist;
