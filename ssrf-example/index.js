const express = require('express');
const http = require('http');

const app = express();

// Middleware to handle SSRF
function handleSSRF(req, res, next) {
    // Extract URL from request parameters or body
    const url = req.query.url || req.body.url;

    // Perform basic input validation
    if (!url) {
        return res.status(400).json({ error: 'URL parameter is missing' });
    }

    // Make the request to the provided URL
    http.get(url, (response) => {
        let data = '';

        // A chunk of data has been received
        response.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received
        response.on('end', () => {
            // Forward the response to the client
            res.status(200).send(data);
        });
    }).on('error', (err) => {
        // Handle errors
        res.status(500).json({ error: 'Error making request: ' + err.message });
    });
}

// Endpoint to demonstrate SSRF
app.get('/fetch-data', handleSSRF);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
