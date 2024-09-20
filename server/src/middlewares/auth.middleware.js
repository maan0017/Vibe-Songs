import { apiErrors } from '../utils/apiErrors.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer', '');
    console.log(token);
    if (!token) {
      console.log('unable to access token');
      return res.status(250).json();
    }

    const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select('-password -refreshToken');
    if (!user) {
      throw new apiErrors(401, 'invalid access token');
    }
    console.log(user);
    req.user = user;
    next();
  } catch (error) {
    throw new apiErrors(401, error?.message || 'invalid access token');
  }
});
