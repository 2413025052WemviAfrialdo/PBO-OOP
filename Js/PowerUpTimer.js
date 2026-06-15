// # =====================================================
// # CLASS: PowerUpTimer
// # Mengelola timer countdown untuk semua efek power-up aktif.
// # Memantau waktu tersisa dan menonaktifkan efek saat habis.
// # =====================================================

class PowerUpTimer {
    // # Konstruktor: Membuat container daftar power-up aktif
    constructor() {
        // # Map menyimpan power-up aktif: nama -> { endTime, color, label }
        this.activeEffects = new Map();
    }

    // # Method: Menambahkan power-up baru ke daftar aktif
    // # name: ID unik, duration: durasi ms, color: warna tampilan, label: nama
    addEffect(name, duration, color, label) {
        this.activeEffects.set(name, {
            endTime: Date.now() + duration,
            color: color || '#ffffff',
            label: label || name
        });
        // # Perbarui tampilan UI segera setelah menambahkan
        this.updateUI();
    }

    // # Method: Menghapus satu power-up dari daftar aktif
    // # Dipanggil saat efek berakhir atau di-reset
    removeEffect(name) {
        this.activeEffects.delete(name);
        this.updateUI();
    }

    // # Method: Mengecek apakah power-up tertentu masih aktif
    // # Mengembalikan true jika efek masih aktif
    isActive(name) {
        if (!this.activeEffects.has(name)) return false;
        const effect = this.activeEffects.get(name);
        return Date.now() < effect.endTime;
    }

    // # Method: Menghitung waktu tersisa power-up dalam detik
    // # Mengembalikan 0 jika efek tidak aktif atau sudah habis
    getTimeRemaining(name) {
        if (!this.activeEffects.has(name)) return 0;
        const effect = this.activeEffects.get(name);
        return Math.max(0, Math.ceil((effect.endTime - Date.now()) / 1000));
    }

    // # Method: Memperbarui status semua power-up dan hapus yang sudah habis
    // # Harus dipanggil setiap frame game loop
    // # Mengembalikan array nama power-up yang baru saja berakhir
    update() {
        const expired = [];
        const now = Date.now();

        // # Periksa setiap power-up aktif
        this.activeEffects.forEach((effect, name) => {
            if (now >= effect.endTime) {
                expired.push(name);
            }
        });

        // # Hapus yang sudah kadaluarsa
        expired.forEach(name => this.activeEffects.delete(name));

        // # Perbarui UI jika ada yang dihapus
        if (expired.length > 0) this.updateUI();

        return expired;
    }

    // # Method: Memperbarui tampilan panel power-up di HTML
    // # Menampilkan daftar efek aktif beserta sisa waktunya
    updateUI() {
        const container = document.getElementById('powerup-display');
        if (!container) return;

        // # Hapus semua isi kontainer
        container.innerHTML = '';
        const now = Date.now();

        // # Buat elemen UI untuk setiap power-up aktif
        this.activeEffects.forEach((effect, name) => {
            const remaining = Math.max(0, Math.ceil((effect.endTime - now) / 1000));
            if (remaining <= 0) return;

            // # Buat div untuk satu power-up
            const el = document.createElement('div');
            el.className = 'powerup-item';
            el.style.borderColor = effect.color;
            el.style.color = effect.color;

            // # Hitung persentase waktu tersisa untuk progress bar
            const totalDuration = (effect.endTime - now + remaining * 1000) / 1000;
            const pct = (remaining / (totalDuration)) * 100;

            el.innerHTML = `
                <span class="powerup-label">${effect.label}</span>
                <span class="powerup-time">${remaining}s</span>
                <div class="powerup-bar">
                    <div class="powerup-bar-fill" style="width:${pct}%; background:${effect.color}"></div>
                </div>
            `;
            container.appendChild(el);
        });
    }

    // # Method: Menghapus semua power-up aktif sekaligus
    // # Dipanggil saat game over atau restart
    clearAll() {
        this.activeEffects.clear();
        this.updateUI();
    }
}