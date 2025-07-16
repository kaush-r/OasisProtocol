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

// Routes
app.get('/api', (req, res) => {
  res.send('Hello from the backend!');
});

// Debug route
app.get('/debug', (req, res) => {
  res.json({
    message: 'Debug endpoint working',
    registeredTeams: registeredTeams,
    teamCount: registeredTeams.length,
    timestamp: new Date().toISOString()
  });
});

app.get('/teams', (req, res) => {
  const teamsHTML = registeredTeams.map(team => 
    `<tr>
      <td>${team.id}</td>
      <td>${team.name}</td>
      <td>${new Date(team.registeredAt).toLocaleString()}</td>
    </tr>`
  ).join('');
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Registered Teams</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #f2f2f2; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .refresh-btn { background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-bottom: 20px; display: inline-block; }
        .no-teams { text-align: center; color: #666; font-style: italic; }
      </style>
    </head>
    <body>
      <h1>Registered Teams (${registeredTeams.length})</h1>
      <a href="/teams" class="refresh-btn">🔄 Refresh</a>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Team Name</th>
            <th>Registered At</th>
          </tr>
        </thead>
        <tbody>
          ${teamsHTML || '<tr><td colspan="3" class="no-teams">No teams registered yet</td></tr>'}
        </tbody>
      </table>
      <br>
      <p><strong>API Endpoint:</strong> <a href="/api/teams">/api/teams</a> (JSON format)</p>
      <p><strong>Register Form:</strong> <a href="http://localhost:3002">http://localhost:3002</a></p>
    </body>
    </html>
  `;
  
  res.send(html);
});

app.get('/api/teams', (req, res) => {
  res.json({
    message: 'All registered teams',
    teams: registeredTeams,
    count: registeredTeams.length
  });
});

app.post('/api/teams', (req, res) => {
  console.log('Received request body:', req.body);
  const teamName = req.body.teamName;
  
  if (!teamName) {
    return res.status(400).json({ message: 'Team name is required' });
  }
  
  // Check if team already exists
  const existingTeam = registeredTeams.find(team => 
    team.name.toLowerCase() === teamName.toLowerCase()
  );
  
  if (existingTeam) {
    return res.status(400).json({ message: 'Team name already exists' });
  }
  
  // Create new team entry
  const newTeam = {
    id: registeredTeams.length + 1,
    name: teamName.trim(),
    registeredAt: new Date().toISOString()
  };
  
  // Store the team
  registeredTeams.push(newTeam);
  
  console.log('New team signed up:', teamName);
  console.log('Total teams registered:', registeredTeams.length);
  
  res.json({ 
    message: 'Team registered successfully!', 
    team: newTeam,
    totalTeams: registeredTeams.length
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`📊 View teams: http://localhost:${port}/teams`);
  console.log(`📋 JSON API: http://localhost:${port}/api/teams`);
});