import Phaser from 'phaser';

export class TextureFactory {
  static createAll(scene: Phaser.Scene): void {
    const g = scene.add.graphics();

    this.drawNinjaFrame(g, 0);
    this.drawNinjaFrame(g, 1);
    this.drawNinjaFrame(g, 2);
    this.drawNinjaFrame(g, 3);
    this.createBarricade(g);
    this.createDrone(g);
    this.createShuriken(g);
    this.createCoin(g, 'coin-gold',   0xffd700, 0xffaa00, 36);
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

  // ─── NINJA (4-frame run, SD/chibi style, right-facing) ──────────────────

  private static drawNinjaFrame(g: Phaser.GameObjects.Graphics, phase: 0 | 1 | 2 | 3): void {
    g.clear();

    // Glow aura
    g.fillStyle(0x00aaff, 0.20);
    g.fillCircle(21, 13, 16);
    g.fillRoundedRect(10, 26, 22, 14, 6);

    // ── SCARF (8-point ribbon, larger amplitude wave per frame) ──────────────
    // Drawn first so body paints over the attachment point naturally
    g.fillStyle(0x00ffff, 1);
    let sp: { x: number; y: number }[];
    if (phase === 0) {
      // Tip sweeps UP (left arm is forward = left arm high = scarf up)
      sp = [{ x: 24, y: 26 }, { x: 17, y: 23 }, { x: 9, y: 20 }, { x: 2, y: 18 },
            { x: 2, y: 22  }, { x: 9, y: 25  }, { x: 17, y: 28 }, { x: 24, y: 32 }];
    } else if (phase === 2) {
      // Tip sweeps DOWN
      sp = [{ x: 24, y: 26 }, { x: 17, y: 29 }, { x: 9, y: 32 }, { x: 2, y: 34 },
            { x: 2, y: 38  }, { x: 9, y: 36  }, { x: 17, y: 32 }, { x: 24, y: 32 }];
    } else {
      // Neutral — horizontal ribbon
      sp = [{ x: 24, y: 26 }, { x: 17, y: 26 }, { x: 9, y: 26 }, { x: 2, y: 26 },
            { x: 2, y: 30  }, { x: 9, y: 30  }, { x: 17, y: 31 }, { x: 24, y: 32 }];
    }
    g.fillPoints(sp, true);

    // ── BODY (small SD, body covers scarf attachment) ─────────────────────────
    g.fillStyle(0x3a5580, 1);
    g.fillRoundedRect(13, 26, 17, 13, 4);

    // ── HEAD (large, shifted slightly forward of body = forward lean feel) ────
    g.fillStyle(0x2e4468, 1);
    g.fillCircle(21, 13, 13);

    // Hitai-ate headband
    g.fillStyle(0x1a1a2e, 1);
    g.fillRect(9, 7, 24, 5);
    g.fillStyle(0x4455aa, 1);
    g.fillRect(15, 7, 12, 5);
    g.fillStyle(0x2233aa, 0.6);
    g.fillRect(17, 9, 8, 2);

    // Mask (right side — side profile)
    g.fillStyle(0xffffff, 0.92);
    g.fillRect(16, 11, 15, 9);

    // Eye — smaller black manga dot (was radius 5 → 3)
    g.fillStyle(0x1a1a2e, 1);
    g.fillCircle(27, 13, 3);
    g.fillStyle(0xffffff, 0.95);
    g.fillCircle(25, 12, 1.2);

    // ── ARMS (wider swing range for dynamic running pump) ──────────────────────
    // phase 0: left arm swings far back-high, right arm forward-low
    const leftArmY  = phase === 0 ? 24 : phase === 2 ? 31 : 27;
    const rightArmY = phase === 0 ? 31 : phase === 2 ? 24 : 27;
    g.fillStyle(0x3a5580, 1);
    g.fillRoundedRect(5,  leftArmY,  7, 12, 3);
    g.fillRoundedRect(29, rightArmY, 7, 12, 3);
    g.fillStyle(0x00ffff, 0.55);
    g.fillRect(6,  leftArmY  + 2, 5, 2);
    g.fillRect(30, rightArmY + 2, 5, 2);

    // ── LEGS (wide stride: forward leg extends right, back leg kicks up-left) ──
    g.fillStyle(0x2a3f5c, 1);
    if (phase === 0) {
      g.fillRoundedRect(23, 38, 8, 11, 3);  // right leg — forward, far right
      g.fillRoundedRect(9,  36, 8,  9, 3);  // left leg  — kicking up-left (higher y-start)
    } else if (phase === 2) {
      g.fillRoundedRect(10, 38, 8, 11, 3);  // left leg  — forward
      g.fillRoundedRect(24, 36, 8,  9, 3);  // right leg — kicking back
    } else {
      g.fillRoundedRect(12, 38, 8, 9, 3);
      g.fillRoundedRect(22, 38, 8, 9, 3);
    }

    // ── BOOTS ─────────────────────────────────────────────────────────────────
    g.fillStyle(0x1a2a3a, 1);
    if (phase === 0) {
      g.fillRoundedRect(21, 48, 11, 4, 2);  // forward boot (lower)
      g.fillRoundedRect(8,  44,  9, 4, 2);  // back boot (higher — kick-up)
    } else if (phase === 2) {
      g.fillRoundedRect(9,  48, 11, 4, 2);
      g.fillRoundedRect(22, 44,  9, 4, 2);
    } else {
      g.fillRoundedRect(11, 46,  9, 4, 2);
      g.fillRoundedRect(21, 46,  9, 4, 2);
    }

    g.generateTexture(`ninja-${phase}`, 40, 52);
  }

  // ─── OBSTACLES (red danger borders = "avoid me") ──────────────────────────

  private static createBarricade(g: Phaser.GameObjects.Graphics): void {
    g.clear();
    g.fillStyle(0x2a2a4a, 1);
    g.fillRoundedRect(0, 0, 40, 60, 3);
    g.fillStyle(0xff6600, 1);
    g.fillRect(0, 10, 40, 8);
    g.fillRect(0, 26, 40, 8);
    g.fillRect(0, 42, 40, 8);
    // Warning light
    g.fillStyle(0xff0044, 1);
    g.fillCircle(20, 4, 4);
    g.fillStyle(0xff6688, 0.6);
    g.fillCircle(20, 4, 7);
    // Red danger border
    g.lineStyle(3, 0xff2200, 0.9);
    g.strokeRoundedRect(0, 0, 40, 60, 3);
    g.generateTexture('barricade', 40, 60);
  }

  private static createDrone(g: Phaser.GameObjects.Graphics): void {
    g.clear();
    g.fillStyle(0x444466, 1);
    g.fillRect(0, 10, 50, 4);
    g.fillStyle(0x333355, 1);
    g.fillRoundedRect(12, 4, 26, 18, 4);
    g.fillStyle(0x888899, 0.7);
    g.fillEllipse(6, 12, 14, 6);
    g.fillEllipse(44, 12, 14, 6);
    // Red menacing eye (was green — green reads as friendly)
    g.fillStyle(0xff2200, 1);
    g.fillCircle(25, 13, 5);
    g.fillStyle(0xff6600, 1);
    g.fillCircle(25, 13, 2.5);
    // Red LED warning lights on arms
    g.fillStyle(0xff2200, 0.9);
    g.fillCircle(4, 12, 2);
    g.fillCircle(46, 12, 2);
    // Red danger border
    g.lineStyle(2, 0xff2200, 0.75);
    g.strokeRoundedRect(11, 3, 28, 20, 4);
    g.generateTexture('drone', 50, 26);
  }

  private static createShuriken(g: Phaser.GameObjects.Graphics): void {
    g.clear();
    const cx = 14, cy = 14;
    const pts = [
      { x: cx,     y: 0      },
      { x: cx + 5, y: cy - 5 },
      { x: cx * 2, y: cy     },
      { x: cx + 5, y: cy + 5 },
      { x: cx,     y: cy * 2 },
      { x: cx - 5, y: cy + 5 },
      { x: 0,      y: cy     },
      { x: cx - 5, y: cy - 5 },
    ];
    g.fillStyle(0xc0c0ff, 1);
    g.fillPoints(pts, true);
    // Red-orange center (weapon)
    g.fillStyle(0xff4400, 0.85);
    g.fillCircle(cx, cy, 4);
    g.fillStyle(0xff8800, 0.6);
    g.fillCircle(cx, cy, 2);
    // Red danger border on star
    g.lineStyle(2, 0xff3300, 0.7);
    g.strokePoints(pts, true);
    g.generateTexture('shuriken', 28, 28);
  }

  // ─── ITEMS (golden/colored glow + bright borders = "collect me") ──────────

  private static createCoin(
    g: Phaser.GameObjects.Graphics,
    key: string,
    outerColor: number,
    innerColor: number,
    size: number
  ): void {
    g.clear();
    // Center in texture (size + 8 padding for glow)
    const ts = size + 8;   // texture size
    const cx = ts / 2;
    const cy = ts / 2;
    const r  = size / 2;

    // Golden pickup glow
    g.fillStyle(0xffff88, 0.35);
    g.fillCircle(cx, cy, r + 4);

    // Outer ring
    g.fillStyle(outerColor, 1);
    g.fillCircle(cx, cy, r - 1);
    // Inner ring
    g.fillStyle(innerColor, 1);
    g.fillCircle(cx, cy, r - 5);
    // Vertical lines (古銭風)
    g.fillStyle(outerColor, 0.7);
    g.fillRect(cx - 5, cy - (r - 7), 2, (r - 7) * 2);
    g.fillRect(cx - 1, cy - (r - 7), 2, (r - 7) * 2);
    g.fillRect(cx + 3, cy - (r - 7), 2, (r - 7) * 2);

    // Tier-colored border (gold/silver/bronze)
    g.lineStyle(2.5, outerColor, 0.95);
    g.strokeCircle(cx, cy, r - 1);

    // Sparkle glint
    g.fillStyle(0xffffff, 0.95);
    g.fillCircle(cx + r * 0.42, cy - r * 0.42, 2);

    g.generateTexture(key, ts, ts);
  }

  private static createBandaid(g: Phaser.GameObjects.Graphics): void {
    g.clear();
    // Green pickup glow
    g.fillStyle(0x44ff88, 0.28);
    g.fillRoundedRect(-4, -4, 44, 24, 5);

    g.fillStyle(0xf5deb3, 1);
    g.fillRect(0, 3, 36, 10);
    g.fillStyle(0xffb6c1, 1);
    g.fillRect(0, 0, 10, 16);
    g.fillRect(26, 0, 10, 16);
    g.fillStyle(0xffffff, 0.9);
    g.fillRect(11, 4, 14, 8);
    // Green cross — universal health symbol
    g.fillStyle(0x22cc44, 1);
    g.fillRect(16, 5, 4, 6);
    g.fillRect(13, 7, 10, 2);
    // Green border
    g.lineStyle(2, 0x22cc44, 0.9);
    g.strokeRoundedRect(0, 0, 36, 16, 3);
    g.generateTexture('bandaid', 36, 16);
  }

  private static createShield(g: Phaser.GameObjects.Graphics): void {
    g.clear();
    // Golden pickup glow
    g.fillStyle(0xffd700, 0.28);
    g.fillPoints([
      { x: -2, y: 0 }, { x: 34, y: 0 },
      { x: 34, y: 24 }, { x: 16, y: 38 }, { x: -2, y: 24 },
    ], true);

    const pts = [
      { x: 2, y: 2 }, { x: 30, y: 2 },
      { x: 30, y: 22 }, { x: 16, y: 34 }, { x: 2, y: 22 },
    ];
    g.fillStyle(0x4488cc, 1);
    g.fillPoints(pts, true);
    // Gold cross emblem
    g.lineStyle(2, 0xffd700, 0.85);
    g.lineBetween(16, 8, 16, 26);
    g.lineBetween(10, 16, 22, 16);
    // Bright gold border
    g.lineStyle(3, 0xffd700, 1);
    g.strokePoints(pts, true);
    g.generateTexture('shield', 32, 36);
  }

  private static createBoot(g: Phaser.GameObjects.Graphics): void {
    g.clear();
    // Cyan pickup glow (speed/jump)
    g.fillStyle(0x00f5ff, 0.22);
    g.fillRoundedRect(-3, -3, 38, 40, 6);

    g.fillStyle(0xffffff, 1);
    g.fillRoundedRect(4, 2, 22, 14, 4);
    g.fillRoundedRect(22, 8, 10, 10, 3);
    g.fillStyle(0x0066ff, 1);
    g.fillRoundedRect(2, 16, 30, 5, 2);
    g.lineStyle(1, 0xaaaaaa, 0.5);
    g.lineBetween(7, 10, 18, 10);
    // Motion lines
    g.fillStyle(0x00f5ff, 0.8);
    g.fillRect(4, 23, 24, 2);
    g.fillStyle(0x00f5ff, 0.5);
    g.fillRect(7, 27, 20, 2);
    g.fillStyle(0x00f5ff, 0.25);
    g.fillRect(10, 31, 16, 2);
    // Cyan border (speed color)
    g.lineStyle(2, 0x00f5ff, 0.9);
    g.strokeRoundedRect(2, 0, 30, 22, 3);
    g.generateTexture('boot', 32, 34);
  }

  // ─── BACKGROUND ───────────────────────────────────────────────────────────

  private static createBgSky(g: Phaser.GameObjects.Graphics): void {
    g.clear();
    g.fillGradientStyle(0x0a0520, 0x0a0520, 0x2d0d58, 0x2d0d58, 1);
    g.fillRect(0, 0, 800, 450);
    const stars: [number, number, number][] = [
      [50, 30, 1.5], [120, 80, 1], [200, 20, 2], [300, 60, 1.5], [400, 40, 1],
      [500, 90, 1], [600, 25, 2], [700, 70, 1.5], [150, 120, 1], [350, 100, 1.5],
      [550, 50, 1], [750, 110, 1], [80, 150, 2], [250, 140, 1], [450, 130, 1.5],
      [650, 145, 1], [30, 200, 1], [180, 190, 2], [380, 180, 1], [580, 195, 1],
      [780, 170, 1.5], [100, 250, 1], [320, 240, 1], [520, 230, 2], [720, 260, 1],
      [60, 300, 1], [260, 290, 1], [460, 310, 1], [660, 285, 1], [760, 320, 1],
      [25, 60, 1.5], [480, 170, 2], [170, 60, 1], [410, 320, 1], [630, 55, 1.5],
    ];
    g.fillStyle(0xffffff, 1);
    for (const [sx, sy, sr] of stars) {
      g.fillCircle(sx, sy, sr);
    }
    g.generateTexture('bg-sky', 800, 450);
  }

  private static createBgFar(g: Phaser.GameObjects.Graphics): void {
    g.clear();
    g.fillStyle(0x1a1244, 1);
    const buildings: [number, number, number, number][] = [
      [0, 80, 50, 220], [55, 40, 40, 260], [100, 100, 55, 200],
      [160, 60, 35, 240], [200, 20, 50, 280], [255, 80, 45, 220],
      [305, 50, 40, 250], [350, 90, 48, 210],
    ];
    for (const [bx, by, bw, bh] of buildings) {
      g.fillRect(bx, by, bw, bh);
    }
    g.fillStyle(0x00f5ff, 0.6);
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
    g.fillStyle(0xff2266, 0.55);
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
    g.fillStyle(0x0e0c28, 1);
    const buildings: [number, number, number, number][] = [
      [0, 50, 40, 250], [45, 70, 30, 230], [80, 30, 50, 270],
      [135, 60, 35, 240], [175, 20, 45, 280], [225, 55, 30, 245],
      [260, 40, 38, 260],
    ];
    for (const [bx, by, bw, bh] of buildings) {
      g.fillRect(bx, by, bw, bh);
    }
    g.fillStyle(0x00f5ff, 0.8);
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
    g.fillStyle(0xff44aa, 0.8);
    const signs: [number, number, number, number][] = [
      [6, 76, 24, 5], [88, 56, 28, 5], [183, 46, 26, 5], [268, 66, 22, 5],
    ];
    for (const [sx, sy, sw, sh] of signs) {
      g.fillRect(sx, sy, sw, sh);
    }
    g.generateTexture('bg-mid', 298, 300);
  }
}
