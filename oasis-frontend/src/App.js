import './App.css';
import { useState } from 'react';

function App() {
  const [teamName, setTeamName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!teamName.trim()) {
      setMessage('Please enter a team name');
      return;
    }

    setIsSubmitting(true);
    setMessage('Connecting to backend...');

    try {
      console.log('Sending request to: http://localhost:3001/api/teams');
      const response = await fetch('http://localhost:3001/api/teams', {
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
      </header>
    </div>
  );
}

export default App;
