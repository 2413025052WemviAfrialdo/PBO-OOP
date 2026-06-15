// # CLASS: Bomb — Memberikan DAMAGE (Game Over)
// # Langsung Game Over saat dimakan, kecuali perisai aktif

class Bomb extends Food {
    constructor(x, y) {
        super(x, y, 'bomb', '#222');
        this.scoreValue = 0;
        this.effectDuration = 0;
        this.rotateAngle = 0;
        // # TEMPAT IMPORT GAMBAR DI SINI
        this.image.src = 'Asset/3.png';
        // # TEMPAT IMPORT AUDIO DI SINI
        this.explodeSound = new Audio();
        // this.explodeSound.src = 'Audio/bomb_explode.mp3';
    }

    // # Gambar bom berputar dengan animasi sumbu api
    draw(ctx, cellSize) {
        const px = this.x * cellSize;
        const py = this.y * cellSize;
        const cx = px + cellSize / 2;
        const cy = py + cellSize / 2;
        const r = (cellSize - 6) / 2;

        if (this.imageLoaded) {
            ctx.save();
            ctx.translate(cx, cy); ctx.rotate(this.rotateAngle);
            ctx.drawImage(this.image, -r, -r, r * 2, r * 2);
            ctx.restore();
        } else {
            ctx.save();
            ctx.shadowColor = '#FF3300'; ctx.shadowBlur = 14;
            ctx.translate(cx, cy); ctx.rotate(this.rotateAngle);
            // # Badan bom
            ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.fillStyle = '#1a1a1a'; ctx.fill();
            ctx.strokeStyle = '#555'; ctx.lineWidth = 1.5; ctx.stroke();
            // # Sumbu
            ctx.strokeStyle = '#aaa'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(2, -r); ctx.bezierCurveTo(7, -r - 5, 11, -r + 2, 9, -r + 7); ctx.stroke();
            // # Api
            ctx.fillStyle = '#FF6600';
            ctx.beginPath(); ctx.arc(9, -r + 7, 2.5, 0, Math.PI * 2); ctx.fill();
            // # Tanda seru
            ctx.fillStyle = '#FF3333';
            ctx.font = `bold ${Math.floor(r)}px Arial`;
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('!', 0, 1);
            ctx.restore();
        }
        this.rotateAngle += 0.05;
        this.pulseAngle += 0.08;
    }

    // # Efek bom: langsung Game Over kecuali perisai aktif
    applyEffect(snake, game) {
        if (this.explodeSound.src) this.explodeSound.play().catch(() => {});
        if (snake.hasShield) {
            game.showPowerUpMessage('🛡 Perisai melindungimu dari BOM!', '#FF6688');
        } else {
            // # Game Over langsung karena bom
            game.handleGameOver('Memakan bom! 💣');
        }
    }

    getDescription() { return 'Bom: Game Over jika dimakan!'; }
}
