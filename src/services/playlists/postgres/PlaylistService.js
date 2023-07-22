const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../../exception/InvariantError");
const NotFoundError = require("../../../exception/NotFoundError");
const AuthorizationError = require("../../../exception/AuthorizationError");
const { mapSongDBToModel, mapPlaylistDBToModel } = require("../../../utils");

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist(name, owner) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: "insert into playlists values ($1, $2, $3) returning id",
      values: [id, name, owner],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("playlist gagal ditambahkan");
    }
    return result.rows[0].id;
  }

  async getPlaylists() {
    const query = {
      text: `select playlists.id, playlists.name, users.username 
            from playlists
            left join users on users.id = playlists.owner`,
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylist(id) {
    const query = {
      text: "delete from playlists where id = $1 returning id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("playlist tidak ditemukan");
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: "select * from playlists where id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("playlist tidak ditemukan");
    }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError("anda tidak berhak mengakses playlist ini");
    }
  }

  async addSongPlaylist(playlistId, songId) {
    const id = `playlist_songs ${nanoid(16)}`;
    const query = {
      text: "insert into playlist_songs values ($1, $2, $3) returning id",
      values: [id, playlistId, songId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("lagu gagal ditambahkan");
    }
  }

  async getSongsPlaylistId(playlistId) {
    const query = {
      text: `select playlists.id, playlists.name, users.username, songs.id as songid, songs.title as songtitle, songs.performer from playlists
            left join playlist_songs on playlist_songs.playlistid = playlists.id
            left join songs on songs.id = playlist_songs.songid
            left join users on users.id = playlists.owner
            where playlists.id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError("playlits tidak ditemukan");
    }

    const songs = result.rows.map(mapSongDBToModel);
    const playlist = result.rows.map(mapPlaylistDBToModel)[0];
    return { ...playlist, songs };
  }

  async deletePlaylistSong(playlistId, songId) {
    const query = {
      text: "delete from playlist_songs where playlistid =$1 and songid =$2 returning playlistid",
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError("lagu gagal dihapus");
    }
  }

  async verifySong(songId) {
    const query = {
      text: "select from songs where id = $1",
      values: [songId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("lagu tidak ditemukan");
    }
  }
}

module.exports = PlaylistsService;
