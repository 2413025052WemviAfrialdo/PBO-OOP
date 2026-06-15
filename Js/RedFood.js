// # CLASS: RedFood — Memberikan PERISAI (Shield)
// # Ular tidak bisa mati karena tabrakan selama 5 detik

class RedFood extends Food {
    constructor(x, y) {
        super(x, y, 'shield', '#FF4455');
        this.scoreValue = 15;
        this.effectDuration = 5000;
        // # TEMPAT IMPORT GAMBAR DI SINI
        this.image.src = 'Asset/2.png';
        // # TEMPAT IMPORT AUDIO DI SINI
        this.eatSound = new Audio();
        this.eatSound.src = 'Audio/makan.mp3';
    }

    // # Gambar makanan merah berupa lingkaran dengan simbol perisai
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
            // # Glow merah
            ctx.save();
            ctx.shadowColor = '#FF4455';
            ctx.shadowBlur = 10;
            ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fillStyle = '#FF4455'; ctx.fill();
            ctx.restore();
            // # Ikon perisai
            ctx.font = `bold ${Math.floor(r * 1.1)}px Arial`;
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('🛡', cx, cy + 1);
        }
        this.pulseAngle += 0.09;
    }

    // # Aktifkan efek perisai melalui method game.activateShield()
    applyEffect(snake, game) {
        if (this.eatSound.src) this.eatSound.play().catch(() => {});
        game.activateShield(this.effectDuration);
        game.showPowerUpMessage('🛡 PERISAI AKTIF! Tidak bisa mati selama 5 detik!', '#FF6688');
    }

    getDescription() { return 'Shield: Kebal 5 detik'; }
}