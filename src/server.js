require("dotenv").config();

const Hapi = require("@hapi/hapi");
const albums = require("./api/albums");
const AlbumService = require("./services/albums/postgres/AlbumService");
const AlbumValidator = require("./validator/albums");
const SongService = require("./services/songs/postgres/SongService");
const songs = require("./api/songs");
const SongValidator = require("./validator/songs");

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();
  const server = Hapi.server({
    port: process.env.port,
    host: process.env.host,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songService,
        validator: SongValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
