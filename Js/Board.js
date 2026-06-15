// # =====================================================
// # CLASS: Board (Parent/Base Class)
// # Bertugas sebagai template dasar untuk semua jenis papan permainan.
// # Menyimpan konfigurasi ukuran, warna, dan referensi canvas.
// # =====================================================

class Board {
    // # Konstruktor: Menginisialisasi properti dasar papan permainan
    constructor(canvas, cellSize, theme) {
        // # Referensi ke elemen canvas HTML
        this.canvas = canvas;
        // # Konteks 2D untuk menggambar di canvas
        this.ctx = canvas.getContext('2d');
        // # Ukuran satu sel dalam piksel
        this.cellSize = cellSize || 20;
        // # Hitung jumlah kolom berdasarkan lebar canvas
        this.cols = Math.floor(canvas.width / this.cellSize);
        // # Hitung jumlah baris berdasarkan tinggi canvas
        this.rows = Math.floor(canvas.height / this.cellSize);
        // # Tema aktif (objek berisi warna-warna)
        this.theme = theme || THEMES.galaxy;
    }

    // # Method: Menggambar latar belakang papan
    // # Method: Menggambar latar belakang papan
    drawBackground() {
        // 🔥 PERBAIKAN: Cek state game. Jika 'menu', biarkan transparan.
        // Jika sedang 'playing', baru gambar warna background.
        if (window.game && window.game.state === 'menu') {
            return; // Keluar dari fungsi, jangan gambar apa-apa (biarkan tembus pandang)
        }

        this.ctx.fillStyle = this.theme.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // # Method: Menggambar garis grid pada papan
    // # Grid memudahkan pemain melihat batas setiap sel
    drawGrid() {
        this.ctx.strokeStyle = this.theme.grid;
        this.ctx.lineWidth = 0.3;
        // # Gambar garis vertikal grid
        for (let x = 0; x <= this.canvas.width; x += this.cellSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        // # Gambar garis horizontal grid
        for (let y = 0; y <= this.canvas.height; y += this.cellSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    // # Method: Menerapkan tema baru ke papan
    // # Digunakan saat pemain mengganti tema permainan
    setTheme(theme) {
        this.theme = theme;
    }

    // # Method: Menghapus/membersihkan seluruh canvas
    // # Dipanggil setiap frame sebelum menggambar ulang
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // # Method abstrak: Menggambar seluruh papan
    // # Harus di-override oleh child class
    draw() {
        this.clear();
        if (this.game && this.game.arenaLoaded) {
            this.ctx.drawImage(this.game.arenaImage, 0, 0, this.canvas.width, this.canvas.height);
        } else {
            this.drawBackground();
        }
        this.drawGrid();
    }

    // # Method: Mengecek apakah koordinat berada di dalam batas papan
    // # Mengembalikan true jika posisi valid, false jika keluar batas
    isInBounds(x, y) {
        return x >= 0 && x < this.cols && y >= 0 && y < this.rows;
    }

    // Tambahkan fungsi default ini, karena papan normal tidak punya rintangan
isLethalCollision(x, y) {
    return false; 
}

}


