//URL to test: http://localhost:3000/?username=<script>alert('XSS Attack!');</script>
//This url needs to be clicked by the victim to execute the script e.g. by sending it via email or chat

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send(`
        <html>
        <head>
            <title>XSS Example</title>
        </head>
        <body>
            <h1>Welcome, ${req.query.username}!</h1>
        </body>
        </html>
    `);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});