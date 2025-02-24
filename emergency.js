function cancelEmergency(emergencyId) {
    const cases = JSON.parse(localStorage.getItem('emergencyCases'));
    const emergencyCaseIndex = cases.findIndex(c => c.id === emergencyId);
    
    if (emergencyCaseIndex !== -1) {
        cases.splice(emergencyCaseIndex, 1); // Remove the emergency case
        localStorage.setItem('emergencyCases', JSON.stringify(cases));
        updateDashboardStats();
        alert(`Emergency ${emergencyId} has been canceled.`);
    } else {
        alert('Emergency case not found.');
    }
}

function closeResponseModal() {
    document.getElementById('responseModal').style.display = 'none';
}

document.getElementById('responseForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const emergencyId = document.getElementById('responseEmergencyId').value;
    const responderName = document.getElementById('responderName').value;
    const responseUnit = document.getElementById('responseUnit').value;
    const estimatedArrival = document.getElementById('estimatedArrival').value;
    const responseNotes = document.getElementById('responseNotes').value;

    const cases = JSON.parse(localStorage.getItem('emergencyCases'));
    const emergencyCase = cases.find(c => c.id == emergencyId);
    
    if (emergencyCase) {
        emergencyCase.responderName = responderName;
        emergencyCase.responseUnit = responseUnit;
        emergencyCase.estimatedArrival = estimatedArrival;
        emergencyCase.responseNotes = responseNotes;
        emergencyCase.status = 'responding';
        emergencyCase.responseTime = new Date().toISOString();
        
        localStorage.setItem('emergencyCases', JSON.stringify(cases));
        updateDashboardStats();
        alert(`Response submitted for Emergency ${emergencyId}.`);
        closeResponseModal();
    } else {
        alert('Emergency case not found.');
    }
});
function handleEmergencyResponse(emergencyId) {
    // Show response modal and set emergency ID
    const modal = document.getElementById('responseModal');
    document.getElementById('responseEmergencyId').value = emergencyId;
    document.getElementById('responseForm').reset();
    modal.style.display = 'block';
}

// This function can be used to resolve an emergency case
function resolveEmergency(emergencyId) {
    const cases = JSON.parse(localStorage.getItem('emergencyCases'));
    const emergencyCase = cases.find(c => c.id === emergencyId);
    
    if (emergencyCase) {
        emergencyCase.status = 'resolved';
        localStorage.setItem('emergencyCases', JSON.stringify(cases));
        updateDashboardStats();
        alert(`Emergency ${emergencyId} has been resolved.`);
    } else {
        alert('Emergency case not found.');
    }
}
