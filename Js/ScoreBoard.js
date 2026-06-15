// # =====================================================
// # CLASS: ScoreBoard
// # Mengelola skor, level, dan high score.
// # Skor ditampilkan HANYA saat game sedang berjalan.
// # =====================================================

class ScoreBoard {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.foodEaten = 0;
        this.foodPerLevel = 5;
        this.highScore = this.loadHighScore();
        this.isDoubleScore = false;
    }

    // # Method: Menambahkan poin ke skor
    addScore(points) {
        const multiplier = this.isDoubleScore ? 2 : 1;
        const gained = points * multiplier;
        this.score += gained;
        if (this.score < 0) this.score = 0;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }
        return gained;
    }

    // # Method: Catat makanan dimakan dan cek kenaikan level
    incrementFood() {
        this.foodEaten++;
        if (this.foodEaten >= this.foodPerLevel) {
            this.levelUp();
            return true;
        }
        return false;
    }

    // # Method: Naik level
    levelUp() {
        this.level++;
        this.foodEaten = 0;
        this.addScore(50 * this.level);
    }

    // # Method: Reset semua nilai
    reset() {
        this.score = 0;
        this.level = 1;
        this.foodEaten = 0;
        this.isDoubleScore = false;
    }

    // # Method: Aktifkan/nonaktifkan double score
    setDoubleScore(active) {
        this.isDoubleScore = active;
    }

    // # Method: Simpan high score ke localStorage
    saveHighScore() {
        try { localStorage.setItem('snakeHighScore', this.highScore.toString()); } catch(e) {}
    }

    // # Method: Muat high score dari localStorage
    loadHighScore() {
        try { return parseInt(localStorage.getItem('snakeHighScore') || '0', 10); } catch(e) { return 0; }
    }

    // # Method: Update elemen UI skor di dalam canvas HUD
    // # Panel skor hanya diperbarui saat state 'playing'
    updateUI() {
        const scoreEl = document.getElementById('score-value');
        const highEl  = document.getElementById('highscore-value');
        const levelEl = document.getElementById('level-value');
        const foodEl  = document.getElementById('food-progress');

        if (scoreEl) scoreEl.textContent = this.score;
        if (highEl)  highEl.textContent = this.highScore;
        if (levelEl) levelEl.textContent = this.level;
        if (foodEl) {
            const pct = (this.foodEaten / this.foodPerLevel) * 100;
            foodEl.style.width = pct + '%';
        }
    }
}
