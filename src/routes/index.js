const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { requestLogger } = require('../middleware/requestLogger');

// Function to write to log file
const writeToLog = (data) => {
    const timestamp = new Date().toISOString();
    const logFile = path.join(logsDir, `requests-${new Date().toISOString().split('T')[0]}.log`);
    const logEntry = `[${timestamp}] ${JSON.stringify(data)}\n`;

    fs.appendFile(logFile, logEntry, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
};

// Echo endpoint - returns whatever is sent
router.all('/echo', requestLogger, (req, res) => {
  res.json({
    method: req.method,
    headers: req.headers,
    query: req.query,
    body: req.body,
    timestamp: new Date().toISOString(),
    path: req.path
  });
});

// Simulate different HTTP status codes
router.get('/status/:code', (req, res) => {
  const code = parseInt(req.params.code);
  res.status(code).json({
    status: code,
    message: `Responded with status code ${code}`
  });
});

// Simulate delayed response
router.get('/delay/:ms', (req, res) => {
  const delay = parseInt(req.params.ms);
  setTimeout(() => {
    res.json({
      message: `Response delayed by ${delay}ms`,
      timestamp: new Date().toISOString()
    });
  }, delay);
});

// Test different content types
router.get('/content-types/json', (req, res) => {
  res.json({ message: 'This is a JSON response' });
});

router.get('/content-types/text', (req, res) => {
  res.send('This is a plain text response');
});

router.post('/check', (req, res) => {
    try {
        const data = req.body;
        
        // Validate required fields if it is not included
        if (!data) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Here you would typically save to database
        const responseData = {
            success: true,
            data: data,
            message: 'All Nessarry data included',
            timestamp: new Date().toISOString()
        };

        // Create logs directory if it doesn't exist
        const logsDir = path.join(__dirname, 'logs');
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir);
        }

        writeToLog({
            // type: 'POST_REQUEST',
            data: req.body,
            // mongoId: savedData._id,
            // timestamp: new Date().toISOString()
        });
        
        res.status(201).json(responseData);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}) 

router.get('/content-types/html', (req, res) => {
  res.send('<h1>This is an HTML response</h1>');
});

// Headers test
router.get('/headers', (req, res) => {
  res.set('X-Custom-Header', 'Custom Value');
  res.set('X-Response-Time', new Date().toISOString());
  res.json({
    receivedHeaders: req.headers,
    message: 'Check response headers for custom values'
  });
});

// Cookie test
router.get('/cookies/set', (req, res) => {
  res.cookie('testCookie', 'cookie-value', {
    maxAge: 900000,
    httpOnly: true
  });
  res.json({ message: 'Cookie has been set' });
});

router.get('/cookies/read', (req, res) => {
  res.json({
    cookies: req.cookies,
    message: 'These are the cookies received'
  });
});

module.exports = { testRoutes: router };