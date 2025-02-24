// Dashboard management functions

// Update dashboard in real-time (called every 30 seconds)
setInterval(updateDashboardInRealTime, 30000);

function updateDashboardInRealTime() {
    const cases = JSON.parse(localStorage.getItem('emergencyCases'));
    
    // Update statistics
    updateEmergencyStatistics(cases);
    
    // Update emergency list with latest status
    updateEmergencyList(cases);
}

function updateEmergencyStatistics(cases) {
    // Calculate statistics
    const totalCases = cases.length;
    const activeCases = cases.filter(c => c.status === 'pending').length;
    const respondingCases = cases.filter(c => c.status === 'responding').length;
    const resolvedCases = cases.filter(c => c.status === 'resolved').length;
    
    // Update dashboard elements
    document.getElementById('activeCases').textContent = activeCases;
    document.getElementById('respondingUnits').textContent = respondingCases;
    document.getElementById('resolvedCases').textContent = resolvedCases;
    
    // Update priority statistics
    const highPriority = cases.filter(c => c.priority === 'high' && c.status !== 'resolved').length;
    const mediumPriority = cases.filter(c => c.priority === 'medium' && c.status !== 'resolved').length;
    const lowPriority = cases.filter(c => c.priority === 'low' && c.status !== 'resolved').length;
    
    // Could be used to display priority-based statistics in future dashboard updates
    console.log(`High Priority: ${highPriority}, Medium Priority: ${mediumPriority}, Low Priority: ${lowPriority}`);
}

function updateEmergencyList(cases) {
    const emergencyList = document.getElementById('emergencyList');
    
    // Sort cases by priority and timestamp
    const sortedCases = cases.sort((a, b) => {
        // First sort by status (pending first)
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        
        // Then sort by priority
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        
        // Finally sort by timestamp (newest first)
        return new Date(b.timestamp) - new Date(a.timestamp);
    });
    
    // Clear and rebuild the emergency list
    emergencyList.innerHTML = '';
    sortedCases.forEach(emergencyCase => {
        const card = createEmergencyCard(emergencyCase);
        emergencyList.appendChild(card);
    });
}

// Add filter state
let currentFilter = 'all';

// Add filter function
function filterEmergencies(type = 'all') {
    currentFilter = type;
    updateDashboardInRealTime();
}

function createEmergencyCard(emergencyCase) {
    const card = document.createElement('div');
    card.className = `emergency-card ${emergencyCase.priority}-priority`;
    
    // Calculate time elapsed
    const timeElapsed = getTimeElapsed(emergencyCase.timestamp);
    
    // Add priority indicator
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
        <p><strong>Reported:</strong> ${timeElapsed} ago</p>
        ${emergencyCase.status === 'responding' ? `
        <div class="response-details">
            <h4>Response Information</h4>
            <div class="response-info">
                <p><strong>Responder:</strong> ${emergencyCase.responderName}</p>
                <p><strong>Unit:</strong> ${emergencyCase.responseUnit}</p>
                <p><strong>ETA:</strong> ${emergencyCase.estimatedArrival} minutes</p>
                <p><strong>Response Time:</strong> ${new Date(emergencyCase.responseTime).toLocaleString()}</p>
            </div>
            <div class="response-notes">
                <strong>Notes:</strong> ${emergencyCase.responseNotes}
            </div>
        </div>
        ` : ''}
        <div class="emergency-actions">
            ${emergencyCase.status === 'pending' ? createResponseButton(emergencyCase.id) : ''}
            ${emergencyCase.status === 'pending' ? createCancelButton(emergencyCase.id) : ''}
            ${emergencyCase.status === 'responding' ? `
                <button onclick="resolveEmergency(${emergencyCase.id})" class="resolve-btn">
                    Mark as Resolved
                </button>
            ` : ''}
        </div>
    `;
    
    return card;
}

function getTimeElapsed(timestamp) {
    const now = new Date();
    const then = new Date(timestamp);
    const diff = Math.floor((now - then) / 1000); // difference in seconds
    
    if (diff < 60) return `${diff} seconds`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours`;
    return `${Math.floor(diff / 86400)} days`;
}

function createResponseButton(emergencyId) {
    return `
        <button onclick="handleEmergencyResponse(${emergencyId})" class="response-btn">
            Respond to Emergency
        </button>
    `;
}

function createCancelButton(emergencyId) {
    return `
        <button onclick="cancelEmergency(${emergencyId})" class="cancel-btn">
            Cancel Emergency
        </button>
    `;
}

// Update the updateEmergencyList function to include filtering
function updateEmergencyList(cases) {
    const emergencyList = document.getElementById('emergencyList');
    
    // Filter cases based on current filter
    const filteredCases = currentFilter === 'all' 
        ? cases 
        : cases.filter(c => c.type === currentFilter);
    
    // Sort cases by priority and timestamp
    const sortedCases = filteredCases.sort((a, b) => {
        // First sort by status (pending first)
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        
        // Then sort by priority
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        
        // Finally sort by timestamp (newest first)
        return new Date(b.timestamp) - new Date(a.timestamp);
    });
    
    // Clear and rebuild the emergency list
    emergencyList.innerHTML = '';
    sortedCases.forEach(emergencyCase => {
        const card = createEmergencyCard(emergencyCase);
        emergencyList.appendChild(card);
    });
}
