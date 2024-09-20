import { Router } from 'express';
import { compareSongsFolder, scanSongsFolder } from '../controllers/songs.controller.js';

const songsRouter = Router();

songsRouter.route('/auto-scan-songs').get(scanSongsFolder);
songsRouter.route('/compare-songs-folders').get(compareSongsFolder);

export default songsRouter;
