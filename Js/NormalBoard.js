// # =====================================================
// # CLASS: NormalBoard (extends Board)
// # Papan permainan standar tanpa rintangan.
// # Semua sel dapat dilalui ular secara bebas.
// # =====================================================

class NormalBoard extends Board {
    // # Konstruktor: Memanggil constructor parent Board
    constructor(canvas, cellSize, theme) {
        super(canvas, cellSize, theme);
        // # Tipe papan untuk identifikasi
        this.type = 'normal';
    }

    // # Method Override: Menggambar papan normal
    // # Hanya menggambar background dan grid, tanpa rintangan
    draw() {
        // # Panggil method draw() dari parent class
        super.draw();
    }
}
