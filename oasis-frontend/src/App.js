import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [teamName, setTeamName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);

  const API_URL = 'http://localhost:3001/api/teams';

  // Fetch teams from the backend when the component mounts
  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoadingTeams(true);
      setMessage(''); // Clear any existing messages
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setTeams(data.teams || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setMessage('Network error. Could not fetch teams. Please check if the backend is running.');
      setTeams([]); // Reset teams on error
    } finally {
      setLoadingTeams(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!teamName.trim()) {
      setMessage('Please enter a team name');
      return;
    }

    setIsSubmitting(true);
    setMessage('Connecting to backend...');

    try {
      console.log('Sending request to:', API_URL);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamName: teamName.trim() }),
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        setMessage('Team registered successfully!');
        setTeamName(''); // Clear the form
        await fetchTeams(); // Refresh the teams list
        console.log('Success:', data);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        setMessage(errorData.message || `Failed to register team (${response.status})`);
        console.log('Error response:', errorData);
      }
    } catch (error) {
      console.error('Network error:', error);
      setMessage('Network error. Please check if the backend is running on http://localhost:3001');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Team Registration</h1>
        <form onSubmit={handleSubmit} className="team-form">
          <div className="form-group">
            <label htmlFor="teamName">Team Name:</label>
            <input
              type="text"
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter your team name"
              required
              disabled={isSubmitting}
            />
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
          {message && (
            <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
        </form>
        <div className="teams-list">
          <h2>Registered Teams ({teams.length})</h2>
          <button onClick={fetchTeams} disabled={loadingTeams}>
            {loadingTeams ? '🔄 Loading...' : '🔄 Refresh List'}
          </button>
          {loadingTeams ? (
            <div className="loading-state">
              <p>Loading teams...</p>
            </div>
          ) : teams.length === 0 ? (
            <div className="empty-state">
              <p>No teams registered yet. Be the first to register!</p>
            </div>
          ) : (
            <ul>
              {teams.map((team) => (
                <li key={team.id}>
                  <span className="team-name">{team.name}</span>
                  <span className="team-date">
                    Registered on {new Date(team.registeredAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;

