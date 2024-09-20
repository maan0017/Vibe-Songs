import { asyncHandler } from '../utils/asyncHandler.js';

const userHome = asyncHandler(async (req, res) => {
  res.send('welcome home user');
});

export { userHome };
