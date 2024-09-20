import { asyncHandler } from '../utils/asyncHandler.js';
import { apiErrors } from '../utils/apiErrors.js';
import { User } from '../models/user.model.js';
import { apiResponse } from '../utils/apiResponse.js';
import chalk from 'chalk';
import jwt from 'jsonwebtoken';
import { use } from 'bcrypt/promises.js';

const checkAuth = asyncHandler(async (req, res) => {});

const generateAccessAndRefreshToken = async userId => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    //save refresh token to database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiErrors(500, 'failed to generate tokens');
  }
};

const loginUser = asyncHandler(async (req, res) => {
  console.log('/login');
  //1.get data from frontend - username,email,password
  const { id, password } = req.body;
  console.log(id, password);

  // 2.valdiation - details not empty
  if ([id, password].some(field => field?.trim() === '')) {
    res.send('id & password required');
    throw new apiErrors(400, 'All field are required');
  }

  //2.check username or email exists
  const user = await User.findOne({
    $or: [{ username: id }, { email: id }],
  });

  //3.find the user
  if (!user) {
    throw new apiErrors(401, 'Access Denied! Invalid Credentials');
  }

  //4.check password
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    res.send('password is incorrect');
    throw new apiErrors(401, 'password is incorrect');
  }

  //5.access and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  //6.send cookie
  const loggedInUser = await User.findById(user._id).select('-password -refreshToken');
  const options = {
    httpOnly: true, //makes the cookie inaccessible to javascript
    secure: true, // send only over https
    sameSite: 'Strict', //prevent cross site request
    maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expires in 7 days
  };

  //7.return res
  console.log(
    `${chalk.green(`user found successfully`)} \n
id : ${chalk.magenta(`${id}`)}\n
username : ${chalk.yellow.bold(`${user.username}`)}\n
user email : ${chalk.yellow.bold(`${user.email}`)}\n
user password :${chalk.yellow.bold(`${user.password}`)}\n
refresh token : ${chalk.blue(`${refreshToken}`)}\n
access token : ${chalk.blue(`${accessToken}`)}
`,
  );
  return res
    .status(200, { message: 'user found' })
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        'user logged in successfully',
      ),
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomigRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!incomigRefreshToken) {
    throw new apiErrors(401, 'unautherized request : incoming refresh token not found');
  }

  try {
    const decodedToken = jwt.verify(incomigRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new apiErrors(401, 'invlaid refresh token : user not found');
    }

    if (incomigRefreshToken !== user?.refreshToken) {
      throw new apiErrors(
        401,
        'incoming refresh token does not matched to user refresh token => refresh token is expired or used',
      );
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id);

    res
      .status()
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', newRefreshToken, options)
      .json(
        new apiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          'Access Token Refreshed',
        ),
      );
  } catch (error) {
    throw new apiErrors(401, error?.message || 'invalid refresh token');
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(200, req.user, 'current user fetched successfully');
});

const changeUserPassword = asyncHandler(async (req, res) => {
  console.log('/chage-password');
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new apiErrors(405, 'invlaid old password');
  }

  user.originalPassword = newPassword;
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  console.log(user);

  console.log();

  return res.status(200).json(new apiResponse(200, {}, 'password changed successfully'));
});

const updateUsername = asyncHandler(async (req, res) => {
  const { newUsername } = req.body;
  if (!newUsername) {
    throw new apiErrors(400, 'username cannot be empty!');
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        username: newUsername,
      },
    },
    { new: true },
  ).select('-password');

  //5.access and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  //6.send cookie
  const loggedInUser = await User.findById(user._id).select('-password -refreshToken');
  console.log(loggedInUser);
  const options = {
    httpOnly: true, //makes the cookie inaccessible to javascript
    secure: true, // send only over https
    sameSite: 'Strict', //prevent cross site request
    maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expires in 7 days
  };
  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        'username updated successfully',
      ),
    );
});

const updateEmail = asyncHandler(async (req, res) => {
  const { newEmail } = req.body;
  if (!newEmail) {
    throw new apiErrors(400, 'email cannot be empty!');
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        email: newEmail,
      },
    },
    { new: true },
  ).select('-password');

  //5.access and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  //6.send cookie
  const loggedInUser = await User.findById(user._id).select('-password -refreshToken');
  console.log(loggedInUser);
  const options = {
    httpOnly: true, //makes the cookie inaccessible to javascript
    secure: true, // send only over https
    sameSite: 'Strict', //prevent cross site request
    maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expires in 7 days
  };
  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        'username updated successfully',
      ),
    );
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  if (!username || !email) {
    throw new apiErrors(400, 'all fields are required');
  }

  const user = await User.findByIdAndUpdate(
    user?._id,
    {
      $set: {
        username: username,
        email: email,
      },
    },
    { new: true },
  ).select('-password');

  return res
    .status(200)
    .json(new apiResponse(200, { user }, 'Account details updated successfully'));
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new apiErrors(400, 'profile picture is missing');
  }

  //upload proile picture on cloudinary (optional)

  //update profile picture path in database
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        //dp/avatar/profile photo path or url updation on database
      },
    },
    {
      new: true,
    },
  ).select('-password');

  //delete old profile picture
  return res.send(200).json(new apiResponse(200, user, 'profile picture updated successfuly'));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;
  if (!coverImageLocalPath) {
    throw new apiErrors(400, 'cover image is missing');
  }

  //upload cover image on cloudinary (optional)

  //update profile picture path in database
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        //cover photo path or url updation on database
      },
    },
    {
      new: true,
    },
  ).select('-password');

  //delete old cover image
  return res.send(200).json(new apiResponse(200, user, 'cover image updated successfuly'));
});

export {
  checkAuth,
  loginUser,
  refreshAccessToken,
  getCurrentUser,
  changeUserPassword,
  updateUsername,
  updateEmail,
  updateUserDetails,
  updateUserProfile,
  updateUserCoverImage,
};
