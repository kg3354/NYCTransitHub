const express = require('express');
const path = require('path');
const app = express();

const mysql = require('mysql');
const session = require('express-session');


// Serve static files from the project root directory
app.use(express.static(path.join(__dirname, 'public')));

// Use built-in middleware for urlencoded form data
app.use(express.urlencoded({ extended: true }));

// Setup session configuration
app.use(session({
  secret: 'yourSecretKey', // Change this to a random secret string
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' } // Set `true` in production with HTTPS
}));

// Create a connection to the database
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root', 
  password: "", 
  database: 'MTAacl'
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('Error connecting to the MySQL server:', err);
    process.exit(1); // Stop the process if unable to connect
  }
  console.log('Connected to the MySQL server.');
});

// Middleware
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const sqlcheck1 = `SELECT * FROM acl WHERE username = ?`;
  db.query(sqlcheck1, [username], (err, results) => {
    if (err) {
      console.log(err); // Log any error that occurs during the query.
      return res.send('Error checking username existence.');
    }
    if (results.length > 0) {
      return res.send('Username already exists');
    }
    const sql = `INSERT INTO acl (username, password, token) VALUES (?, ?, ?)`;
    db.query(sql, [username, password, 4], (err, result) => {
      if (err) {
        console.log(err); // Log the error
        return res.send('Error registering the user.');
      }
      res.send('User registered successfully.');
    });
  });
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = `SELECT token FROM acl WHERE username = ? AND password = ?`;
  db.query(sql, [username, password], (err, results) => {
      if (err) {
          // Log error and respond with error status
          console.error('Error during DB query:', err);
          return res.status(500).json({loginSuccess: false, message: "Internal server error"});
      }
      if (results.length > 0) {
          // Login success
          req.session.token = results[0].token; // Assuming you have session middleware set up
          res.json({loginSuccess: true, message: "Login successful!"});
      } else {
          // Login failure
          res.json({loginSuccess: false, message: "Login failed. User not found or password incorrect."});
      }
  });
});

// Example notifications route - adjust as needed
app.get('/notifications', (req, res) => {
  if (req.session.token) {
    // Serve the notifications content or page
  } else {
    // Redirect or handle unauthorized access
    res.redirect('/');
  }
});
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});