const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();

// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: true }));

// Middleware for session management
app.use(session({
    secret: 's3cr3t', // Change this to a secure random string
    resave: false,
    saveUninitialized: true
}));

// Dummy user data (ideally, this would be stored securely in a database)
const users = [
    { id: 1, username: 'admin', passwordHash: '$2b$10$ccSmZkt.VA.G/nMzO1v/uO1ufUeMofzQKegs0bt5yUuBfwL9EpVSC' } // Password is "admin123"
];

// Middleware for checking if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Login route
app.get('/login', (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Login</title>
        </head>
        <body>
            <h1>Login</h1>
            <form method="post" action="/login">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required>
                <br>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
                <br>
                <button type="submit">Login</button>
            </form>
        </body>
        </html>
    `);
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        res.status(401).send('Invalid username or password');
        return;
    }

    req.session.userId = user.id;
    res.redirect('/admin-panel');
});

// Admin panel route (requires authentication)
app.get('/admin-panel', (req, res) => {
//app.get('/admin-panel', isAuthenticated, (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Admin Panel</title>
        </head>
        <body>
            <h1>Welcome to the Admin Panel</h1>
            <p>Only authenticated users can access this page.</p>
            <a href="/logout">Logout</a>
        </body>
        </html>
    `);
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});