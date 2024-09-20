import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  displayAllPlaylists,
  createPlaylist,
  editPlaylistName,
  deletePlaylistByName,
  checkSongInPlaylists,
  addSongToPlaylists,
  getSongsFromPlaylist,
} from '../controllers/playlist.controller.js';

const playlistsRouter = Router();

playlistsRouter.route('/all-playlists').get(verifyJWT, displayAllPlaylists);
playlistsRouter.route('/create-playlist').post(verifyJWT, createPlaylist);
playlistsRouter.route('/edit-playlist').post(verifyJWT, editPlaylistName);
playlistsRouter.route('/delete-playlist').post(verifyJWT, deletePlaylistByName);
playlistsRouter.route('/check-song-in-playlists').post(verifyJWT, checkSongInPlaylists);
playlistsRouter.route('/add-to-playlist').post(verifyJWT, addSongToPlaylists);
playlistsRouter.route('/get-playlist-songs').post(verifyJWT, getSongsFromPlaylist);

export default playlistsRouter;
