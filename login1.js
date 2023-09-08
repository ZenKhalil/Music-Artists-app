let isLoggedIn = false; // This flag checks if an admin is currently logged in

// Constants for admin username and password (in a real application, you'd securely hash and salt the password)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "password123"; // Replace with a stronger password

// Function to show the login dialog
function showLoginDialog() {
    const loginHTML = `
        <div id="loginDialog">
            <span id="closeLogin" style="cursor:pointer; position:absolute; right: 10px; top: 5px;">&times;</span>
            <h2>Login</h2>
            <form id="loginForm">
                <label>
                    Username:
                    <input type="text" id="username" required>
                </label>
                <label>
                    Password:
                    <input type="password" id="password" required>
                </label>
                <button type="submit">Login</button>
            </form>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', loginHTML);
    console.log("Login dialog appended to the body"); // Add this log

    document.body.classList.add('dialog-open');  // <-- Add this line

    document.getElementById('loginForm').addEventListener('submit', handleLoginFormSubmission);
    document.getElementById('closeLogin').addEventListener('click', closeLoginDialog);
}

// Function to close the login dialog
function closeLoginDialog() {
    const dialog = document.getElementById('loginDialog');
    if (dialog) dialog.remove();

    document.body.classList.remove('dialog-open');  // <-- Add this line
}

// Function to handle the form submission
function handleLoginFormSubmission(event) {
    event.preventDefault();

    const enteredUsername = document.getElementById('username').value;
    const enteredPassword = document.getElementById('password').value;

    console.log("Sending:", { username: enteredUsername, password: enteredPassword });  // Add this line

    // We'll validate the login on the server side for security reasons.
    fetch("http://localhost:3000/admin-login", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: enteredUsername,
            password: enteredPassword
        })
    })
    .then(response => response.json())
    .then(data => {
       if (data.success) {
    isLoggedIn = true;
    alert('Successfully logged in.');
    closeLoginDialog();
    showArtists();
    updateLoginButton();
} else {
    alert('Login failed. Check your credentials.');
}
    })
    .catch(error => {
        console.error('Error during login:', error);
        alert('Login failed due to an error. Please try again.');
    });
}

// Finally, bind the showLoginDialog function to your login button
document.addEventListener("DOMContentLoaded", function() {
    const loginButton = document.getElementById('loginButton');
    
    loginButton.addEventListener('click', function() {
        if (isLoggedIn) {
            handleLogout();
        } else {
            showLoginDialog();
        }
    });

    // Set the initial state
    updateLoginButton();
});

function updateLoginButton() {
    const loginButton = document.getElementById('loginButton');
    if (isLoggedIn) {
        loginButton.textContent = "Logout";
    } else {
        loginButton.textContent = "Login";
    }
}

function handleLogout() {
    isLoggedIn = false;
    alert('Successfully logged out.');
    updateLoginButton();
    showArtists(); // Refresh the artists' view to reflect the logged-out state
}
