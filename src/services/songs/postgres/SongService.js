const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../../exception/InvariantError");
const NotFoundError = require("../../../exception/NotFoundError");
const { mapDBToModel } = require("../../../utils");

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, performer, genre, duration, albumId }) {
    const id = `song-${nanoid(16)}`;
    const query = {
      text: "insert into songs values($1,$2,$3,$4,$5,$6,$7) returning id",
      values: [id, title, year, performer, genre, duration, albumId],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("lagu gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getSong() {
    const query = {
      text: "select id, title, performer from songs",
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: "select * from songs where id= $1",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("lagu tidak ditemukan");
    }

    return result.rows.map(mapDBToModel)[0];
  }

  async editSongById(id, { title, year, genre, performer, duration, albumId }) {
    const query = {
      text: "update songs set title = $1, year = $2, performer = $3, genre = $4, duration = $5, albumId =$6 where id = $7 returning id",
      values: [title, year, performer, genre, duration, albumId, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("song tidak ditemukan");
    }
  }

  async deleteSongById(id) {
    const query = {
      text: "delete from songs where id = $1 returning id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("lagu tidak ditemukan");
    }
  }
}

module.exports = SongService;
