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

// Test route
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// API routes
app.get('/api', (req, res) => {
  res.send('Hello from the backend!');
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint working', teams: registeredTeams.length });
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
  
  console.log('New team registered:', teamName);
  console.log('Total teams:', registeredTeams.length);
  
  res.json({ 
    message: 'Team registered successfully!', 
    team: newTeam,
    totalTeams: registeredTeams.length
  });
});

app.get('/teams', (req, res) => {
  console.log('GET /teams called');
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
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; text-align: center; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        tr:hover { background-color: #f0f0f0; }
        .refresh-btn { background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin: 10px 0; display: inline-block; }
        .refresh-btn:hover { background-color: #45a049; }
        .no-teams { text-align: center; color: #666; font-style: italic; }
        .status { text-align: center; margin: 20px 0; padding: 10px; background: #e7f3ff; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🏆 Registered Teams (${registeredTeams.length})</h1>
        <div class="status">
          <strong>Server Status:</strong> ✅ Online | 
          <strong>Total Teams:</strong> ${registeredTeams.length} | 
          <strong>Last Updated:</strong> ${new Date().toLocaleString()}
        </div>
        <a href="/teams" class="refresh-btn">🔄 Refresh Data</a>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Team Name</th>
              <th>Registered At</th>
            </tr>
          </thead>
          <tbody>
            ${teamsHTML || '<tr><td colspan="3" class="no-teams">No teams registered yet. <a href="http://localhost:3002">Register your team here!</a></td></tr>'}
          </tbody>
        </table>
        <div style="margin-top: 30px; text-align: center;">
          <p><strong>🔗 Links:</strong></p>
          <p><a href="/api/teams">📋 JSON API</a> | <a href="http://localhost:3002">📝 Register New Team</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  res.send(html);
});

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
  console.log(`📊 View teams: http://localhost:${port}/teams`);
  console.log(`📋 JSON API: http://localhost:${port}/api/teams`);
  console.log(`📝 Register form: http://localhost:3002`);
});
