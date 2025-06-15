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

// Função para extrair número do contador S12 (GLOBAL - VISITAS)
function extractS12Count() {
    const counterImg = document.getElementById('s12-counter');
    if (counterImg && counterImg.src) {
        // Extrair número da URL da imagem
        const match = counterImg.src.match(/img-[^-]+-(\d+)\.gif/);
        if (match && match[1]) {
            const count = parseInt(match[1]);
            console.log('Contador S12 detectado:', count);
            return count;
        }
    }
    return 0;
}

// Função para monitorar e atualizar contador global de visitas
function updateGlobalCounter() {
    const s12Count = extractS12Count();
    if (s12Count > 0) {
        visitCount = s12Count;
        document.getElementById('counter').textContent = visitCount;
        console.log('Contador global atualizado para:', visitCount);
        return true;
    }
    return false;
}

// Função para carregar contador GLOBAL de cliques do botão
async function loadGlobalButtonCount() {
    try {
        const response = await fetch('https://api.countapi.xyz/get/sistema-curioso-clebioz/button-clicks');
        const data = await response.json();
        buttonClickCount = data.value || 0;
        console.log('Contador global de botão carregado:', buttonClickCount);
        return buttonClickCount;
    } catch (error) {
        console.log('Erro ao carregar contador global de botão:', error);
        buttonClickCount = 0;
        return 0;
    }
}

// Função para incrementar contador GLOBAL de cliques do botão
async function incrementGlobalButtonCount() {
    try {
        const response = await fetch('https://api.countapi.xyz/hit/sistema-curioso-clebioz/button-clicks');
        const data = await response.json();
        buttonClickCount = data.value || buttonClickCount + 1;
        console.log('Contador global de botão incrementado para:', buttonClickCount);
        return buttonClickCount;
    } catch (error) {
        console.log('Erro ao incrementar contador global de botão:', error);
        buttonClickCount++;
        return buttonClickCount;
    }
}

// Função para monitorar mudanças no contador S12
function monitorS12Counter() {
    console.log('Iniciando monitoramento do contador S12...');
    
    // Verificar contador a cada 2 segundos
    const checkInterval = setInterval(() => {
        if (updateGlobalCounter()) {
            // Se conseguiu extrair o número, pode reduzir a frequência
            clearInterval(checkInterval);
            
            // Verificar mudanças menos frequentemente após detectar
            setInterval(updateGlobalCounter, 10000); // A cada 10 segundos
        }
    }, 2000);
    
    // Observar mudanças na imagem
    const counterImg = document.getElementById('s12-counter');
    if (counterImg) {
        const observer = new MutationObserver(() => {
            updateGlobalCounter();
        });
        
        observer.observe(counterImg, { 
            attributes: true, 
            attributeFilter: ['src'] 
        });
    }
    
    // Fallback: incrementar contador local se S12 não funcionar após 30 segundos
    setTimeout(() => {
        if (visitCount === 0) {
            console.log('Fallback: usando contador local');
            visitCount = 1;
            document.getElementById('counter').textContent = visitCount;
        }
    }, 30000);
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
}, 3000); // Aumentar tempo para dar chance ao S12

// Verificar se o contador S12 está carregando
setInterval(() => {
    if (pageLoaded && visitCount === 0) {
        console.log('Tentando atualizar contador S12...');
        updateGlobalCounter();
    }
}, 5000);

console.log('Script carregado! Função incrementCounter:', typeof window.incrementCounter);
console.log('Contador S12 será monitorado automaticamente.');