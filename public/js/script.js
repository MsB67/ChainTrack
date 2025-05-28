// empty array to store our supply chain blocks
let supplyChain = [];

// DOM elements
const stageInput = document.getElementById('stage');
const locationInput = document.getElementById('location');
const handlerInput = document.getElementById('handler');
const chainContainer = document.getElementById('chain');
const blockCountElement = document.getElementById('block-count');

// Add stage to the blockchain
function addStage() {
    // Get input values
    const stage = stageInput.value.trim();
    const location = locationInput.value.trim();
    const handler = handlerInput.value.trim();
    
    // Validate inputs
    if (!stage || !location || !handler) {
        showAlert('Please fill in all fields', 'error');
        return;
    }
    
    // Create a new block object
    const newBlock = {
        index: supplyChain.length,
        timestamp: new Date().toISOString(),
        stage: stage,
        location: location,
        handler: handler,
        previousHash: supplyChain.length > 0 ? 
            calculateHash(supplyChain[supplyChain.length - 1]) : '0'.repeat(64)
    };
    
    // Add the block to the chain
    supplyChain.push(newBlock);
    
    // Clear the input fields
    clearInputs();
    
    // Update the display
    displayChain();
    
    // Show success message
    showAlert('Block added to the chain successfully!', 'success');
}

// Calculate hash for a block 
function calculateHash(block) {
   
    const blockString = JSON.stringify(block);
    let hash = 0;
    
    for (let i = 0; i < blockString.length; i++) {
        const char = blockString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    
   // Return a "fake" 64-character hash for demonstration
    return hash.toString(16).padStart(64, '0');
}

// Display the entire blockchain
function displayChain() {
 
    blockCountElement.textContent = supplyChain.length;
    
    chainContainer.innerHTML = '';
    
    if (supplyChain.length === 0) {
        chainContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <p>No stages added yet. Add the first block to start the chain!</p>
            </div>
        `;
        return;
    }
    
    //newest first order
    for (let i = supplyChain.length - 1; i >= 0; i--) {
        const block = supplyChain[i];
        
        const blockElement = document.createElement('div');
        blockElement.className = 'block';
        
        blockElement.innerHTML = `
            <div class="block-header">
                <div class="block-title">
                    <i class="fas fa-cube"></i>
                    ${block.stage}
                </div>
                <span class="block-index">Block #${block.index}</span>
            </div>
            <div class="block-details">
                <div class="detail-item">
                    <label><i class="fas fa-map-marker-alt"></i> Location</label>
                    <p>${block.location}</p>
                </div>
                <div class="detail-item">
                    <label><i class="fas fa-user-tie"></i> Handler</label>
                    <p>${block.handler}</p>
                </div>
                <div class="detail-item">
                    <label><i class="fas fa-clock"></i> Timestamp</label>
                    <p>${formatDate(block.timestamp)}</p>
                </div>
                <div class="detail-item">
                    <label><i class="fas fa-link"></i> Previous Hash</label>
                    <p class="hash">${block.previousHash}</p>
                </div>
                <div class="detail-item">
                    <label><i class="fas fa-fingerprint"></i> Current Hash</label>
                    <p class="hash">${calculateHash(block)}</p>
                </div>
            </div>
        `;
        
        chainContainer.appendChild(blockElement);
    }
}

//Date format
function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}


function clearInputs() {
    stageInput.value = '';
    locationInput.value = '';
    handlerInput.value = '';
    stageInput.focus();
}

// Show alert 
function showAlert(message, type) {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(alert);
    
    alert.style.top = '20px';
    alert.style.right = '20px';
    

    setTimeout(() => {
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

const alertStyles = document.createElement('style');
alertStyles.innerHTML = `
    .alert {
        position: fixed;
        top: -100px;
        right: 20px;
        padding: 15px 20px;
        border-radius: var(--border-radius);
        color: white;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: var(--box-shadow);
        z-index: 1000;
        transition: all 0.3s ease;
        opacity: 1;
    }
    .alert-success {
        background-color: var(--success-color);
    }
    .alert-error {
        background-color: var(--danger-color);
    }
`;
document.head.appendChild(alertStyles);


document.addEventListener('DOMContentLoaded', () => {
    displayChain();
    

    stageInput.focus();
    
    //enter to submit
    [stageInput, locationInput, handlerInput].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addStage();
            }
        });
    });
});