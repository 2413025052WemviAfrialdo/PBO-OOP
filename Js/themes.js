// # =====================================================
// # THEMES: Definisi semua tema visual game Snake
// # Setiap tema memiliki warna berbeda untuk berbagai elemen game.
// # Tema tersedia: galaxy (Galaksi), cloud (Awan), forest (Hutan), ocean (Laut)
// # =====================================================

const THEMES = {
    // # TEMA GALAKSI: Latar hitam gelap dengan aksen biru/ungu
    galaxy: {
        name: "Galaksi",
        background: "#0a0a1a",
        grid: "rgba(100, 100, 255, 0.07)",
        snakeHead: "#a78bfa",
        snakeBody: "#7c3aed",
        obstacle: "#4a1572",
        obstacleStroke: "#9d4edd",
        panelBg: "rgba(10, 10, 30, 0.95)",
        panelBorder: "#4a4aff",
        text: "#e0d7ff",
        accent: "#a78bfa",
        buttonBg: "#3d1cb3",
        buttonText: "#e0d7ff",
        titleColor: "#c4b5fd",
        // # Efek glow bintang latar belakang
        bgImage: "Asset/Background/galaxy-bg.png",
        starsEnabled: true,
    },

    // # TEMA AWAN: Latar biru muda cerah dengan nuansa langit siang
    cloud: {
        name: "Awan",
        background: "#87CEEB", // lebih natural sky
        grid: "rgba(255, 255, 255, 0.25)",

        snakeHead: "#0ea5e9",
        snakeBody: "#38bdf8",

        obstacle: "#cbd5f5",
        obstacleStroke: "#94a3b8",

        panelBg: "#0284c7", // lebih terang biar kontras
        panelBorder: "#60a5fa",

        text: "white", // 🔥 FIX: lebih gelap (biar kebaca)
        accent: "white",

        buttonBg: "#0284c7",
        buttonText: "#ffffff",

        titleColor: "white  ", // lebih bold dari text biasa

        bgImage: "Asset/Background/cloud-bg.png",
        starsEnabled: false,
    },

    // # TEMA HUTAN: Latar hijau gelap dengan nuansa alam terbuka
    forest: {
        name: "Hutan",
        background: "#0d1f0d",
        grid: "rgba(50, 150, 50, 0.08)",
        snakeHead: "#86efac",
        snakeBody: "#22c55e",
        obstacle: "#5c3e1e",
        obstacleStroke: "#a16207",
        panelBg: "rgba(13, 31, 13, 0.95)",
        panelBorder: "#16a34a",
        text: "#bbf7d0",
        accent: "#4ade80",
        buttonBg: "#15803d",
        buttonText: "#f0fdf4",
        titleColor: "#86efac",
        bgImage: "Asset/Background/forest-bg.png",
        starsEnabled: false,
    },

    // # TEMA LAUT: Latar biru laut gelap dengan aksen cyan/teal
    ocean: {
        name: "Laut",
        background: "#021421",
        grid: "rgba(0, 150, 200, 0.07)",
        snakeHead: "#22d3ee",
        snakeBody: "#0891b2",
        obstacle: "#164e63",
        obstacleStroke: "#06b6d4",
        panelBg: "rgba(2, 20, 33, 0.95)",
        panelBorder: "#0e7490",
        text: "#a5f3fc",
        accent: "#22d3ee",
        buttonBg: "#0e7490",
        buttonText: "#ecfeff",
        titleColor: "#67e8f9",
        bgImage: "Asset/Background/ocean-bg.png",
        starsEnabled: false,
    },
};
