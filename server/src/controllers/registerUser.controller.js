import { asyncHandler } from '../utils/asyncHandler.js';
import { apiErrors } from '../utils/apiErrors.js';
import { User } from '../models/user.model.js';
import { apiResponse } from '../utils/apiResponse.js';
import { findUser, insertData } from '../db/mongoDB.connect.js';
import chalk from 'chalk';

const registerUser = asyncHandler(async (req, res) => {
  console.log('/register');

  //1.get user details from frontend-(username,email,password)
  console.log(req.body);
  const { username, email, password } = req.body;
  console.log(`username : ${chalk.green(`${username}`)}`);
  console.log(`email : ${chalk.green(`${email}`)}`);
  console.log(`password : ${chalk.green(`${password}`)}`);

  res.status(200, {
    message: 'checking that all fields are not empty',
  });

  // 2.valdiation - details not empty
  if ([username, email, password].some(field => field?.trim() === '')) {
    throw new apiErrors(400, 'All field are required');
  }

  //3.check if user already exists -(username & email)
  const existedUserMongoose = await User.findOne({
    $or: [{ username: username }, { email: email }],
  });
  if (existedUserMongoose) {
    throw new apiErrors(409, `user already exists in mongoose`);
  }

  const existedUserMongoDB = await findUser(username, email);
  if (existedUserMongoDB) {
    throw new apiErrors(409, `user already exists in mongoDB`);
  }

  //4.create user object -create entry in DB
  //inserting data in mongoose
  const userMongoose = await User.create({
    username,
    email,
    originalPassword: password,
    password,
  });
  //inserting data in mongodb
  // await insertData(username, email, password);

  // //5.check user entery but don't display their password
  // //remove password and refresh token field from response
  const createdUserMongoose = await User.findById(userMongoose._id).select('-password');
  // const createdUserMongoDB = await findUser(username, email);

  //6.check for user creation
  if (!createdUserMongoose) {
    throw new apiErrors(500, 'something went wrong during inserting data in mongoose');
  }
  // if (!createdUserMongoDB) {
  //   throw new apiErrors(500, 'something went wrong during inserting data in mongoDB');
  // }

  // //7.return res
  console.log(
    `${chalk.green(`user registered successfully in mongoose`)} \n
user username : ${chalk.green.bold(`${username}`)}\n
user email : ${chalk.green.bold(`${email}`)}\n
user password :${chalk.green.bold(`${userMongoose.originalPassword}`)}\n
user password :${chalk.green.bold(`${userMongoose.password}`)}\n
      `,
  );
  //   console.log(
  //     `${chalk.green(`user registered successfully in mongoDB`)} \n
  // user username : ${chalk.green.bold(`${username}`)}\n
  // user email : ${chalk.green.bold(`${email}`)}\n
  // user password :${chalk.green.bold(`${password}`)}\n
  //     `,
  // );
  return res
    .status(201)
    .json(new apiResponse(200, createdUserMongoose, 'user registered successfully'));
});

export { registerUser };
