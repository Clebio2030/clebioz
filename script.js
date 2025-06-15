let visitCount = 0;
let buttonClickCount = 0;
let audioContext;
let pageLoaded = false;

// Inicializar contexto de áudio
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Função para carregar contador de visitas
function loadVisitCount() {
    try {
        const saved = localStorage.getItem('sistema-curioso-visits');
        visitCount = saved ? parseInt(saved) : 0;
        console.log('Contador carregado:', visitCount);
    } catch (error) {
        visitCount = 0;
        console.log('Erro ao carregar contador:', error);
    }
}

// Função para incrementar contador de visitas
function incrementVisitCount() {
    visitCount++;
    console.log('Incrementando visitas para:', visitCount);
    document.getElementById('counter').textContent = visitCount;
    try {
        localStorage.setItem('sistema-curioso-visits', visitCount.toString());
        console.log('Contador salvo no localStorage');
    } catch (error) {
        console.log('Erro ao salvar contador de visitas:', error);
    }
}

// Função para carregar contador de cliques do botão
function loadButtonClickCount() {
    try {
        const saved = localStorage.getItem('sistema-curioso-button-clicks');
        buttonClickCount = saved ? parseInt(saved) : 0;
    } catch (error) {
        buttonClickCount = 0;
    }
}

// Função para incrementar contador de cliques do botão
function incrementButtonClickCount() {
    buttonClickCount++;
    try {
        localStorage.setItem('sistema-curioso-button-clicks', buttonClickCount.toString());
    } catch (error) {
        console.log('Erro ao salvar contador de botão');
    }
    return buttonClickCount;
}

// Função para criar som de alerta
function playAlertSound() {
    try {
        initAudio();
        
        const oscillator1 = audioContext.createOscillator();
        const oscillator2 = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator1.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator2.frequency.setValueAtTime(600, audioContext.currentTime);
        
        oscillator1.frequency.setValueAtTime(1200, audioContext.currentTime + 0.15);
        oscillator2.frequency.setValueAtTime(900, audioContext.currentTime + 0.15);
        
        oscillator1.frequency.setValueAtTime(800, audioContext.currentTime + 0.3);
        oscillator2.frequency.setValueAtTime(600, audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
        
        oscillator1.start(audioContext.currentTime);
        oscillator2.start(audioContext.currentTime);
        oscillator1.stop(audioContext.currentTime + 0.8);
        oscillator2.stop(audioContext.currentTime + 0.8);
    } catch(e) {
        console.log('Áudio bloqueado pelo navegador');
    }
}

function playDestructionSound() {
    try {
        initAudio();
        
        for(let i = 0; i < 5; i++) {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                const freq = 200 + Math.random() * 1000;
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(freq * 2, audioContext.currentTime + 0.3);
                
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
            }, i * 100);
        }
    } catch(e) {
        console.log('Som bloqueado');
    }
}

function registerVisit() {
    console.log('Registrando visita...');
    
    incrementVisitCount();
    playAlertSound();
    
    const container = document.querySelector('.container');
    container.classList.add('glitch');
    setTimeout(() => {
        container.classList.remove('glitch');
    }, 500);
    
    const warningSymbol = document.querySelector('.warning-symbol');
    warningSymbol.style.animation = 'blink 0.1s infinite';
    setTimeout(() => {
        warningSymbol.style.animation = 'blink 1s infinite';
    }, 3000);
    
    setTimeout(() => {
        const statusBar = document.querySelector('.status-bar');
        if (statusBar) {
            statusBar.innerHTML = 'STATUS: ALERTA | INTRUSO DETECTADO | IP: 192.168.1.' + Math.floor(Math.random() * 255);
        }
    }, 1000);
}

// FUNÇÃO DO BOTÃO - DISPONÍVEL GLOBALMENTE
function incrementCounter() {
    console.log('Botão clicado!');
    
    const finalCount = incrementButtonClickCount();
    
    const button = document.getElementById('clickButton');
    if (button) {
        button.classList.add('hidden');
    }
    
    destroyScreen(finalCount);
}

function destroyScreen(finalCount = buttonClickCount) {
    const body = document.body;
    const container = document.querySelector('.container');
    const warningSymbol = document.querySelector('.warning-symbol');
    const counter = document.getElementById('counter');
    const message = document.getElementById('message');
    const title = document.querySelector('.title');
    const statusBar = document.querySelector('.status-bar');
    
    playDestructionSound();
    
    // Fase 1: Tremor leve
    container.classList.add('shake');
    
    setTimeout(() => {
        // Fase 2: Tremor maluco
        container.classList.remove('shake');
        container.classList.add('crazy-shake');
        body.style.background = 'linear-gradient(45deg, #ff0000, #000000, #ff0000, #000000)';
        body.style.backgroundSize = '400% 400%';
        body.style.animation = 'background-crazy 0.1s infinite';
        
        if (statusBar) {
            statusBar.innerHTML = 'ERRO! ERRO! SISTEMA COMPROMETIDO! DESLIGANDO...';
            statusBar.style.color = '#ff0000';
            statusBar.style.animation = 'blink 0.1s infinite';
        }
    }, 1000);
    
    setTimeout(() => {
        if (warningSymbol) warningSymbol.classList.add('fade-out');
    }, 2000);
    
    setTimeout(() => {
        if (title) title.classList.add('fade-out');
    }, 2500);
    
    setTimeout(() => {
        if (counter) counter.classList.add('fade-out');
    }, 3000);
    
    setTimeout(() => {
        if (message) message.classList.add('fade-out');
    }, 3500);
    
    setTimeout(() => {
        if (statusBar) statusBar.classList.add('fade-out');
    }, 4000);
    
    setTimeout(() => {
        container.classList.remove('crazy-shake');
        container.classList.add('close-screen');
        body.style.animation = 'closeScreen 2s forwards';
    }, 4500);
    
    setTimeout(() => {
        body.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: 'Orbitron', monospace; color: #666; text-align: center;">
                <div style="font-size: 24px; margin-bottom: 30px;">SISTEMA DESLIGADO</div>
                <div style="font-size: 18px; color: #ff4444; margin-bottom: 20px;">Você não aprendeu mesmo né? 😏</div>
                <div style="font-size: 12px; color: #333; opacity: 0.7;">
                    Pessoas que clicaram no botão: ${finalCount}
                </div>
            </div>
            <footer style="position: fixed; bottom: 10px; left: 50%; transform: translateX(-50%); color: #666; font-size: 12px; font-family: 'Orbitron', monospace; opacity: 0.7; text-align: center;">
                <p style="margin: 0; padding: 5px 15px; background: rgba(0, 0, 0, 0.3); border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.1);">© 2025 Todos os direitos reservados - @clebioz</p>
            </footer>
        `;
        body.style.background = '#000';
        body.style.animation = 'none';
    }, 7000);
}

function initializePage() {
    if (pageLoaded) return;
    
    pageLoaded = true;
    console.log('Inicializando página...');
    
    loadVisitCount();
    loadButtonClickCount();
    
    document.getElementById('counter').textContent = visitCount;
    
    setTimeout(() => {
        registerVisit();
    }, 500);
}

// Tornar função disponível globalmente
window.incrementCounter = incrementCounter;

// Event listeners
window.addEventListener('load', initializePage);
document.addEventListener('DOMContentLoaded', initializePage);

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    setTimeout(initializePage, 100);
}

// Ativar áudio com clique
document.addEventListener('click', function() {
    initAudio();
}, { once: true });

// Verificações de segurança
setTimeout(() => {
    if (!pageLoaded) {
        console.log('Forçando inicialização...');
        initializePage();
    }
}, 1000);

setInterval(() => {
    const counterElement = document.getElementById('counter');
    if (counterElement && counterElement.textContent === '0' && visitCount > 0) {
        console.log('Corrigindo display do contador');
        counterElement.textContent = visitCount;
    }
}, 2000);

console.log('Script carregado! Função incrementCounter:', typeof window.incrementCounter);