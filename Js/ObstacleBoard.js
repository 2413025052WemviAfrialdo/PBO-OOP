// # =====================================================
// # CLASS: ObstacleBoard (extends Board)
// # Papan permainan dengan rintangan statis.
// # Ular akan mati jika menabrak rintangan.
// # =====================================================

class ObstacleBoard extends Board {
    // # Konstruktor: Menginisialisasi papan dengan daftar rintangan
    constructor(canvas, cellSize, theme) {
        super(canvas, cellSize, theme);
        // # Tipe papan untuk identifikasi
        this.type = 'obstacle';
        // # Array menyimpan posisi semua rintangan { x, y }
        this.obstacles = [];
        // # Gambar untuk rintangan (placeholder)
        // # TEMPAT IMPORT GAMBAR DI SINI
        this.obstacleImage = new Image();
        // this.obstacleImage.src = 'assets/obstacle.png'; // # Aktifkan baris ini saat file gambar sudah tersedia
        this.obstacleImageLoaded = false;
        this.obstacleImage.onload = () => { this.obstacleImageLoaded = true; };
        // # Generate rintangan secara acak saat papan dibuat
        this.generateObstacles();
    }

    // # Method: Membuat rintangan secara acak di papan
    // # Rintangan ditempatkan di tepi dalam papan, bukan di tengah
    generateObstacles() {
        this.obstacles = [];
        const numObstacles = 12;
        // # Area aman di tengah (ular muncul di sini)
        const safeZoneX = Math.floor(this.cols / 2) - 3;
        const safeZoneY = Math.floor(this.rows / 2) - 3;

        let count = 0;
        let attempts = 0;
        // # Buat rintangan hingga jumlah yang diinginkan tercapai
        while (count < numObstacles && attempts < 500) {
            attempts++;
            const x = Math.floor(Math.random() * (this.cols - 2)) + 1;
            const y = Math.floor(Math.random() * (this.rows - 2)) + 1;
            // # Skip jika berada di zona aman tengah
            if (Math.abs(x - safeZoneX) < 4 && Math.abs(y - safeZoneY) < 4) continue;
            // # Skip jika posisi sudah ada rintangan
            if (this.isObstacle(x, y)) continue;
            this.obstacles.push({ x, y });
            count++;
        }
    }

    // # Method: Mengecek apakah posisi merupakan rintangan
    // # Mengembalikan true jika ada rintangan di koordinat tersebut
    isObstacle(x, y) {
        return this.obstacles.some(o => o.x === x && o.y === y);
    }

    // Meng-override method dari Board.js agar rintangan menjadi mematikan (LSP)
    isLethalCollision(x, y) {
        return this.isObstacle(x, y);
    }


    // # Method Override: Menggambar papan beserta semua rintangan
    // # Dipanggil setiap frame game loop
    draw() {
        // # Panggil method draw() dari parent untuk background & grid
        super.draw();
        // # Gambar setiap rintangan
        this.obstacles.forEach(obs => {
            const px = obs.x * this.cellSize;
            const py = obs.y * this.cellSize;
            if (this.obstacleImageLoaded) {
                // # Gambar dengan gambar jika sudah dimuat
                this.ctx.drawImage(this.obstacleImage, px, py, this.cellSize, this.cellSize);
            } else {
                // # Gambar dengan warna tema jika gambar belum dimuat
                this.ctx.fillStyle = this.theme.obstacle;
                this.ctx.fillRect(px + 1, py + 1, this.cellSize - 2, this.cellSize - 2);
                // # Tambah detail visual berupa border
                this.ctx.strokeStyle = this.theme.obstacleStroke;
                this.ctx.lineWidth = 1.5;
                this.ctx.strokeRect(px + 1, py + 1, this.cellSize - 2, this.cellSize - 2);
                // # Tambah tanda silang agar mudah dibedakan
                this.ctx.beginPath();
                this.ctx.moveTo(px + 3, py + 3);
                this.ctx.lineTo(px + this.cellSize - 3, py + this.cellSize - 3);
                this.ctx.moveTo(px + this.cellSize - 3, py + 3);
                this.ctx.lineTo(px + 3, py + this.cellSize - 3);
                this.ctx.stroke();
            }
        });
    }
}
