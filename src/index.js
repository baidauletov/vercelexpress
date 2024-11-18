const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
// const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { testRoutes } = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// mongoose.connect('mongodb://localhost:27017/yourdb', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// Middlewares
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS for mobile testing
app.use(morgan('dev')); // Logging
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Basic info route
app.get('/', (req, res) => {
  res.json({
    message: 'Mobile API Tester is running',
    timestamp: new Date().toISOString()
  });
});

// Test routes
app.use('/api/test', testRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;