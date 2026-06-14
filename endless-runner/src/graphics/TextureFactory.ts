import Phaser from 'phaser';

export class TextureFactory {
  static createAll(scene: Phaser.Scene): void {
    const g = scene.add.graphics();

    this.createNinja(g);
    this.createBarricade(g);
    this.createDrone(g);
    this.createShuriken(g);
    this.createCoin(g, 'coin-gold', 0xffd700, 0xffaa00, 36);
    this.createCoin(g, 'coin-silver', 0xc0c0c0, 0x909090, 30);
    this.createCoin(g, 'coin-bronze', 0xcd7f32, 0xa0522d, 26);
    this.createBandaid(g);
    this.createShield(g);
    this.createBoot(g);
    this.createBgSky(g);
    this.createBgFar(g);
    this.createBgMid(g);

    g.destroy();
  }

  private static createNinja(g: Phaser.GameObjects.Graphics): void {
    g.clear();
    // Body
    g.fillStyle(0x1a1a2e, 1);
    g.fillRoundedRect(8, 16, 24, 26, 4);
    // Head
    g.fillCircle(20, 10, 10);
    // White mask band
    g.fillStyle(0xffffff, 0.9);
    g.fillRect(8, 7, 24, 6);
    // Red eyes
    g.fillStyle(0xff2244, 1);
    g.fillCircle(14, 10, 2);
    g.fillCircle(26, 10, 2);
    // Cyan scarf
    g.fillStyle(0x00f5ff, 0.9);
    g.fillRect(12, 22, 16, 3);
    // Cyan arm accents
    g.fillStyle(0x00f5ff, 0.6);
    g.fillRect(4, 20, 5, 2);
    g.fillRect(31, 20, 5, 2);
    // Legs
    g.fillStyle(0x1a1a2e, 1);
    g.fillRect(10, 42, 8, 8);
    g.fillRect(22, 42, 8, 8);
    // Feet (slightly darker)
    g.fillStyle(0x0d0d1a, 1);
    g.fillRect(8, 48, 10, 4);
    g.fillRect(22, 48, 10, 4);
    g.generateTexture('ninja', 40, 52);
  }

  private static createBarricade(g: Phaser.GameObjects.Graphics): void {
    g.clear();
    // Dark base
    g.fillStyle(0x2a2a4a, 1);
    g.fillRoundedRect(0, 0, 40, 60, 3);
    // Orange hazard stripes
    g.fillStyle(0xff6600, 1);
    g.fillRect(0, 10, 40, 8);
    g.fillRect(0, 26, 40, 8);
    g.fillRect(0, 42, 40, 8);
    // Border
    g.lineStyle(1, 0x444466, 1);
    g.strokeRoundedRect(0, 0, 40, 60, 3);
    // Warning light (top center)
    g.fillStyle(0xff0044, 1);
    g.fillCircle(20, 4, 3);
    g.generateTexture('barricade', 40, 60);
  }

  private static createDrone(g: Phaser.GameObjects.Graphics): void {
    g.clear();
    // Arms
    g.fillStyle(0x444466, 1);
    g.fillRect(0, 10, 50, 4);
    // Body
    g.fillStyle(0x333355, 1);
    g.fillRoundedRect(12, 4, 26, 18, 4);
    // Propeller discs
    g.fillStyle(0x888899, 0.7);
    g.fillEllipse(6, 12, 14, 6);
    g.fillEllipse(44, 12, 14, 6);
    // Sensor eye
    g.fillStyle(0x00ff44, 1);
    g.fillCircle(25, 13, 4);
    g.fillStyle(0x00aa33, 1);
    g.fillCircle(25, 13, 2);
    // Body detail
    g.lineStyle(1, 0x6666aa, 0.5);
    g.strokeRect(14, 6, 22, 14);
    g.generateTexture('drone', 50, 26);
  }

  private static createShuriken(g: Phaser.GameObjects.Graphics): void {
    g.clear();
    const cx = 14, cy = 14;
    g.fillStyle(0xc0c0ff, 1);
    g.fillPoints([
      { x: cx, y: 0 },
      { x: cx + 5, y: cy - 5 },
      { x: cx * 2, y: cy },
      { x: cx + 5, y: cy + 5 },
      { x: cx, y: cy * 2 },
      { x: cx - 5, y: cy + 5 },
      { x: 0, y: cy },
      { x: cx - 5, y: cy - 5 },
    ], true);
    // Cyan center glow
    g.fillStyle(0x00f5ff, 0.5);
    g.fillCircle(cx, cy, 4);
    g.generateTexture('shuriken', 28, 28);
  }

  private static createCoin(
    g: Phaser.GameObjects.Graphics,
    key: string,
    outerColor: number,
    innerColor: number,
    size: number
  ): void {
    g.clear();
    const r = size / 2;
    const cx = r, cy = r;
    // Outer circle
    g.fillStyle(outerColor, 1);
    g.fillCircle(cx, cy, r - 1);
    // Inner circle
    g.fillStyle(innerColor, 1);
    g.fillCircle(cx, cy, r - 5);
    // Vertical lines (古銭風)
    g.fillStyle(outerColor, 0.7);
    g.fillRect(cx - 5, cy - (r - 7), 2, (r - 7) * 2);
    g.fillRect(cx - 1, cy - (r - 7), 2, (r - 7) * 2);
    g.fillRect(cx + 3, cy - (r - 7), 2, (r - 7) * 2);
    // Rim highlight
    g.lineStyle(1, 0xffffff, 0.35);
    g.strokeCircle(cx, cy, r - 1);
    g.generateTexture(key, size, size);
  }

  private static createBandaid(g: Phaser.GameObjects.Graphics): void {
    g.clear();
    // Main strip
    g.fillStyle(0xf5deb3, 1);
    g.fillRect(0, 3, 36, 10);
    // Left pad
    g.fillStyle(0xffb6c1, 1);
    g.fillRect(0, 0, 10, 16);
    // Right pad
    g.fillRect(26, 0, 10, 16);
    // Center gauze
    g.fillStyle(0xffffff, 0.9);
    g.fillRect(11, 4, 14, 8);
    // Gauze dots
    g.fillStyle(0xffccdd, 0.8);
    g.fillCircle(15, 8, 1.5);
    g.fillCircle(19, 6, 1.5);
    g.fillCircle(23, 8, 1.5);
    g.fillCircle(19, 10, 1.5);
    g.generateTexture('bandaid', 36, 16);
  }

  private static createShield(g: Phaser.GameObjects.Graphics): void {
    g.clear();
    const pts = [
      { x: 2, y: 2 }, { x: 30, y: 2 },
      { x: 30, y: 22 }, { x: 16, y: 34 }, { x: 2, y: 22 },
    ];
    g.fillStyle(0x4488cc, 1);
    g.fillPoints(pts, true);
    g.lineStyle(2, 0xffd700, 1);
    g.strokePoints(pts, true);
    // Cross emblem
    g.lineStyle(2, 0xffd700, 0.85);
    g.lineBetween(16, 8, 16, 26);
    g.lineBetween(10, 16, 22, 16);
    g.generateTexture('shield', 32, 36);
  }

  private static createBoot(g: Phaser.GameObjects.Graphics): void {
    g.clear();
    // Shoe upper
    g.fillStyle(0xffffff, 1);
    g.fillRoundedRect(4, 2, 22, 14, 4);
    // Toe box
    g.fillRoundedRect(22, 8, 10, 10, 3);
    // Sole
    g.fillStyle(0x0066ff, 1);
    g.fillRoundedRect(2, 16, 30, 5, 2);
    // Lace detail
    g.lineStyle(1, 0xaaaaaa, 0.5);
    g.lineBetween(7, 10, 18, 10);
    // Motion lines
    g.fillStyle(0x00f5ff, 0.8);
    g.fillRect(4, 23, 24, 2);
    g.fillStyle(0x00f5ff, 0.5);
    g.fillRect(7, 27, 20, 2);
    g.fillStyle(0x00f5ff, 0.25);
    g.fillRect(10, 31, 16, 2);
    g.generateTexture('boot', 32, 34);
  }

  private static createBgSky(g: Phaser.GameObjects.Graphics): void {
    g.clear();
    g.fillGradientStyle(0x1a0b2e, 0x1a0b2e, 0x0d1b2a, 0x0d1b2a, 1);
    g.fillRect(0, 0, 800, 450);
    // Stars (fixed positions)
    const stars: [number, number, number][] = [
      [50, 30, 1], [120, 80, 1], [200, 20, 2], [300, 60, 1], [400, 40, 1],
      [500, 90, 1], [600, 25, 2], [700, 70, 1], [150, 120, 1], [350, 100, 1],
      [550, 50, 1], [750, 110, 1], [80, 150, 2], [250, 140, 1], [450, 130, 1],
      [650, 145, 1], [30, 200, 1], [180, 190, 2], [380, 180, 1], [580, 195, 1],
      [780, 170, 1], [100, 250, 1], [320, 240, 1], [520, 230, 2], [720, 260, 1],
      [60, 300, 1], [260, 290, 1], [460, 310, 1], [660, 285, 1], [760, 320, 1],
      [25, 60, 1], [480, 170, 2], [170, 60, 1], [410, 320, 1], [630, 55, 1],
    ];
    g.fillStyle(0xffffff, 1);
    for (const [sx, sy, sr] of stars) {
      g.fillCircle(sx, sy, sr);
    }
    g.generateTexture('bg-sky', 800, 450);
  }

  private static createBgFar(g: Phaser.GameObjects.Graphics): void {
    g.clear();
    // Far building silhouettes (dark purple-navy)
    g.fillStyle(0x111133, 1);
    const buildings: [number, number, number, number][] = [
      [0, 80, 50, 220], [55, 40, 40, 260], [100, 100, 55, 200],
      [160, 60, 35, 240], [200, 20, 50, 280], [255, 80, 45, 220],
      [305, 50, 40, 250], [350, 90, 48, 210],
    ];
    for (const [bx, by, bw, bh] of buildings) {
      g.fillRect(bx, by, bw, bh);
    }
    // Cyan neon windows
    g.fillStyle(0x00f5ff, 0.5);
    const cyanWins: [number, number, number, number][] = [
      [5, 120, 6, 3], [5, 132, 6, 3], [20, 112, 6, 3],
      [65, 80, 6, 3], [80, 90, 6, 3], [65, 100, 6, 3],
      [110, 140, 6, 3], [128, 130, 6, 3],
      [168, 100, 6, 3], [184, 112, 6, 3],
      [210, 60, 6, 3], [226, 50, 6, 3], [210, 75, 6, 3],
      [264, 120, 6, 3], [280, 132, 6, 3],
      [314, 90, 6, 3], [330, 100, 6, 3],
      [358, 130, 6, 3], [374, 140, 6, 3],
    ];
    for (const [wx, wy, ww, wh] of cyanWins) {
      g.fillRect(wx, wy, ww, wh);
    }
    // Pink/red accent windows
    g.fillStyle(0xff2266, 0.5);
    const redWins: [number, number, number, number][] = [
      [12, 104, 8, 3], [170, 72, 8, 3], [215, 46, 8, 3], [360, 100, 8, 3],
    ];
    for (const [wx, wy, ww, wh] of redWins) {
      g.fillRect(wx, wy, ww, wh);
    }
    g.generateTexture('bg-far', 400, 300);
  }

  private static createBgMid(g: Phaser.GameObjects.Graphics): void {
    g.clear();
    // Closer buildings (darker)
    g.fillStyle(0x0d0d22, 1);
    const buildings: [number, number, number, number][] = [
      [0, 50, 40, 250], [45, 70, 30, 230], [80, 30, 50, 270],
      [135, 60, 35, 240], [175, 20, 45, 280], [225, 55, 30, 245],
      [260, 40, 38, 260],
    ];
    for (const [bx, by, bw, bh] of buildings) {
      g.fillRect(bx, by, bw, bh);
    }
    // Brighter cyan windows (closer = more visible)
    g.fillStyle(0x00f5ff, 0.7);
    const cyanWins: [number, number, number, number][] = [
      [4, 90, 8, 4], [4, 106, 8, 4], [20, 96, 8, 4],
      [52, 112, 8, 4], [68, 124, 8, 4],
      [88, 70, 8, 4], [104, 82, 8, 4], [88, 94, 8, 4],
      [142, 100, 8, 4], [158, 114, 8, 4],
      [183, 60, 8, 4], [200, 72, 8, 4], [183, 84, 8, 4],
      [232, 95, 8, 4], [248, 108, 8, 4],
      [266, 80, 8, 4], [284, 94, 8, 4],
    ];
    for (const [wx, wy, ww, wh] of cyanWins) {
      g.fillRect(wx, wy, ww, wh);
    }
    // Pink neon signs
    g.fillStyle(0xff44aa, 0.7);
    const signs: [number, number, number, number][] = [
      [6, 76, 24, 5], [88, 56, 28, 5], [183, 46, 26, 5], [268, 66, 22, 5],
    ];
    for (const [sx, sy, sw, sh] of signs) {
      g.fillRect(sx, sy, sw, sh);
    }
    g.generateTexture('bg-mid', 298, 300);
  }
}
