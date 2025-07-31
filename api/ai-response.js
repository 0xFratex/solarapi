// api/ai-response.js
const express = require('express');
const app = express();

// Middleware to parse JSON bodies and handle CORS
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'PUT, OPTIONS');
    // Handle preflight request for CORS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// The API endpoint logic remains the same
app.put('/api/ai-response', (req, res) => {
    console.log('Received data on /api/ai-response endpoint:');
    const { originalPrompt, aiResponse } = req.body;

    if (!originalPrompt || !aiResponse) {
        return res.status(400).json({ error: 'Missing required fields in request body' });
    }

    console.log('Original Prompt:', originalPrompt);
    console.log('AI Response:', aiResponse);

    res.status(200).json({
        status: 'success',
        message: 'Data received by Vercel serverless function.',
        receivedData: req.body
    });
});

// IMPORTANT: Export the app for Vercel to use
module.exports = app;
