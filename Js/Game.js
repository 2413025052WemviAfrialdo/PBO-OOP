// # =====================================================
// # CLASS: Game (Main Controller)
// # =====================================================

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        
        // 🔥 FITUR BARU: Memperbesar Ukuran Ular dan Makanan! (Sebelumnya 20)
        this.cellSize = 35; 
        
        this.adjustCanvasSize();
        this.currentTheme = THEMES.galaxy;
        this.state = 'menu';
        this.boardType = 'normal';
        this.baseInterval = 160;
        this.currentInterval = this.baseInterval;
        this.gameLoopId = null;
        this.animFrameId = null;
        this.scoreBoard = new ScoreBoard();
        this.powerUpTimer = new PowerUpTimer();
        this.powerUpMessage = null;
        this.powerUpMessageEnd = 0;
        
        this.isSlowMotion = false;
        this.isSpeedBoost = false;
        this.isDoubleScore = false;
        this.stars = [];
        
        // 🔥 FITUR BARU: Variabel Nyawa
        this.lives = 3;
        
        this.selectedThemeName = 'galaxy';
        this.selectedSkinName = 'Magma Dragon';

        this.bgMusic = new Audio(); 
        this.bgMusic.src = 'Audio/game2.mp3'; 
        this.bgMusic.loop = true; 
        this.bgMusic.volume = 0.5; 
        this.bgMusic.preload = 'auto'; 

        this.arenaImage = new Image();
        this.arenaImage.src = 'Asset/Arena/Arena Galakasi.jpg';
        this.arenaLoaded = false;
        this.arenaImage.onload = () => { this.arenaLoaded = true; };

        this.levelUpSound = new Audio();

        this.setupInput();
        this.setupUI();
        this.showMenu();
        this.renderLoop();
    }

    adjustCanvasSize() {
        let newWidth = window.innerWidth - 60;   
        let newHeight = window.innerHeight - 250; 

        // Bulatkan ke kelipatan cellSize (35) agar grid pas
        newWidth = newWidth - (newWidth % this.cellSize);
        newHeight = newHeight - (newHeight % this.cellSize);

        if (newWidth < 300) newWidth = 300;
        if (newHeight < 300) newHeight = 300;

        this.canvas.width = newWidth;
        this.canvas.height = newHeight;
    }

    // # Method: Memperbarui tampilan UI Hati/Nyawa
    updateLivesUI() {
        const livesEl = document.getElementById('lives-value');
        if (livesEl) {
            // Tampilkan hati merah sesuai jumlah nyawa, jika 0 tampilkan tengkorak
            livesEl.innerHTML = this.lives > 0 ? '❤️'.repeat(this.lives) : '💀';
        }
    }

    initGame() {
        if (this.boardType === 'obstacle') {
            this.board = new ObstacleBoard(this.canvas, this.cellSize, this.currentTheme);
        } else {
            this.board = new NormalBoard(this.canvas, this.cellSize, this.currentTheme);
        }
        this.board.game = this;

        const midX = Math.floor(this.board.cols / 2);
        const midY = Math.floor(this.board.rows / 2);
        
        this.snake = new Snake(midX, midY, this.currentTheme);
        this.snake.setSkin(this.selectedSkinName);

        this.foodManager = new FoodManager(this.board.cols, this.board.rows);
        this.foodManager.findEmptyPosition = (snake, obstacles) => {
            let pos;
            let attempts = 0;
            do {
                pos = {
                    x: Math.floor(Math.random() * (this.foodManager.cols - 2)) + 1,
                    y: Math.floor(Math.random() * (this.foodManager.rows - 2)) + 1
                };
                attempts++;
            } while (
                attempts < 300 && (
                    snake.body.some(s => s.x === pos.x && s.y === pos.y) ||
                    (obstacles && obstacles.some(o => o.x === pos.x && o.y === pos.y)) ||
                    this.foodManager.foods.some(f => f.x === pos.x && f.y === pos.y)
                )
            );
            return attempts < 300 ? pos : null;
        };
        const obstacles = this.board.obstacles || [];
        this.foodManager.initialize(this.snake, obstacles);

        // 🔥 Reset Nyawa saat main baru
        this.lives = 3;
        this.updateLivesUI();

        this.scoreBoard.reset();
        this.powerUpTimer.clearAll();
        this.isSlowMotion = false;
        this.isSpeedBoost = false;
        this.isDoubleScore = false;
        this.currentInterval = this.baseInterval;
        this.baseInterval = 160;
        this.powerUpMessage = null;

        if (this.currentTheme.starsEnabled) this.generateStars();
        else this.stars = [];

        this.scoreBoard.updateUI();
        this.powerUpTimer.updateUI();
    }

    generateStars() {
        this.stars = [];
        for (let i = 0; i < 80; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                r: Math.random() * 1.5 + 0.3,
                opacity: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 0.03 + 0.01,
                twinkleAngle: Math.random() * Math.PI * 2
            });
        }
    }

    startGame() {
        this.initGame();
        this.state = 'playing';
        this.hideAllScreens();
        this.showHUD(true);
        this.startGameLoop();
        if (this.bgMusic.src) { this.bgMusic.currentTime = 0; this.bgMusic.play().catch(() => {}); }
    }

    startGameLoop() {
        if (this.gameLoopId) clearInterval(this.gameLoopId);
        this.gameLoopId = setInterval(() => this.gameStep(), this.currentInterval);
    }

    gameStep() {
        if (this.state !== 'playing') return;

        this.snake.move();
        const head = this.snake.getHead();

        if (head.x < 1 || head.x >= this.board.cols - 1 || head.y < 1 || head.y >= this.board.rows - 1) {
            if (this.snake.hasShield) {
                this.snake.body[0] = { ...this.snake.body[1] };
                this.snake.direction = this.snake.nextDirection;
                return;
            }
            this.handleGameOver('Menabrak tembok!');
            return;
        }

        if (this.board.isLethalCollision(head.x, head.y)) {
            if (this.snake.hasShield) {
                this.snake.body[0] = { ...this.snake.body[1] };
                return;
            }
            this.handleGameOver('Menabrak rintangan!');
            return;
        }

        if (this.snake.checkSelfCollision()) {
            if (!this.snake.hasShield) {
                this.handleGameOver('Menabrak tubuh sendiri!');
                return;
            }
        }

        const obstacles = this.board.obstacles || [];
        const foodIndex = this.foodManager.checkCollision(head);
        
        if (foodIndex !== -1) {
            const food = this.foodManager.foods[foodIndex];
            this.foodManager.removeFood(foodIndex);

            // 🔥 LOGIKA BARU: Cek jika yang dimakan adalah Bom
            if (food.type === 'bomb' || food.constructor.name === 'Bomb') {
                if (this.snake.hasShield) {
                    this.showPowerUpMessage('🛡️ Perisai Menahan Bom!', '#4488FF');
                    this.snake.hasShield = false; // Perisai hancur tapi nyawa aman
                } else {
                    // Nyawa berkurang, tidak Game Over (tetap lanjut jalan)
                    this.lives--;
                    this.updateLivesUI();
                    this.snake.playDeathSound();
                    this.deathFlash = 15; // Beri kedipan merah tebal di layar
                    
                    if (this.lives > 0) {
                        this.showPowerUpMessage(`💥 KENA BOM! Sisa Nyawa: ${this.lives}`, '#ff4444');
                    } else {
                        // Nyawa habis = Game Over
                        this.handleGameOver('Kehabisan Nyawa Terkena Bom!');
                        return;
                    }
                }
            } 
            // Jika makanan biasa / power up
            else {
                food.applyEffect(this.snake, this);
                if (this.state !== 'playing') return;

                this.scoreBoard.addScore(food.scoreValue);
                this.snake.grow();
                this.snake.playEatSound();
                const leveledUp = this.scoreBoard.incrementFood();
                if (leveledUp) {
                    this.baseInterval = Math.max(70, this.baseInterval - 8);
                    this.recalculateInterval();
                    if (this.levelUpSound.src) this.levelUpSound.play().catch(() => {});
                    this.showPowerUpMessage('LEVEL UP! +' + (50 * this.scoreBoard.level) + ' bonus poin!', '#fff');
                }
            }
        }

        this.foodManager.update(this.snake, obstacles);

        const expired = this.powerUpTimer.update();
        expired.forEach(name => {
            if (name === 'slowmo') { this.isSlowMotion = false; this.recalculateInterval(); }
            if (name === 'speed')  { this.isSpeedBoost = false; this.recalculateInterval(); }
            if (name === 'double') { this.isDoubleScore = false; this.scoreBoard.setDoubleScore(false); }
            if (name === 'shield') { this.snake.hasShield = false; }
        });

        this.scoreBoard.updateUI();
    }

    handleGameOver(reason) {
        this.state = 'gameover';
        clearInterval(this.gameLoopId);
        this.snake.playDeathSound();
        if (this.bgMusic.src) this.bgMusic.pause();
        this.deathFlash = 8;
        this.deathReason = reason || 'Game Over';
        setTimeout(() => this.showGameOver(), 600);
    }

    showGameOver() {
        const screen = document.getElementById('screen-gameover');
        if (screen) {
            const el = document.getElementById('final-score');
            const elH = document.getElementById('final-high');
            const elR = document.getElementById('death-reason');
            if (el) el.textContent = this.scoreBoard.score;
            if (elH) elH.textContent = this.scoreBoard.highScore;
            if (elR) elR.textContent = this.deathReason || '';
            screen.classList.remove('hidden');
        }
    }

    renderLoop() {
        const render = () => {
            if (this.state === 'playing' || this.state === 'paused' || this.state === 'gameover') {
                this.render();
            }
            this.animFrameId = requestAnimationFrame(render);
        };
        this.animFrameId = requestAnimationFrame(render);
    }

    render() {
        if (!this.board) return;
        const ctx = this.board.ctx;

        this.board.draw();

        if (this.currentTheme.starsEnabled && this.stars.length > 0) {
            this.stars.forEach(star => {
                star.twinkleAngle += star.twinkleSpeed;
                const op = star.opacity * (0.6 + 0.4 * Math.sin(star.twinkleAngle));
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${op})`;
                ctx.fill();
            });
        }

        this.foodManager.draw(ctx, this.cellSize);
        this.snake.draw(ctx, this.cellSize);

        // Flash Merah tebal saat kena bom / mati
        if (this.deathFlash > 0) {
            ctx.fillStyle = `rgba(255,0,0,${this.deathFlash * 0.08})`;
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.deathFlash--;
        }

        if (this.state === 'paused') {
            ctx.fillStyle = 'rgba(0,0,0,0.55)';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 34px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('⏸ JEDA', this.canvas.width / 2, this.canvas.height / 2);
            ctx.font = '15px Arial';
            ctx.fillText('Tekan P atau Space untuk lanjut', this.canvas.width / 2, this.canvas.height / 2 + 38);
        }

        if (this.powerUpMessage && Date.now() < this.powerUpMessageEnd) {
            const alpha = Math.min(1, (this.powerUpMessageEnd - Date.now()) / 400);
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = 'rgba(0,0,0,0.65)';
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(this.canvas.width / 2 - 210, 28, 420, 38, 8);
            else ctx.rect(this.canvas.width / 2 - 210, 28, 420, 38);
            ctx.fill();
            ctx.fillStyle = this.powerUpMessage.color;
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.powerUpMessage.text, this.canvas.width / 2, 47);
            ctx.restore();
        }
    }

    showPowerUpMessage(text, color) {
        this.powerUpMessage = { text, color: color || '#fff' };
        this.powerUpMessageEnd = Date.now() + 2800;
    }

    setSlowMotion(active, duration) {
        this.isSlowMotion = active;
        if (active) this.powerUpTimer.addEffect('slowmo', duration, '#66aaff', '⏱ Slow Motion');
        this.recalculateInterval();
    }

    setSpeedBoost(active, duration) {
        this.isSpeedBoost = active;
        if (active) this.powerUpTimer.addEffect('speed', duration, '#FFD700', '⚡ Speed Boost');
        this.recalculateInterval();
    }

    setDoubleScore(active, duration) {
        this.isDoubleScore = active;
        this.scoreBoard.setDoubleScore(active);
        if (active) this.powerUpTimer.addEffect('double', duration, '#44CC44', '×2 Double Score');
    }

    activateShield(duration) {
        this.snake.hasShield = true;
        this.snake.shieldEndTime = Date.now() + duration;
        this.powerUpTimer.addEffect('shield', duration, '#FF6688', '🛡 Perisai');
    }

    recalculateInterval() {
        let interval = this.baseInterval;
        if (this.isSlowMotion) interval = this.baseInterval * 2.2;
        if (this.isSpeedBoost) interval = Math.max(40, this.baseInterval * 0.38);
        this.currentInterval = interval;
        this.startGameLoop();
    }

    setupInput() {
        document.addEventListener('keydown', (e) => {
            if (this.state === 'playing') {
                const d = { ArrowUp:'up', w:'up', W:'up', ArrowDown:'down', s:'down', S:'down', ArrowLeft:'left', a:'left', A:'left', ArrowRight:'right', d:'right', D:'right' };
                if (d[e.key]) { e.preventDefault(); this.snake.setDirection(d[e.key]); }
                if (e.key === 'p' || e.key === 'P' || e.key === ' ') { e.preventDefault(); this.pauseGame(); }
            } else if (this.state === 'paused') {
                if (e.key === 'p' || e.key === 'P' || e.key === ' ') { e.preventDefault(); this.resumeGame(); }
            }
        });

        let tx = 0, ty = 0;
        this.canvas.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; e.preventDefault(); }, { passive: false });
        this.canvas.addEventListener('touchend', (e) => {
            const dx = e.changedTouches[0].clientX - tx;
            const dy = e.changedTouches[0].clientY - ty;
            if (this.state !== 'playing') return;
            if (Math.abs(dx) > Math.abs(dy)) this.snake.setDirection(dx > 0 ? 'right' : 'left');
            else this.snake.setDirection(dy > 0 ? 'down' : 'up');
            e.preventDefault();
        }, { passive: false });
    }

    pauseGame() {
        this.state = 'paused';
        clearInterval(this.gameLoopId);
    }

    resumeGame() {
        this.state = 'playing';
        this.startGameLoop();
    }

    setupUI() {
        const on = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('click', fn); };
        on('btn-start',   () => this.startGame());
        on('btn-restart', () => this.startGame());
        on('btn-menu',    () => this.showMenu());
        on('btn-pause',   () => { if (this.state === 'playing') this.pauseGame(); else if (this.state === 'paused') this.resumeGame(); });

        const dirs = { 'btn-up': 'up', 'btn-down': 'down', 'btn-left': 'left', 'btn-right': 'right' };
        Object.entries(dirs).forEach(([id, dir]) => on(id, () => { if (this.state === 'playing') this.snake.setDirection(dir); }));

        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                this.selectedThemeName = e.target.value;
                this.applyTheme(e.target.value);
            });
        }

        // (Di dalam method setupUI) ...
        const boardSelect = document.getElementById('board-select');
        if (boardSelect) boardSelect.addEventListener('change', (e) => { this.boardType = e.target.value; });

        // 🔥 LOGIKA BARU: DROPDOWN & ANIMASI PREVIEW
        const skinSelect = document.getElementById('skin-select');
        const previewHead = document.getElementById('preview-head');
        const previewBody = document.getElementById('preview-body');
        const previewTail = document.getElementById('preview-tail');

        if (skinSelect) {
            skinSelect.addEventListener('change', (e) => {
                this.selectedSkinName = e.target.value;
                
                // Ubah gambar ular di game
                if (this.snake) {
                    this.snake.setSkin(this.selectedSkinName);
                }
                
                // Ubah gambar animasi melayang di menu secara langsung
                const skin = this.selectedSkinName;
                if(previewHead && previewBody && previewTail) {
                    previewHead.src = `Asset/${skin}/H1.png`;
                    previewBody.src = `Asset/${skin}/A2.png`;
                    previewTail.src = `Asset/${skin}/C2.png`;
                }
            });
        }
    }
 
    applyTheme(themeName) {
        const theme = THEMES[themeName];
        if (!theme) return;

        this.currentTheme = theme;

        if (this.board) this.board.setTheme(theme);
        if (this.snake) this.snake.setTheme(theme);

        document.documentElement.style.setProperty('--panel-bg', theme.panelBg);
        document.documentElement.style.setProperty('--panel-border', theme.panelBorder);
        document.documentElement.style.setProperty('--text-color', theme.text);
        document.documentElement.style.setProperty('--accent-color', theme.accent);
        document.documentElement.style.setProperty('--btn-bg', theme.buttonBg);
        document.documentElement.style.setProperty('--btn-text', theme.buttonText);
        document.documentElement.style.setProperty('--title-color', theme.titleColor);

        document.body.style.backgroundColor = theme.background;

        if (theme.bgImage) {
            document.body.style.backgroundImage = `url(${theme.bgImage})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundRepeat = 'no-repeat';
            document.body.style.transition = 'all 0.5s ease';
        } else {
            document.body.style.backgroundImage = 'none';
        }

        if (theme.starsEnabled && this.stars !== undefined) {
            this.generateStars();
        } else {
            this.stars = [];
        }
    }

    setTheme(name) { this.applyTheme(name); }

    showHUD(visible) {
        const hud = document.getElementById('game-hud');
        if (hud) hud.style.display = visible ? 'flex' : 'none';
        const dpad = document.getElementById('dpad-panel');
        if (dpad) dpad.style.display = visible ? 'flex' : 'none';
        const pw = document.getElementById('powerup-panel');
        if (pw) pw.style.display = visible ? 'block' : 'none';
        const ctrl = document.getElementById('ctrl-panel');
        if (ctrl) ctrl.style.display = visible ? 'block' : 'none';
    }

    showMenu() {
        this.state = 'menu';
        if (this.gameLoopId) clearInterval(this.gameLoopId);
        this.hideAllScreens();
        this.showHUD(false);
        document.getElementById('screen-menu').classList.remove('hidden');
        this.applyTheme(this.selectedThemeName || 'galaxy');
        if (this.board) { this.board.draw(); }
    }

    hideAllScreens() {
        document.querySelectorAll('.game-screen').forEach(s => s.classList.add('hidden'));
    }
}