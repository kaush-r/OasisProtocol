const express = require('express');
const app = express();
const port = 3001;

// In-memory storage for teams
let registeredTeams = [];

// Middleware
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
});

// API routes
app.get('/api', (req, res) => {
  res.json({ message: 'Backend API is running!', timestamp: new Date().toISOString() });
});

app.get('/api/teams', (req, res) => {
  console.log('GET /api/teams called');
  res.json({
    message: 'All registered teams',
    teams: registeredTeams,
    count: registeredTeams.length
  });
});

app.post('/api/teams', (req, res) => {
  console.log('POST /api/teams called with:', req.body);
  
  try {
    const teamName = req.body.teamName;
    
    if (!teamName || typeof teamName !== 'string') {
      return res.status(400).json({ 
        message: 'Team name is required and must be a string',
        error: 'INVALID_INPUT'
      });
    }
    
    const trimmedName = teamName.trim();
    if (trimmedName.length === 0) {
      return res.status(400).json({ 
        message: 'Team name cannot be empty',
        error: 'EMPTY_NAME'
      });
    }
    
    if (trimmedName.length > 50) {
      return res.status(400).json({ 
        message: 'Team name must be 50 characters or less',
        error: 'NAME_TOO_LONG'
      });
    }
    
    // Check if team already exists
    const existingTeam = registeredTeams.find(team => 
      team.name.toLowerCase() === trimmedName.toLowerCase()
    );
    
    if (existingTeam) {
      return res.status(409).json({ 
        message: 'Team name already exists. Please choose a different name.',
        error: 'DUPLICATE_NAME'
      });
    }
    
    // Create new team entry
    const newTeam = {
      id: registeredTeams.length + 1,
      name: trimmedName,
      registeredAt: new Date().toISOString()
    };
    
    // Store the team
    registeredTeams.push(newTeam);
    
    console.log('New team registered:', trimmedName);
    console.log('Total teams:', registeredTeams.length);
    
    res.status(201).json({ 
      message: 'Team registered successfully!', 
      team: newTeam,
      totalTeams: registeredTeams.length
    });
    
  } catch (error) {
    console.error('Error processing team registration:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: 'SERVER_ERROR'
    });
  }
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    message: 'Something went wrong!',
    error: 'INTERNAL_ERROR'
  });
});

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
  console.log(`📋 API: http://localhost:${port}/api`);
  console.log(`📋 Teams API: http://localhost:${port}/api/teams`);
});
