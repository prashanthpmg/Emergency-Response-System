function handleLogout() {
    localStorage.removeItem('isLoggedIn'); // Remove login status
    window.location.href = 'login.html'; // Redirect to login page
}

// Main application initialization and event handlers
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize the application
    initializeApp();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load any existing emergency cases
    loadEmergencyCases();
});

function initializeApp() {
    // Initialize local storage if needed
    if (!localStorage.getItem('emergencyCases')) {
        localStorage.setItem('emergencyCases', JSON.stringify([]));
    }
    
    // Update dashboard statistics
    updateDashboardStats();
}

function setupEventListeners() {
    // Emergency form submission
    const emergencyForm = document.getElementById('emergencyForm');
    emergencyForm.addEventListener('submit', handleEmergencySubmission);
    
    // Get current location button
    const locationBtn = document.getElementById('getLocation');
    locationBtn.addEventListener('click', getCurrentLocation);

    // Emergency type dropdown change
    const emergencyTypeSelect = document.getElementById('emergencyType');
    emergencyTypeSelect.addEventListener('change', handleEmergencyTypeChange);
}

// Handle emergency type selection
function handleEmergencyTypeChange(event) {
    const selectedType = event.target.value;
    if (selectedType) {
        const solution = getEmergencySolutions(selectedType);
        alert(`Emergency Protocol: ${solution}`);
    }
}

function validateContact(contact) {
    // Validate phone number format (accepts formats: XXX-XXX-XXXX or XXXXXXXXXX)
    const phoneRegex = /^\d{10}$|^\d{3}-\d{3}-\d{4}$/;
    return phoneRegex.test(contact);
}

function handleEmergencySubmission(event) {
    event.preventDefault();
    
    // Get form values
    const emergencyType = document.getElementById('emergencyType').value;
    const location = document.getElementById('location').value;
    const description = document.getElementById('description').value;
    const contact = document.getElementById('contact').value;

    // Validate contact number
    if (!validateContact(contact)) {
        alert('Please enter a valid contact number (XXX-XXX-XXXX or XXXXXXXXXX)');
        return;
    }

    // Show confirmation dialog
    const confirmSubmit = confirm(
        `Please confirm the emergency details:\n\n` +
        `Type: ${emergencyType}\n` +
        `Location: ${location}\n` +
        `Description: ${description}\n` +
        `Contact: ${contact}\n\n` +
        `Do you want to submit this emergency report?`
    );

    if (!confirmSubmit) {
        return;
    }
    
    // Create emergency case object
    const emergencyCase = {
        id: Date.now(),
        type: emergencyType,
        location: location,
        description: description,
        contact: contact,
        status: 'pending',
        priority: calculatePriority(emergencyType),
        timestamp: new Date().toISOString(),
        responseTime: null
    };
    
    // Save to local storage
    saveEmergencyCase(emergencyCase);
    
    // Update UI
    addEmergencyToList(emergencyCase);
    updateDashboardStats();
    
    // Reset form
    event.target.reset();
    
    // Show confirmation
    alert('Emergency reported successfully! Help is on the way.');
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const locationInput = document.getElementById('location');
                locationInput.value = `Lat: ${position.coords.latitude}, Long: ${position.coords.longitude}`;
            },
            (error) => {
                alert('Error getting location: ' + error.message);
            }
        );
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

function calculatePriority(emergencyType) {
    // Determine priority based on emergency type
    switch (emergencyType) {
        case 'medical':
        case 'fire':
            return 'high';
        case 'police':
            return 'medium';
        default:
            return 'low';
    }
}

function saveEmergencyCase(emergencyCase) {
    const cases = JSON.parse(localStorage.getItem('emergencyCases'));
    cases.push(emergencyCase);
    localStorage.setItem('emergencyCases', JSON.stringify(cases));
}

function loadEmergencyCases() {
    const cases = JSON.parse(localStorage.getItem('emergencyCases'));
    const emergencyList = document.getElementById('emergencyList');
    emergencyList.innerHTML = ''; // Clear existing list
    
    cases.forEach(emergencyCase => {
        addEmergencyToList(emergencyCase);
    });
    
    updateDashboardStats();
}

function getEmergencySolutions(emergencyType) {
    const solutions = {
        medical: "Call 911 and provide first aid.",
        fire: "Evacuate the area and call the fire department.",
        police: "Contact local law enforcement immediately.",
        disaster: "Follow emergency protocols and seek shelter."
    };
    return solutions[emergencyType] || "No specific solution available.";
}

function addEmergencyToList(emergencyCase) {
    const emergencyList = document.getElementById('emergencyList');
    
    const card = document.createElement('div');
    card.className = `emergency-card ${emergencyCase.priority}-priority`;
    
    // Add priority label
    const priorityLabel = emergencyCase.priority.charAt(0).toUpperCase() + emergencyCase.priority.slice(1);
    
    card.innerHTML = `
        <div class="priority-indicator ${emergencyCase.priority}">
            ${priorityLabel} Priority
        </div>
        <h3>${emergencyCase.type} Emergency</h3>
        <p><strong>Location:</strong> ${emergencyCase.location}</p>
        <p><strong>Description:</strong> ${emergencyCase.description}</p>
        <p><strong>Contact:</strong> ${emergencyCase.contact}</p>
        <p><strong>Status:</strong> <span class="status-${emergencyCase.status}">${emergencyCase.status}</span></p>
        <p><strong>Reported:</strong> ${new Date(emergencyCase.timestamp).toLocaleString()}</p>
        <div class="emergency-actions">
            ${emergencyCase.status === 'pending' ? `
                <button onclick="handleEmergencyResponse(${emergencyCase.id})" class="response-btn">
                    Respond to Emergency
                </button>
                <button onclick="cancelEmergency(${emergencyCase.id})" class="cancel-btn">
                    Cancel Emergency
                </button>
            ` : ''}
        </div>
    `;
    
    emergencyList.insertBefore(card, emergencyList.firstChild);
}

function updateDashboardStats() {
    const cases = JSON.parse(localStorage.getItem('emergencyCases'));
    
    // Count active cases
    const activeCases = cases.filter(c => c.status === 'pending').length;
    document.getElementById('activeCases').textContent = activeCases;
    
    // Count responding units (simplified for demo)
    const respondingUnits = Math.min(activeCases, 5); // Assume max 5 units
    document.getElementById('respondingUnits').textContent = respondingUnits;
    
    // Count resolved cases
    const resolvedCases = cases.filter(c => c.status === 'resolved').length;
    document.getElementById('resolvedCases').textContent = resolvedCases;
}
