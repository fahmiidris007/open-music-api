const { nanoid } = require("nanoid");
const InvariantError = require("../../../exception/InvariantError");
const NotFoundError = require("../../../exception/NotFoundError");

class SongServices {
  constructor() {
    this._songs = [];
  }

  addSong({ title, year, genre, performer, duration, albumId }) {
    const id = `song-${nanoid(16)}`;
    const newSong = { id, title, year, genre, performer, duration, albumId };
    this._songs.push(newSong);

    const isSuccess = this._songs.filter((song) => song.id === id).length > 0;
    if (!isSuccess) {
      throw new InvariantError("song gagal ditambahkan");
    }

    return id;
  }

  getSong() {
    return this._songs.map((song) => ({
      id: song.id,
      title: song.title,
      performer: song.performer,
    }));
  }

  getSongById(id) {
    const song = this._songs.filter((n) => n.id === id)[0];
    if (!song) {
      throw new NotFoundError("song tidak ditemukan");
    }

    return song;
  }

  editSongById(id, { title, year, genre, performer, duration, albumId }) {
    const index = this._songs.filterIndex((song) => song.id === id);
    if (index === -1) {
      throw new NotFoundError("song tidak ditemukan");
    }
    this._songs[index] = {
      ...this._songs[index],
      title,
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    };
  }

  deleteSongById(id) {
    const index = this._songs.findIndex((song) => song.id === id);
    if (index === -1) {
      throw new NotFoundError("song tidak ditemukan");
    }
    this._songs.splice(index, 1);
  }
}

module.exports = SongServices;
