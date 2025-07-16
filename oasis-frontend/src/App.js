import logo from './logo.svg';
import './App.css';

// Create floating particles
    function createParticles() {
      const particleContainer = document.querySelector('.floating-particles');
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        particleContainer.appendChild(particle);
      }
    }

    // Password strength checker
    function checkPasswordStrength(password) {
      let strength = 0;
      if (password.length >= 8) strength += 25;
      if (password.match(/[a-z]/)) strength += 25;
      if (password.match(/[A-Z]/)) strength += 25;
      if (password.match(/[0-9]/)) strength += 25;
      if (password.match(/[^a-zA-Z0-9]/)) strength += 25;
      return Math.min(strength, 100);
    }

    // Toggle password visibility
    function togglePassword(fieldId) {
      const field = document.getElementById(fieldId);
      const toggle = field.nextElementSibling;
      
      if (field.type === 'password') {
        field.type = 'text';
        toggle.textContent = '🙈';
      } else {
        field.type = 'password';
        toggle.textContent = '👁️';
      }
    }

    // Show messages
    function showMessage(type, message) {
      const successMsg = document.getElementById('successMessage');
      const errorMsg = document.getElementById('errorMessage');
      
      successMsg.style.display = 'none';
      errorMsg.style.display = 'none';
      
      if (type === 'success') {
        successMsg.textContent = message;
        successMsg.style.display = 'block';
      } else {
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
      }

      setTimeout(() => {
        successMsg.style.display = 'none';
        errorMsg.style.display = 'none';
      }, 5000);
    }

    // Placeholder functions for links
    function showTerms() {
      alert('Terms of Service would open here');
    }

    function showPrivacy() {
      alert('Privacy Policy would open here');
    }

    function goToLogin() {
      alert('Redirect to login page');
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
      createParticles();

      // Password strength indicator
      const passwordField = document.getElementById('password');
      const strengthFill = document.getElementById('strengthFill');

      passwordField.addEventListener('input', function() {
        const strength = checkPasswordStrength(this.value);
        strengthFill.style.width = strength + '%';
      });

      // Form submission
      document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const teamName = document.getElementById('teamName').value.trim();
        const email = document.getElementById('email').value.trim();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const termsAccepted = document.getElementById('terms').checked;

        // Validation
        if (!teamName || !email || !username || !password || !confirmPassword) {
          showMessage('error', 'Please fill in all required fields.');
          return;
        }

        if (password !== confirmPassword) {
          showMessage('error', 'Passwords do not match.');
          return;
        }

        if (password.length < 8) {
          showMessage('error', 'Password must be at least 8 characters long.');
          return;
        }

        if (!termsAccepted) {
          showMessage('error', 'Please accept the terms and conditions.');
          return;
        }

        // Simulate registration
        showMessage('success', 'Registration successful! Welcome to OASIS.');
        
        // Reset form after success
        setTimeout(() => {
          this.reset();
          strengthFill.style.width = '0%';
        }, 2000);
      });
    });

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
