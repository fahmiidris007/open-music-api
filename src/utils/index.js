const mapDBToModel = ({ id, title, year, performer, genre, duration, albumid }) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: albumid,
});

module.exports = { mapDBToModel };
