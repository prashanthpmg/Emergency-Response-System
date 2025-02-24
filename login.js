// Login functionality
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', handleLogin);
});

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simple validation (replace with actual authentication logic)
    if (username === 'admin' && password === 'password') {
        localStorage.setItem('isLoggedIn', 'true'); // Set login status
        window.location.href = 'index.html'; // Redirect to the main page
    } else {
        document.getElementById('errorMessage').textContent = 'Invalid username or password.';
    }
}
