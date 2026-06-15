// # CLASS: YellowFood — Memberikan SPEED BOOST
// # Kecepatan ular sangat cepat selama 4 detik

class YellowFood extends Food {
    constructor(x, y) {
        super(x, y, 'speed', '#FFD700');
        this.scoreValue = 12;
        this.effectDuration = 4000;
        // # TEMPAT IMPORT GAMBAR DI SINI
        this.image.src = 'Asset/1.png';
        // # TEMPAT IMPORT AUDIO DI SINI
        this.eatSound = new Audio();
        this.eatSound.src = 'Audio/makan.mp3';
    }

    // # Gambar lingkaran kuning dengan simbol petir
    draw(ctx, cellSize) {
        const px = this.x * cellSize;
        const py = this.y * cellSize;
        const pulse = 1 + Math.sin(this.pulseAngle) * 0.13;
        const r = ((cellSize - 4) / 2) * pulse;
        const cx = px + cellSize / 2;
        const cy = py + cellSize / 2;

        if (this.imageLoaded) {
            const itemSize = cellSize * 1.5;
            const offset = (cellSize - itemSize) / 2;
            ctx.drawImage(this.image, px + offset, py + offset, itemSize, itemSize);
        } else {
            ctx.save();
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 12;
            ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fillStyle = '#FFD700'; ctx.fill();
            ctx.restore();
            ctx.font = `bold ${Math.floor(r * 1.1)}px Arial`;
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('⚡', cx, cy + 1);
        }
        this.pulseAngle += 0.11;
    }

    // # Aktifkan speed boost via game.setSpeedBoost()
    applyEffect(snake, game) {
        if (this.eatSound.src) this.eatSound.play().catch(() => {});
        game.setSpeedBoost(true, this.effectDuration);
        game.showPowerUpMessage('⚡ SPEED BOOST! Super cepat selama 4 detik!', '#FFD700');
    }

    getDescription() { return 'Speed Boost: Sangat cepat 4 detik'; }
}
