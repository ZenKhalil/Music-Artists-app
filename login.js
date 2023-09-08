import express from 'express';

const loginRouter = express.Router();

// Define the admin password (replace with your desired password)
const ADMIN_PASSWORD = '124578';

// Initialize user data (you can store this in a database)
const users = [
  {
    username: 'admin', // The admin username
    password: ADMIN_PASSWORD,
    role: 'admin', // The role can be 'admin' or 'user'
  },
  // Add more users here if needed
];

// Middleware to authenticate users
function authenticateUser(req, res, next) {
  const { username, password } = req.body;

  // Check if a user with the provided username and password exists
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // Set the authenticated user and role in the request object
    req.user = user;
    next(); // Continue to the next middleware or route
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
}

// Middleware to authorize admin access
function authorizeAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    // User is authenticated and has admin role, proceed
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied' });
  }
}

// Login endpoint
loginRouter.post('/', authenticateUser, (req, res) => {
  // If the user reaches this point, they are authenticated
  // You can generate a token or session here if needed
  res.json({ success: true, message: 'Logged in successfully' });
});

export { loginRouter, authorizeAdmin };
