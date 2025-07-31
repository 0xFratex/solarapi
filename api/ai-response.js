// api/ai-response.js
const express = require('express');
const crypto = require('crypto'); // We need this to generate a unique ID
const app = express();

// Middleware to parse JSON bodies and handle CORS
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// Use POST as it's the standard for chat completions
app.post('/api/ai-response', (req, res) => {
    // We expect the client to send the response it got from Puter
    const { aiResponse, modelUsed } = req.body;

    if (!aiResponse) {
        return res.status(400).json({ error: 'The aiResponse field is required.' });
    }

    // --- CONSTRUCT THE OPENAI-COMPATIBLE RESPONSE ---

    const openAIFormattedResponse = {
        // Generate a unique ID for the chat completion
        id: `chatcmpl-${crypto.randomBytes(16).toString('hex')}`,
        object: "chat.completion",
        // Get the current time in Unix timestamp format
        created: Math.floor(Date.now() / 1000),
        // Use the model that the client told us it used
        model: modelUsed || "gpt-4.1-nano",
        choices: [
            {
                index: 0,
                message: {
                    role: "assistant",
                    // This is the actual text from Puter.js
                    content: aiResponse,
                },
                finish_reason: "stop"
            }
        ],
        // Puter.js does not provide token usage, so we will use placeholder values.
        usage: {
            prompt_tokens: 0,
            completion_tokens: 0,
            total_tokens: 0
        }
    };
    
    // --- END OF CONSTRUCTION ---

    // Send the formatted JSON back to the client
    res.status(200).json(openAIFormattedResponse);
});

// Export the app for Vercel
module.exports = app;
