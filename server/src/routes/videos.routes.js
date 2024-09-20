import { Router } from 'express';
import { allVideoFiles, getFileSize } from '../controllers/allVideoFiles.js';

const videosRouter = Router();

videosRouter.route('/all-videos').get(allVideoFiles);
videosRouter.route('/file-size').post(getFileSize);

export default videosRouter;
