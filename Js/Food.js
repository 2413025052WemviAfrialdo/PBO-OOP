// # =====================================================
// # CLASS: Food (Parent/Base Class untuk semua jenis makanan)
// # Mendefinisikan struktur dan perilaku dasar semua item makanan.
// # Setiap subclass mewarisi properti ini dan mengoverride sesuai kebutuhan.
// # =====================================================

class Food {
    // # Konstruktor: Menginisialisasi makanan dengan posisi dan tipe
    // # x, y: posisi grid, type: nama jenis makanan, color: warna visual
    constructor(x, y, type, color) {
        // # Posisi horizontal pada grid
        this.x = x;
        // # Posisi vertikal pada grid
        this.y = y;
        // # Nama/tipe makanan (dipakai untuk identifikasi)
        this.type = type || 'food';
        // # Warna default makanan
        this.color = color || '#ffffff';
        // # Nilai skor yang diberikan saat dimakan
        this.scoreValue = 10;
        // # Durasi efek power-up dalam milidetik (0 = tidak ada efek)
        this.effectDuration = 0;
        // # Gambar makanan (placeholder)
        // # TEMPAT IMPORT GAMBAR DI SINI
        this.image = new Image();
        // this.image.src = 'assets/food_default.png'; // # Aktifkan baris ini saat file gambar sudah tersedia
        this.imageLoaded = false;
        this.image.onload = () => { this.imageLoaded = true; };
        // ===== AUDIO (TARUH DI SINI) =====
        this.eatSound = new Audio(); // default kosong
        // # Animasi kedipan (pulse) untuk visual menarik
        this.pulseAngle = 0;
    }

    // # Method: Menggambar makanan di canvas
    // # Menggunakan gambar jika tersedia, atau lingkaran berwarna
    draw(ctx, cellSize) {
        const px = this.x * cellSize;
        const py = this.y * cellSize;
        const itemSize = cellSize * 1.0;
        const offset = (cellSize - itemSize) / 2;
        const pulse = 1 + Math.sin(this.pulseAngle) * 0.06;
        const size = itemSize * pulse;
        const drawOffset = (cellSize - size) / 2;

        if (this.imageLoaded) {
            // # Gambar dengan gambar jika sudah dimuat
            ctx.drawImage(this.image, px + drawOffset, py + drawOffset, size, size);
        } else {
            // # Gambar lingkaran berwarna sebagai fallback
            ctx.beginPath();
            ctx.arc(px + cellSize / 2, py + cellSize / 2, size / 2, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            // # Tambah efek kilau
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }
        // # Update sudut animasi pulse setiap frame
        this.pulseAngle += 0.08;
    }

    // # Method: Mengaktifkan efek power-up saat dimakan
    // # Dioverride oleh masing-masing subclass Food
    applyEffect(snake, game) {
        // # Implementasi dasar: hanya tambah skor
    }

    // # Method: Mendapatkan deskripsi efek makanan
    // # Digunakan untuk menampilkan info di UI
    getDescription() {
        return 'Makanan biasa';
    }
}
