// # =====================================================
// # CLASS: FoodManager
// # Mengelola semua item makanan di papan.
// # Selalu menjaga 3 makanan aktif + 1 Bom di papan.
// # =====================================================

class FoodManager {
    // # Konstruktor: Menginisialisasi manager dengan ukuran grid
    constructor(cols, rows) {
        this.cols = cols;
        this.rows = rows;
        // # Array menyimpan semua item makanan/bom aktif
        this.foods = [];
        // # Aturan jumlah objek di layar
        this.targetFoodCount = 3; 
        this.targetBombCount = 1; 

        // # Registry Class untuk menghindari if-else yang panjang
        this.foodRegistry = {
            'RedFood': RedFood,
            'BlueFood': BlueFood,
            'YellowFood': YellowFood,
            'GreenFood': GreenFood,
            'Bomb': Bomb
        };
    }

    // # Method: Membuat objek makanan berdasarkan tipe
    createFood(type, x, y) {
        if (this.foodRegistry[type]) {
            return new this.foodRegistry[type](x, y);
        }
        // # Default fallback jika tipe null (makanan normal kuning)
        // # Asumsi: class Food Anda memiliki constructor(x, y, type, color)
        const food = new Food(x, y, 'normal', '#FFEEAA');
        food.scoreValue = 10;
        return food;
    }

    // # Method: Mencari posisi kosong di grid (tidak menimpa ular/tembok)
    findEmptyPosition(snake, obstacles) {
        let pos;
        let attempts = 0;
        do {
            pos = {
                x: Math.floor(Math.random() * this.cols),
                y: Math.floor(Math.random() * this.rows)
            };
            attempts++;
        } while (
            attempts < 300 && (
                snake.body.some(s => s.x === pos.x && s.y === pos.y) ||
                (obstacles && obstacles.some(o => o.x === pos.x && o.y === pos.y)) ||
                this.foods.some(f => f.x === pos.x && f.y === pos.y)
            )
        );
        return attempts < 300 ? pos : null;
    }

    // # Method: Memilih jenis buah/power-up secara acak (TIDAK TERMASUK BOM)
    selectFoodType() {
        const roll = Math.random();
        if (roll < 0.50) return null;        // # 50% Normal (kuning muda)
        if (roll < 0.65) return 'RedFood';   // # 15% Perisai
        if (roll < 0.80) return 'BlueFood';  // # 15% Slow Motion
        if (roll < 0.90) return 'YellowFood';// # 10% Speed Boost
        return 'GreenFood';                  // # 10% Double Score
    }

    // # Method: Menambahkan buah acak ke papan
    spawnFood(snake, obstacles) {
        const pos = this.findEmptyPosition(snake, obstacles);
        if (!pos) return;
        const type = this.selectFoodType();
        this.foods.push(this.createFood(type, pos.x, pos.y));
    }

    // # Method: Menambahkan bom ke papan
    spawnBomb(snake, obstacles) {
        const pos = this.findEmptyPosition(snake, obstacles);
        if (!pos) return;
        this.foods.push(this.createFood('Bomb', pos.x, pos.y));
    }

    // # Method: Inisialisasi makanan pertama kali di awal game
    initialize(snake, obstacles) {
        this.foods = [];
        
        // Spawn 3 Buah
        for (let i = 0; i < this.targetFoodCount; i++) {
            this.spawnFood(snake, obstacles);
        }
        
        // Spawn 1 Bom
        for(let i = 0; i < this.targetBombCount; i++){
            this.spawnBomb(snake, obstacles);
        }
    }

    // # Method: Memperbarui jumlah makanan/bom setiap frame
    update(snake, obstacles) {
        let currentFoodCount = 0;
        let currentBombCount = 0;

        // # Hitung objek apa saja yang masih ada di arena
        this.foods.forEach(f => {
            if (f.type === 'bomb' || f.constructor.name === 'Bomb') {
                currentBombCount++;
            } else {
                currentFoodCount++;
            }
        });

        // # Jika buah dimakan (kurang dari 3), munculkan buah baru
        while (currentFoodCount < this.targetFoodCount) {
            this.spawnFood(snake, obstacles);
            currentFoodCount++;
        }

        // # Jika bom ditabrak (kurang dari 1), munculkan bom baru
        while (currentBombCount < this.targetBombCount) {
            this.spawnBomb(snake, obstacles);
            currentBombCount++;
        }
    }

    // # Method: Memeriksa apakah kepala ular menabrak sesuatu
    checkCollision(snakeHead) {
        return this.foods.findIndex(f => f.x === snakeHead.x && f.y === snakeHead.y);
    }

    // # Method: Menghapus makanan/bom yang sudah ditabrak
    removeFood(index) {
        this.foods.splice(index, 1);
    }

    // # Method: Menggambar semua makanan/bom di canvas
    draw(ctx, cellSize) {
        this.foods.forEach(food => food.draw(ctx, cellSize));
    }
}