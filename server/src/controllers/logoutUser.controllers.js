import { asyncHandler } from '../utils/asyncHandler.js';
import { apiErrors } from '../utils/apiErrors.js';
import { User } from '../models/user.model.js';
import { apiResponse } from '../utils/apiResponse.js';

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  // console.log(`${chalk.magenta('user logged out successfully')}`);

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new apiResponse(200, {}, 'user logged out successfully'));
});

export default logoutUser;
