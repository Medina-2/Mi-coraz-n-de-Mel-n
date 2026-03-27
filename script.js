document.getElementById('click-me').addEventListener('click', () => {
    document.getElementById('intro-screen').classList.remove('show');
    document.getElementById('intro-screen').classList.add('hidden');
    
    processImage();

    setTimeout(() => {
        document.getElementById('main-screen').classList.remove('hidden');
        document.getElementById('main-screen').classList.add('show');
        initPetals();
    }, 1000);
});

// Create intro flowers on load
window.onload = () => {
    createFlowers('intro-flowers', 10);
};

function createFlowers(containerId, count) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    for (let i = 0; i < count; i++) {
        const flower = document.createElement('div');
        flower.className = 'intro-flower css-flower-obj';
        // Force tulips only as requested
        flower.innerHTML = getTulipSVG();
        flower.style.left = `${(i / count) * 100}%`;
        flower.style.bottom = `${Math.random() * 20}px`;
        flower.style.position = 'absolute';
        flower.style.width = '60px';
        container.appendChild(flower);
    }
}

function createBouquet() {
    const container = document.getElementById('bouquet-flowers');
    if (!container) return;
    
    for (let i = 0; i < 15; i++) {
        const flower = document.createElement('div');
        flower.className = 'bouquet-flower css-flower-obj';
        flower.innerHTML = getTulipSVG(); // Changed to tulips
        flower.style.position = 'absolute';
        flower.style.left = `${Math.random() * 100}px`;
        flower.style.top = `${Math.random() * 100}px`;
        flower.style.transform = `rotate(${Math.random() * 360}deg)`;
        container.appendChild(flower);
    }
}

function getRoseSVG() {
    return `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="30" fill="#b31d22" />
        <circle cx="40" cy="40" r="25" fill="#5d2a2c" opacity="0.5" />
        <circle cx="60" cy="40" r="25" fill="#5d2a2c" opacity="0.5" />
        <circle cx="50" cy="65" r="25" fill="#5d2a2c" opacity="0.5" />
        <path d="M50 80 Q55 95 60 100 L40 100 Q45 95 50 80" fill="green" />
    </svg>`;
}

function getTulipSVG() {
    return `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <!-- Tallo -->
        <path d="M50 70 L50 100" stroke="#2e7d32" stroke-width="4" stroke-linecap="round"/>
        <!-- Hojas -->
        <path d="M50 90 Q30 80 40 50 Q50 70 50 90" fill="#388e3c" />
        <path d="M50 85 Q70 75 60 45 Q50 65 50 85" fill="#388e3c" />
        <!-- Flor -->
        <path d="M30 50 C30 85 70 85 70 50 L60 30 L50 45 L40 30 Z" fill="#e91e63" />
    </svg>`;
}

function processImage() {
    const img = document.getElementById('alfredo-img');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
        try {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.drawImage(img, 0, 0);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i+1];
                const b = data[i+2];
                // More aggressive removal of white/near-white
                if (r > 200 && g > 200 && b > 200) {
                    data[i+3] = 0;
                }
            }
            
            ctx.putImageData(imageData, 0, 0);
            img.src = canvas.toDataURL();
        } catch (e) {
            console.error("No se pudo quitar el fondo automáticamente debido a restricciones de seguridad del navegador para archivos locales. Intenta abrirlo con un servidor local o usa una imagen con fondo transparente.", e);
            // Fallback: apply a filter to help blend
            img.style.filter = "drop-shadow(0 0 10px rgba(0,0,0,0.5))";
        }
    };
    
    // Trigger onload if already cached
    if (img.complete) img.onload();
}

function createTulips() {
    const container = document.getElementById('tulips');
    const colors = ['#e31b23', '#ff4d4d', '#722f37', '#000080'];
    
    for (let i = 0; i < 15; i++) {
        const tulip = document.createElement('div');
        tulip.className = 'tulip';
        tulip.style.left = `${Math.random() * 100}%`;
        tulip.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        tulip.style.bottom = `${Math.random() * 20}px`;
        container.appendChild(tulip);
    }
}

function initPetals() {
    const canvas = document.getElementById('petals-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const petals = [];
    const petalCount = 150; // More petals for a lush effect
    
    // Muted, romantic colors: deep reds and soft pinks
    const colors = ['#b31d22', '#8b1a1e', '#c94050', '#e07080', '#7a1520'];
    
    for (let i = 0; i < petalCount; i++) {
        petals.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height, // start spread across the screen
            size: Math.random() * 10 + 4,
            speedY: Math.random() * 2.5 + 0.8,
            speedX: (Math.random() - 0.5) * 0.8, // gentle drift left/right
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 2 - 1,
            opacity: Math.random() * 0.5 + 0.5, // 50%-100% opacity
            color: colors[Math.floor(Math.random() * colors.length)],
            type: Math.random() > 0.5 ? 'rose' : 'tulip'
        });
    }
    
    function drawPetal(petal) {
        ctx.save();
        ctx.globalAlpha = petal.opacity;
        ctx.translate(petal.x, petal.y);
        ctx.rotate(petal.rotation * Math.PI / 180);
        ctx.fillStyle = petal.color;
        
        if (petal.type === 'rose') {
            // Soft curved petal
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-petal.size, -petal.size, -petal.size, petal.size/2, 0, petal.size);
            ctx.bezierCurveTo(petal.size, petal.size/2, petal.size, -petal.size, 0, 0);
            ctx.fill();
        } else {
            // Teardrop tulip petal
            ctx.beginPath();
            ctx.ellipse(0, petal.size/2, petal.size/3, petal.size/2, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        petals.forEach(petal => {
            petal.y += petal.speedY;
            petal.x += petal.speedX;
            petal.rotation += petal.rotationSpeed;
            
            if (petal.y > canvas.height + 20) {
                petal.y = -20;
                petal.x = Math.random() * canvas.width;
            }
            // Wrap horizontally
            if (petal.x > canvas.width + 20) petal.x = -20;
            if (petal.x < -20) petal.x = canvas.width + 20;
            
            drawPetal(petal);
        });
        
        requestAnimationFrame(update);
    }
    
    update();
}

window.addEventListener('resize', () => {
    const canvas = document.getElementById('petals-canvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});
