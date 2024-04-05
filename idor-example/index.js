//IDOR means Insecure Direct Object Reference. It's a vulnerability where an attacker can access unauthorized data by manipulating the input object.
//URLs to test with are http://localhost:3000/profile/123 and http://localhost:3000/profile/456

const express = require('express');
const app = express();

const users = {
    '123': { id: '123', username: 'user1', email: 'user1@example.com' },
    '456': { id: '456', username: 'user2', email: 'user2@example.com' }
};

app.get('/profile/:id', (req, res) => {
    const userId = req.params.id;
    const user = users[userId];

    if (!user) {
        return res.status(404).send('User not found');
    }

    // Insecurely exposing user data to the frontend
    res.send(`
        <html>
        <head>
            <title>User Profile</title>
        </head>
        <body>
            <h1>User Profile</h1>
            <p>Username: ${user.username}</p>
            <p>Email: ${user.email}</p>
        </body>
        </html>
    `);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});