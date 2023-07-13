const ClientError = require("../../exception/ClientError");

class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongHandler = this.getSongHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const { title, year, genre, performer, duration, albumId } = request.payload;
      const songId = await this._service.addSong({ title, year, genre, performer, duration, albumId });
      const response = h.response({
        status: "success",
        data: { songId },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      //Server Error!
      const response = h.response({
        status: "error",
        message: "maaf, terjadi kesalahan pada server",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getSongHandler(request, h) {
    const songs = await this._service.getSong();
    const response = h.response({
      status: "success",
      data: {
        songs,
      },
    });
    return response;
  }

  async getSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const song = await this._service.getSongById(id);
      const response = h.response({
        status: "success",
        data: { song },
      });
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      //Server Error
      const response = h.response({
        status: "fail",
        message: "maaf, terjadi kegagalan pada server",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async putSongByIdHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const { id } = request.params;
      await this._service.editSongById(id, request.payload);
      const response = h.response({
        status: "success",
        message: "Lagu berhasil diperbarui",
      });
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      //Server Error
      const response = h.response({
        status: "fail",
        message: "maaf, terjadi kegagalan pada server",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteSongById(id);
      const response = h.response({
        status: "success",
        message: "Lagu berhasil di hapus",
      });
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      //Server Error
      const response = h.response({
        status: "fail",
        message: "maaf, terjadi kegagalan pada server",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = SongHandler;
