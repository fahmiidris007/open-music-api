const mapDBToModel = ({ id, title, year, performer, genre, duration, albumid }) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: albumid,
});

const mapSongDBToModel = ({ songid, songtitle, performer }) => ({
  id: songid,
  title: songtitle,
  performer,
});

const mapPlaylistDBToModel = ({ id, name, username }) => ({
  id,
  name,
  username,
});

module.exports = { mapDBToModel, mapSongDBToModel, mapPlaylistDBToModel };
