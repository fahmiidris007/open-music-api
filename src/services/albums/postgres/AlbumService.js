const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../../exception/InvariantError");
const NotFoundError = require("../../../exception/NotFoundError");

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const query = {
      text: "insert into albums values($1,$2,$3) returning id",
      values: [id, name, year],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("album gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: "select id, name, year from albums where id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("album tidak ditemukan");
    }

    return result.rows[0];
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: "update albums set name = $1, year= $2 where id = $3 returning id",
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("album tidak ditemukan");
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: "delete from albums where id = $1 returning id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("album tidak ditemukan");
    }
  }
}

module.exports = AlbumService;
