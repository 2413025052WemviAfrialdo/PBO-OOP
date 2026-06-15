// # CLASS: GreenFood — Memberikan DOUBLE SCORE
// # Semua poin berlipat ganda selama 6 detik

class GreenFood extends Food {
    constructor(x, y) {
        super(x, y, 'double', '#44CC44');
        this.scoreValue = 20;
        this.effectDuration = 6000;
        // # TEMPAT IMPORT GAMBAR DI SINI
        this.image.src = 'Asset/4.png';
        // # TEMPAT IMPORT AUDIO DI SINI
        this.eatSound = new Audio();
        this.eatSound.src = 'Audio/makan.mp3';
    }

    // # Gambar lingkaran hijau dengan tanda x2
    draw(ctx, cellSize) {
        const px = this.x * cellSize;
        const py = this.y * cellSize;
        const pulse = 1 + Math.sin(this.pulseAngle) * 0.1;
        const r = ((cellSize - 4) / 2) * pulse;
        const cx = px + cellSize / 2;
        const cy = py + cellSize / 2;

        if (this.imageLoaded) {
            const itemSize = cellSize * 1.5;
            const offset = (cellSize - itemSize) / 2;
            ctx.drawImage(this.image, px + offset, py + offset, itemSize, itemSize);
        } else {
            ctx.save();
            ctx.shadowColor = '#44CC44';
            ctx.shadowBlur = 10;
            ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fillStyle = '#44CC44'; ctx.fill();
            ctx.restore();
            ctx.fillStyle = '#fff';
            ctx.font = `bold ${Math.floor(r * 0.8)}px Arial`;
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('×2', cx, cy);
        }
        this.pulseAngle += 0.08;
    }

    // # Aktifkan double score via game.setDoubleScore()
    applyEffect(snake, game) {
        if (this.eatSound.src) this.eatSound.play().catch(() => {});
        game.setDoubleScore(true, this.effectDuration);
        game.showPowerUpMessage('×2 DOUBLE SCORE! Semua poin x2 selama 6 detik!', '#44CC44');
    }

    getDescription() { return 'Double Score: Poin x2 selama 6 detik'; }
}