let visitCount = 0;
let buttonClickCount = 0;
let audioContext;
let pageLoaded = false;

// Função para carregar contador de visitas do servidor
async function loadVisitCount() {
    try {
        const response = await fetch('https://api.countapi.xyz/get/sistema-curioso/visits');
        const data = await response.json();
        visitCount = data.value || 0;
        document.getElementById('counter').textContent = visitCount;
    } catch (error) {
        console.log('Erro ao carregar contador de visitas:', error);
        visitCount = 0;
        document.getElementById('counter').textContent = visitCount;
    }
}

// Função para incrementar contador de visitas no servidor
async function incrementVisitCount() {
    try {
        const response = await fetch('https://api.countapi.xyz/hit/sistema-curioso/visits');
        const data = await response.json();
        visitCount = data.value || visitCount + 1;
        document.getElementById('counter').textContent = visitCount;
        return visitCount;
    } catch (error) {
        console.log('Erro ao incrementar contador de visitas:', error);
        visitCount++; // Fallback local
        document.getElementById('counter').textContent = visitCount;
        return visitCount;
    }
}

// Função para carregar contador do servidor
async function loadButtonClickCount() {
    try {
        // Usar API gratuita de contador - substitua por uma real
        const response = await fetch('https://api.countapi.xyz/get/sistema-curioso/button-clicks');
        const data = await response.json();
        buttonClickCount = data.value || 0;
    } catch (error) {
        console.log('Erro ao carregar contador:', error);
        buttonClickCount = 0;
    }
}

// Função para incrementar contador no servidor
async function incrementButtonClickCount() {
    try {
        const response = await fetch('https://api.countapi.xyz/hit/sistema-curioso/button-clicks');
        const data = await response.json();
        buttonClickCount = data.value || buttonClickCount + 1;
        return buttonClickCount;
    } catch (error) {
        console.log('Erro ao incrementar contador:', error);
        buttonClickCount++; // Fallback local
        return buttonClickCount;
    }
}

// Inicializar contexto de áudio
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Função para criar som de alerta
function playAlertSound() {
    try {
        initAudio();
        
        // Som de alerta - frequências alternadas
        const oscillator1 = audioContext.createOscillator();
        const oscillator2 = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Configurar frequências de alerta
        oscillator1.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator2.frequency.setValueAtTime(600, audioContext.currentTime);
        
        oscillator1.frequency.setValueAtTime(1200, audioContext.currentTime + 0.15);
        oscillator2.frequency.setValueAtTime(900, audioContext.currentTime + 0.15);
        
        oscillator1.frequency.setValueAtTime(800, audioContext.currentTime + 0.3);
        oscillator2.frequency.setValueAtTime(600, audioContext.currentTime + 0.3);
        
        // Configurar volume
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
        
        // Tocar o som
        oscillator1.start(audioContext.currentTime);
        oscillator2.start(audioContext.currentTime);
        oscillator1.stop(audioContext.currentTime + 0.8);
        oscillator2.stop(audioContext.currentTime + 0.8);
    } catch(e) {
        console.log('Áudio bloqueado pelo navegador - clique em qualquer lugar para ativar');
    }
}

async function registerVisit() {
    // Incrementar contador de visitas no servidor
    await incrementVisitCount();
    
    // Tocar som de alerta
    playAlertSound();
    
    // Efeito glitch
    const container = document.querySelector('.container');
    container.classList.add('glitch');
    setTimeout(() => {
        container.classList.remove('glitch');
    }, 500);
    
    // Efeito de piscar mais intenso
    const warningSymbol = document.querySelector('.warning-symbol');
    warningSymbol.style.animation = 'blink 0.1s infinite';
    setTimeout(() => {
        warningSymbol.style.animation = 'blink 1s infinite';
    }, 3000);
    
    // Simular escaneamento
    setTimeout(() => {
        document.querySelector('.status-bar').innerHTML = 
            'STATUS: ALERTA | INTRUSO DETECTADO | IP: 192.168.1.' + Math.floor(Math.random() * 255);
    }, 1000);
}

async function incrementCounter() {
    // Incrementar contador no servidor
    const finalCount = await incrementButtonClickCount();
    
    // Esconder o botão imediatamente
    const button = document.getElementById('clickButton');
    button.classList.add('hidden');
    
    // Iniciar sequência de destruição
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
    
    // Tocar som de alerta intenso
    playDestructionSound();
    
    // Fase 1: Tremor leve (1 segundo)
    container.classList.add('shake');
    
    setTimeout(() => {
        // Fase 2: Tremor maluco (2 segundos)
        container.classList.remove('shake');
        container.classList.add('crazy-shake');
        body.style.background = 'linear-gradient(45deg, #ff0000, #000000, #ff0000, #000000)';
        body.style.backgroundSize = '400% 400%';
        body.style.animation = 'background-crazy 0.1s infinite';
        
        // Status bar fica maluco
        statusBar.innerHTML = 'ERRO! ERRO! SISTEMA COMPROMETIDO! DESLIGANDO...';
        statusBar.style.color = '#ff0000';
        statusBar.style.animation = 'blink 0.1s infinite';
        
    }, 1000);
    
    setTimeout(() => {
        // Fase 3: Elementos começam a desaparecer
        warningSymbol.classList.add('fade-out');
    }, 2000);
    
    setTimeout(() => {
        title.classList.add('fade-out');
    }, 2500);
    
    setTimeout(() => {
        counter.classList.add('fade-out');
    }, 3000);
    
    setTimeout(() => {
        message.classList.add('fade-out');
    }, 3500);
    
    setTimeout(() => {
        statusBar.classList.add('fade-out');
    }, 4000);
    
    setTimeout(() => {
        // Fase 4: Tela inteira fecha
        container.classList.remove('crazy-shake');
        container.classList.add('close-screen');
        body.style.animation = 'closeScreen 2s forwards';
    }, 4500);
    
    setTimeout(() => {
        // Tela preta final com mensagem e contador
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

function playDestructionSound() {
    try {
        initAudio();
        
        // Som mais intenso e caótico
        for(let i = 0; i < 5; i++) {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                // Frequências aleatórias e caóticas
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

// Detectar visita automaticamente quando a página carrega
window.addEventListener('load', function() {
    if (!pageLoaded) {
        pageLoaded = true;
        // Carregar ambos os contadores do servidor
        loadVisitCount();
        loadButtonClickCount();
        setTimeout(() => {
            registerVisit();
        }, 500); // Pequeno delay para efeito dramático
    }
});

// Fallback para DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    if (!pageLoaded) {
        pageLoaded = true;
        // Carregar ambos os contadores do servidor
        loadVisitCount();
        loadButtonClickCount();
        setTimeout(() => {
            registerVisit();
        }, 500);
    }
});

// Permitir ativação do áudio com qualquer clique
document.addEventListener('click', function() {
    initAudio();
}, { once: true });

// Adicionar um aviso sobre áudio se bloqueado
setTimeout(() => {
    if (!audioContext || audioContext.state === 'suspended') {
        console.log('💡 Dica: Clique em qualquer lugar para ativar os sons de alerta!');
    }
}, 2000);