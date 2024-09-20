import { Router } from 'express';
import { registerUser } from '../controllers/registerUser.controller.js';
import { userHome } from '../controllers/homeUser.controller.js';
import {
  changeUserPassword,
  loginUser,
  refreshAccessToken,
  updateEmail,
  updateUsername,
} from '../controllers/loginUser.controller.js';
import logoutUser from '../controllers/logoutUser.controllers.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/home').get(userHome);
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/refresh-token').post(verifyJWT, refreshAccessToken);
router.route('/update-username').post(verifyJWT, updateUsername);
router.route('/update-email').post(verifyJWT, updateEmail);
router.route('/change-password').post(verifyJWT, changeUserPassword);

//secured routes
router.route('/logout').post(verifyJWT, logoutUser);

// router.route('/login').post(registerUser, () => {});

export default router;
