// Variables globales
let currentUser = null;
let messages = [];

// Cargar datos al iniciar
function loadChat() {
    const saved = localStorage.getItem('chatMessages');
    if (saved) {
        messages = JSON.parse(saved);
    }
}

// Guardar chat en localStorage
function saveChat() {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
}

// Iniciar chat
function startChat() {
    const userName = document.getElementById('userName').value.trim();
    
    if (!userName) {
        alert('Por favor ingresa un nombre de usuario');
        return;
    }
    
    if (userName.length < 2) {
        alert('El nombre debe tener al menos 2 caracteres');
        return;
    }

    currentUser = userName;
    
    // Mostrar/ocultar elementos
    document.getElementById('userSetup').style.display = 'none';
    document.getElementById('chatMain').style.display = 'flex';
    document.getElementById('userDisplay').textContent = `👤 ${currentUser}`;
    
    // Cargar mensajes
    loadChat();
    displayMessages();
    
    // Enfocar input
    document.getElementById('messageInput').focus();
}

// Enviar mensaje
function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    
    if (!text) {
        return;
    }

    const message = {
        id: Date.now(),
        user: currentUser,
        text: text,
        timestamp: new Date().toLocaleString('es-ES'),
        date: new Date().toISOString()
    };

    messages.push(message);
    saveChat();
    
    input.value = '';
    displayMessages();
    
    // Scroll al último mensaje
    setTimeout(() => {
        const messagesDiv = document.getElementById('messages');
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }, 100);
}

// Mostrar mensajes
function displayMessages() {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = '';

    if (messages.length === 0) {
        messagesDiv.innerHTML = '<div style="text-align: center; color: #999; margin: auto;">No hay mensajes aún. ¡Sé el primero en escribir!</div>';
        return;
    }

    messages.forEach(msg => {
        const isOwn = msg.user === currentUser;
        const messageEl = document.createElement('div');
        messageEl.className = `message ${isOwn ? 'own' : 'other'}`;
        
        messageEl.innerHTML = `
            <div class="message-content">
                <div class="message-user">${msg.user}</div>
                <div>${escapeHtml(msg.text)}</div>
                <div class="message-info">${msg.timestamp}</div>
            </div>
        `;
        
        messagesDiv.appendChild(messageEl);
    });

    // Scroll al final
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Escapar HTML para seguridad
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Descargar JSON
function downloadJSON() {
    const dataStr = JSON.stringify(messages, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-${new Date().getTime()}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

// Logout
function logout() {
    if (confirm('¿Estás seguro de que quieres salir?')) {
        currentUser = null;
        document.getElementById('chatMain').style.display = 'none';
        document.getElementById('userSetup').style.display = 'flex';
        document.getElementById('userName').value = '';
        document.getElementById('messageInput').value = '';
    }
}

// Cargar chat al iniciar la página
window.addEventListener('load', () => {
    loadChat();
});