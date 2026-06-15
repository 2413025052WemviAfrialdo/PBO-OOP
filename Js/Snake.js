// # =====================================================
// # CLASS: Snake
// # Mengontrol gerakan, tampilan, dan status ular pemain.
// # =====================================================

class Snake {
    constructor(startX, startY, theme) {
        this.body = [
            { x: startX, y: startY },
            { x: startX - 1, y: startY },
            { x: startX - 2, y: startY }
        ];
        this.direction = 'right';
        this.nextDirection = 'right';
        this.growing = false;
        this.theme = theme || {}; 
        this.hasShield = false;
        this.shieldEndTime = 0;

        // # ==========================================
        // # MANAJER ASET GAMBAR ULAR (VERSI 3 KEPALA!)
        // # ==========================================
        this.currentTheme = "Magma Dragon"; 
        
        // 🔥 KITA SEKARANG MEMUAT 5 GAMBAR (Tiga Kepala, Badan, Ekor)
        this.skin = {
            headSide: new Image(),  // H1.png (Samping)
            headFront: new Image(), // A1.png (Depan)
            headUp: new Image(),    // B1.png (Serong/Atas)
            body: new Image(),      // A2.png
            tail: new Image()       // C2.png
        };

        this.loadSkinImages();

        this.eatSound = new Audio();
        this.deathSound = new Audio();
    }

    loadSkinImages() {
        this.imagesLoaded = false;
        let loadedCount = 0;
        
        const checkLoad = () => {
            loadedCount++;
            // 🔥 Sekarang tunggu sampai 5 gambar termuat
            if (loadedCount === 5) this.imagesLoaded = true;
        };

        // Muat 3 jenis kepala yang Anda punya
        this.skin.headSide.src = `Asset/${this.currentTheme}/H1.png`;
        this.skin.headFront.src = `Asset/${this.currentTheme}/A1.png`;
        this.skin.headUp.src = `Asset/${this.currentTheme}/B1.png`; // Kepala ke-3!
        
        this.skin.body.src = `Asset/${this.currentTheme}/A2.png`;
        this.skin.tail.src = `Asset/${this.currentTheme}/C2.png`;

        this.skin.headSide.onload = checkLoad;
        this.skin.headFront.onload = checkLoad;
        this.skin.headUp.onload = checkLoad;
        this.skin.body.onload = checkLoad;
        this.skin.tail.onload = checkLoad;
    }

    setSkin(skinFolderName) {
        this.currentTheme = skinFolderName;
        this.loadSkinImages(); 
    }

    setDirection(newDir) {
        const opposites = { up: 'down', down: 'up', left: 'right', right: 'left' };
        if (opposites[newDir] !== this.direction) {
            this.nextDirection = newDir;
        }
    }

    move() {
        this.direction = this.nextDirection;
        const head = this.body[0];
        let newHead;

        if (this.direction === 'up')    newHead = { x: head.x, y: head.y - 1 };
        if (this.direction === 'down')  newHead = { x: head.x, y: head.y + 1 };
        if (this.direction === 'left')  newHead = { x: head.x - 1, y: head.y };
        if (this.direction === 'right') newHead = { x: head.x + 1, y: head.y };

        this.body.unshift(newHead);

        if (!this.growing) {
            this.body.pop();
        } else {
            this.growing = false;
        }
    }

    grow() { this.growing = true; }
    getHead() { return this.body[0]; }
    checkSelfCollision() {
        const head = this.body[0];
        return this.body.slice(1).some(seg => seg.x === head.x && seg.y === head.y);
    }

    getSegmentAngle(index) {
        const currentSeg = this.body[index];
        const prevSeg = this.body[index - 1]; 

        let dx = prevSeg.x - currentSeg.x;
        let dy = prevSeg.y - currentSeg.y;

        if (dx > 1) dx = -1; else if (dx < -1) dx = 1;
        if (dy > 1) dy = -1; else if (dy < -1) dy = 1;

        let angle = Math.atan2(dy, dx);

        if (index === this.body.length - 1) {
            angle += Math.PI; 
            if (angle > Math.PI) angle -= Math.PI * 2;
        }
        return angle;
    }

    draw(ctx, cellSize) {
        const now = Date.now();
        if (this.hasShield && now > this.shieldEndTime) {
            this.hasShield = false;
        }

        // 🔥 PENGATURAN SKALA (Kepala & Badan)
        const headSize = cellSize * 1.8;
        const bodyWidth = cellSize * 1.5;
        const bodyHeight = cellSize * 1.25;

        const isRectTail = (this.currentTheme === 'Cybernetic' || this.currentTheme === 'Ghostly');
        const tailWidth = isRectTail ? (cellSize * 1.9) : (cellSize * 1.6);
        const tailHeight = isRectTail ? (cellSize * 0.9) : (cellSize * 1.6);
        const tailShift = isRectTail ? (cellSize * 0.1) : (cellSize * 0.25);

        for (let i = this.body.length - 1; i >= 0; i--) {
            const seg = this.body[i];
            const px = seg.x * cellSize;
            const py = seg.y * cellSize;

            if (this.imagesLoaded) {
                ctx.save();
                // Pindahkan titik pusat rotasi ke tengah kotak grid
                ctx.translate(px + cellSize / 2, py + cellSize / 2);
                
                let imgToDraw;

                // ==========================================
                // 1. LOGIKA KEPALA (HANYA PAKAI H1.png)
                // ==========================================
                if (i === 0) {
                    imgToDraw = this.skin.headSide; // Selalu H1.png (Leher paling pas)
                    
                    // Putar kanvas agar kepala otomatis menghadap arah jalan
                    let angle = 0;
                    if (this.direction === 'right') angle = 0;
                    else if (this.direction === 'down') angle = Math.PI / 2;  // Putar bawah (90 derajat)
                    else if (this.direction === 'left') angle = Math.PI;      // Putar kiri (180 derajat)
                    else if (this.direction === 'up') angle = -Math.PI / 2;   // Putar atas (-90 derajat)
                    
                    ctx.rotate(angle);

                    // ✨ KUNCI ANTI JUNGKIR BALIK: 
                    // Jika putar kiri 180 derajat, gambarnya jadi terbalik (kaki di atas). 
                    // Kita atasi dengan mencerminkan sumbu Y-nya secara ajaib!
                    if (this.direction === 'left') {
                        ctx.scale(1, -1); 
                    }

                    // Karena kepala sudah di-rotate menghadap depan, bagian belakang kepala 
                    // (leher) SELALU berada di arah sumbu X negatif!
                    const shiftAmount = cellSize * 0.35; 
                    
                    // Kita cukup tarik koordinat X ke angka minus, dia otomatis menancap ke badan!
                    ctx.drawImage(imgToDraw, (-headSize / 2) - shiftAmount, -headSize / 2, headSize, headSize);
                } 
                // ==========================================
                // 2. LOGIKA EKOR
                // ==========================================
                else if (i === this.body.length - 1) {
                    imgToDraw = this.skin.tail;
                    ctx.rotate(this.getSegmentAngle(i));
                    ctx.drawImage(imgToDraw, (-tailWidth / 2) + tailShift, -tailHeight / 2, tailWidth, tailHeight);
                }
                // ==========================================
                // 3. LOGIKA BADAN UTAMA
                // ==========================================
                else {
                    imgToDraw = this.skin.body;
                    ctx.rotate(this.getSegmentAngle(i));
                    ctx.drawImage(imgToDraw, -bodyWidth / 2, -bodyHeight / 2, bodyWidth, bodyHeight);
                }

                ctx.restore();
            } else {
                if (i === 0) this.drawFallbackHead(ctx, px, py, cellSize);
                else this.drawFallbackBody(ctx, px, py, cellSize, i);
            }
        }

        if (this.hasShield) this.drawShieldEffect(ctx, cellSize);
    }

    drawFallbackHead(ctx, px, py, cellSize) {
        ctx.save();
        ctx.translate(px + cellSize / 2, py + cellSize / 2);
        const angles = { right: 0, down: Math.PI / 2, left: Math.PI, up: -Math.PI / 2 };
        ctx.rotate(angles[this.direction] || 0);
        ctx.fillStyle = this.theme.snakeHead || '#fff';
        ctx.fillRect(-cellSize/2 + 1, -cellSize/2 + 1, cellSize - 2, cellSize - 2);
        
        ctx.fillStyle = '#000';
        ctx.beginPath(); ctx.arc(-cellSize/2 + cellSize * 0.35, -cellSize/2 + cellSize * 0.35, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(-cellSize/2 + cellSize * 0.65, -cellSize/2 + cellSize * 0.35, 2, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    }

    drawFallbackBody(ctx, px, py, cellSize, index) {
        const alpha = Math.max(0.4, 1 - (index / this.body.length) * 0.5);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.theme.snakeBody || '#ccc';
        ctx.fillRect(px + 2, py + 2, cellSize - 4, cellSize - 4);
        ctx.globalAlpha = 1;
    }

    drawShieldEffect(ctx, cellSize) {
        const head = this.body[0];
        const cx = head.x * cellSize + cellSize / 2;
        const cy = head.y * cellSize + cellSize / 2;
        const radius = cellSize * 0.8;

        ctx.save();
        ctx.strokeStyle = 'rgba(100, 150, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#4488ff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    playEatSound() { if (this.eatSound.src) { this.eatSound.currentTime = 0; this.eatSound.play().catch(() => {}); } }
    playDeathSound() { if (this.deathSound.src) { this.deathSound.currentTime = 0; this.deathSound.play().catch(() => {}); } }
    getLength() { return this.body.length; }
    setTheme(theme) { this.theme = theme; }
}