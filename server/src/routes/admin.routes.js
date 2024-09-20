import { Router } from 'express';
import { isAuthenticated, isAdmin } from '../middlewares/admin.middleware.js';
import {
  loginPage,
  adminLogin,
  adminRoute,
  logoutAdmin,
  aboutAdmin,
} from '../controllers/admin.controller.js';

const adminRouter = Router();

adminRouter.route('/login').get(loginPage);
adminRouter.route('/login').post(adminLogin);
// adminRouter.route('/admin').get(isAuthenticated, isAdmin, adminRoute);
adminRouter.get('/admin', isAuthenticated, isAdmin, adminRoute);
adminRouter.route('/logout').get(logoutAdmin);
adminRouter.route('/admin/about').get(aboutAdmin);

export default adminRouter;
