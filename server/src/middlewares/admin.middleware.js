// Middleware to check if user is logged in
export const isAuthenticated = (req, res, next) => {
  if (req.session.isLoggedIn) {
    return next();
  }
  res.redirect('/sudo/login');
};

// Middleware to check if user is admin
export const isAdmin = (req, res, next) => {
  if (req.session.userRole === 'admin') {
    return next();
  }
  res.send('You do not have admin privileges.');
};
