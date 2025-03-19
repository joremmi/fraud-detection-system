// Add CORS middleware
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Make sure this is before your route definitions 