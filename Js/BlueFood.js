class BlueFood extends Food {
    constructor(x, y) {
        super(x, y, 'slowmo', '#4488FF');
        this.scoreValue = 12;
        this.effectDuration = 5000;

        // --- PROSES IMPORT GAMBAR ---
        this.image = new Image();
        this.imageLoaded = false; // Penanda agar sistem tahu kapan gambar siap digambar
        this.image.src = 'Asset/5.png';

        // Set menjadi true saat gambar selesai dimuat oleh browser
        this.image.onload = () => {
            this.imageLoaded = true;
        };

        // --- PROSES IMPORT AUDIO ---
        this.eatSound = new Audio();
        this.eatSound.src = 'Audio/makan.mp3';
    }

    // Gambar lingkaran biru dengan simbol jam (atau gambar jika sudah load)
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
            // Gambar cadangan (fallback) jika gambar PNG gagal dimuat atau sedang proses
            ctx.save();
            ctx.shadowColor = '#4488FF';
            ctx.shadowBlur = 10;
            ctx.beginPath(); 
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fillStyle = '#4488FF'; 
            ctx.fill();
            ctx.restore();
            
            // Simbol jam ⏱ sebagai pengganti sementara
            ctx.font = `bold ${Math.floor(r * 1.1)}px Arial`;
            ctx.textAlign = 'center'; 
            ctx.textBaseline = 'middle';
            ctx.fillText('⏱', cx, cy + 1);
        }
        this.pulseAngle += 0.08;
    }

    // Aktifkan slow motion via game.setSlowMotion()
    applyEffect(snake, game) {
        // Mainkan suara jika file audio tersedia
        if (this.eatSound.src) {
            this.eatSound.play().catch((err) => {
                console.log("Audio gagal diputar (butuh interaksi user):", err);
            });
        }
        
        game.setSlowMotion(true, this.effectDuration);
        game.showPowerUpMessage('⏱ SLOW MOTION! Waktu melambat selama 5 detik!', '#66aaff');
    }

    getDescription() { 
        return 'Slow Motion: Melambat 5 detik'; 
    }
}