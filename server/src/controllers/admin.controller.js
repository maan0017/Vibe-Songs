import { asyncHandler } from '../utils/asyncHandler.js';
import { apiErrors } from '../utils/apiErrors.js';
import { apiResponse } from '../utils/apiResponse.js';
import { Admin } from '../models/admin.model.js';

const loginPage = asyncHandler(async (req, res) => {
  res.render('login', { error: null });
});

// Handle login form submission
const adminLogin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await Admin.findOne({
    $or: [{ name: username }, { email: username }],
  });
  if (!user) {
    return res.render('login', { error: 'Invalid credentials. Please try again.' });
  }

  // Placeholder for actual authentication logic (use database in real apps)
  if (password === user.password) {
    console.log('successfull login');
    req.session.isLoggedIn = true;
    req.session.userRole = 'admin'; // Give admin privileges
    return res.redirect('/sudo/admin');
  } else {
    return res.render('login', { error: 'Invalid credentials. Please try again.' });
  }
});

// Admin route (only accessible to admin users)
const adminRoute = asyncHandler(async (req, res) => {
  res.render('profile', { user: 'maan' });
});

//logout
const logoutAdmin = asyncHandler(async (req, res) => {
  req.session.destroy();
  res.redirect('/sudo/admin');
});

const aboutAdmin = asyncHandler(async (req, res) => {
  res.send('about');
});

export { loginPage, adminLogin, adminRoute, logoutAdmin, aboutAdmin };
