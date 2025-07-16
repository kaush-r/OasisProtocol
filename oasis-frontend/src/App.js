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
      const response = await fetch(API_URL);
      const data = await response.json();
      if (response.ok) {
        setTeams(data.teams);
      } else {
        setMessage(data.message || 'Failed to fetch teams');
      }
    } catch (error) {
      setMessage('Network error. Could not fetch teams.');
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
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamName: teamName.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('Team registered successfully!');
        setTeamName(''); // Clear the form
        fetchTeams(); // Refresh the teams list
        console.log('Success:', data);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to register team');
        console.log('Error response:', errorData);
      }
    } catch (error) {
      console.error('Network error:', error);
      setMessage('Network error. Please check if the backend is running.');
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
          <h2>Registered Teams</h2>
          <button onClick={fetchTeams} disabled={loadingTeams}>
            {loadingTeams ? 'Loading...' : 'Refresh List'}
          </button>
          {loadingTeams ? (
            <p>Loading teams...</p>
          ) : (
            <ul>
              {teams.map((team) => (
                <li key={team.id}>
                  {team.name} - <span>Registered on {new Date(team.registeredAt).toLocaleDateString()}</span>
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

