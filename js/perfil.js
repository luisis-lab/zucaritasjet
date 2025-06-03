// Define golden tickets and points system
const GOLDEN_TICKET = '123A';
const POINTS_PER_NORMAL_TICKET = 100;
const POINTS_FOR_DISNEY = 1000;
const POINTS_FOR_SANANDRES = 500;
const POINTS_FOR_MARKET = 200;

let userCodes = [];
let totalPoints = 0;

document.addEventListener('DOMContentLoaded', function() {
    // Load user data from localStorage
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
        window.location.href = 'index.html';
        return;
    }

    // Update profile information
    document.getElementById('userWelcome').textContent = `¡Hola, ${userData.fullName.split(' ')[0]}!`;
    document.getElementById('profileName').textContent = userData.fullName;
    document.getElementById('profileDepartment').textContent = userData.department;

    // Create family members avatars
    const familyMembers = document.getElementById('familyMembers');
    if (userData.childrenAges && userData.childrenAges.length > 0) {
        userData.childrenAges.forEach((age, index) => {
            const memberDiv = document.createElement('div');
            memberDiv.className = 'family-member';
            memberDiv.innerHTML = `
                <div class="avatar-small">👶</div>
                <small>${age} años</small>
            `;
            familyMembers.appendChild(memberDiv);
        });
    } else {
        familyMembers.innerHTML = '<p class="text-muted">No hay miembros familiares registrados</p>';
    }

    // Handle code submission
    const codeForm = document.getElementById('codeForm');
    codeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const codeInput = document.getElementById('codeInput');
        const code = codeInput.value.trim().toUpperCase();

        if (code) {
            if (userCodes.some(c => c.code === code)) {
                showToast('¡Este código ya ha sido registrado!');
                return;
            }

            const isGolden = code === GOLDEN_TICKET;
            const newCode = {
                code: code,
                date: new Date().toLocaleDateString(),
                type: isGolden ? 'Ficha Dorada' : 'Ficha Normal',
                points: isGolden ? POINTS_FOR_DISNEY : POINTS_PER_NORMAL_TICKET
            };
            
            userCodes.push(newCode);
            updateTotalPoints();
            saveUserData();
            updateUI();
            codeInput.value = '';

            if (isGolden) {
                showGoldenTicketAnimation();
            } else {
                showToast('¡Código registrado correctamente!');
            }
        }
    });

    // Load existing data and update UI
    loadUserData();
    updateUI();
});

function updateTotalPoints() {
    totalPoints = userCodes.reduce((sum, code) => sum + code.points, 0);
}

function updateProgressBar() {
    const maxPoints = POINTS_FOR_DISNEY;
    const progress = Math.min((totalPoints / maxPoints) * 100, 100);
    
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute('aria-valuenow', progress);

    // Obtener los marcadores
    const markers = document.querySelector('.progress-markers .d-flex');
    
    // Al inicio, la barra está vacía sin marcadores
    if (!userCodes.length) {
        markers.innerHTML = '';
        return;
    }

    // Si encuentra el código dorado, mostrar solo Disney
    if (userCodes.some(code => code.code === GOLDEN_TICKET)) {
        markers.innerHTML = `
            <div class="marker active">
                <i class="fas fa-castle"></i>
                <span>Disney</span>
            </div>
        `;
        progressBar.style.width = '100%';
        progressBar.setAttribute('aria-valuenow', 100);
    } else {
        // Si no tiene el código dorado, solo mostrar Mercado y San Andrés
        markers.innerHTML = `
            <div class="marker ${totalPoints >= POINTS_FOR_MARKET ? 'active' : ''}">
                <i class="fas fa-shopping-cart"></i>
                <span>Mercado</span>
            </div>
            <div class="marker ${totalPoints >= POINTS_FOR_SANANDRES ? 'active' : ''}">
                <i class="fas fa-umbrella-beach"></i>
                <span>San Andrés</span>
            </div>
        `;
    }
}

function updateCodesTable() {
    const tbody = document.getElementById('codesTable');
    tbody.innerHTML = userCodes.map(code => `
        <tr>
            <td><i class="fas fa-ticket-alt me-2"></i>${code.code}</td>
            <td><i class="fas fa-calendar me-2"></i>${code.date}</td>
            <td>
                <span class="badge ${code.type === 'Ficha Dorada' ? 'bg-warning text-dark' : 'bg-info'}">
                    ${code.type}
                </span>
            </td>
        </tr>
    `).join('');
}

function showGoldenTicketAnimation() {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    const popup = document.createElement('div');
    popup.className = 'golden-ticket-popup';
    popup.innerHTML = `
        <h2>🎉 ¡FELICITACIONES! 🎉</h2>
        <h3>¡Encontraste la Ficha Dorada!</h3>
        <p>¡Has ganado un viaje a Disney para toda tu familia!</p>
        <div class="confetti-container"></div>
        <button class="btn btn-light btn-lg mt-4" onclick="hideGoldenTicketAnimation()">
            ¡Genial! 🎊
        </button>
    `;
    document.body.appendChild(popup);

    // Mostrar animación
    setTimeout(() => {
        overlay.classList.add('show');
        popup.classList.add('show');
        createConfetti();
    }, 100);
}

function hideGoldenTicketAnimation() {
    const popup = document.querySelector('.golden-ticket-popup');
    const overlay = document.querySelector('.overlay');
    
    if (popup && overlay) {
        popup.classList.remove('show');
        overlay.classList.remove('show');
        setTimeout(() => {
            popup.remove();
            overlay.remove();
        }, 500);
    }
}

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-container';
    document.body.appendChild(confetti);

    // Crear más partículas de confeti
    for (let i = 0; i < 150; i++) {
        createConfettiPiece(confetti);
    }

    setTimeout(() => confetti.remove(), 5000);
}

function createConfettiPiece(container) {
    const colors = ['#FFD700', '#FFA500', '#FF6B00', '#FF8533', '#FFFFFF', '#FFC107'];
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    
    // Colores aleatorios
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Posición inicial aleatoria
    piece.style.left = `${Math.random() * 100}%`;
    
    // Tamaño aleatorio
    const size = Math.random() * 10 + 6;
    piece.style.width = `${size}px`;
    piece.style.height = `${size * 2}px`;
    
    // Retraso aleatorio en la animación
    piece.style.animationDelay = `${Math.random() * 2}s`;
    
    // Velocidad aleatoria
    piece.style.animationDuration = `${Math.random() * 2 + 2}s`;
    
    container.appendChild(piece);
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function saveUserData() {
    localStorage.setItem('userCodes', JSON.stringify(userCodes));
    localStorage.setItem('totalPoints', totalPoints);
}

function loadUserData() {
    const savedCodes = localStorage.getItem('userCodes');
    if (savedCodes) {
        userCodes = JSON.parse(savedCodes);
        updateTotalPoints();
    }
}

function updateUI() {
    document.getElementById('codesCount').textContent = userCodes.length;
    updateProgressBar();
    updateCodesTable();
}

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}

// Agregar animación para el confeti
const style = document.createElement('style');
style.textContent = `
@keyframes fall {
    to {
        transform: translateY(100vh) rotate(360deg);
    }
}`;
document.head.appendChild(style);
