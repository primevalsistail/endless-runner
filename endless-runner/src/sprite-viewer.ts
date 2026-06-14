import Phaser from 'phaser';
import { TextureFactory } from './graphics/TextureFactory';

class ViewerScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ViewerScene' });
  }

  preload(): void {
    for (let i = 0; i < 8; i++) {
      this.load.image(`ninja-${i}`, `sprites/ninja-${i}.png`);
    }
  }

  create(): void {
    TextureFactory.createAll(this);

    let y = 12;
    const label = (text: string, color: string) =>
      this.add.text(12, y, text, { color, fontSize: '13px', fontFamily: 'monospace' });

    // ─── NINJA (0.5x = half of natural size ~222×293) ────────────────────
    const NS = 0.5;
    const NW = 223 * NS, NH = 293 * NS;
    label('● NINJA  (0.5×)', '#00ffff');
    y += 20;

    for (let i = 0; i < 8; i++) {
      const cx = 28 + i * (NW + 14) + NW / 2;
      this.add.image(cx, y + NH / 2, `ninja-${i}`).setScale(NS);
      this.add.text(cx - 22, y + NH + 4, `frame ${i}`, {
        color: '#557788', fontSize: '10px', fontFamily: 'monospace',
      });
    }
    // Animated run preview
    const animCx = 28 + 8 * (NW + 14) + NW / 2;
    const anim = this.add.image(animCx, y + NH / 2, 'ninja-0').setScale(NS);
    this.add.text(animCx - 20, y + NH + 4, '▶ RUN', {
      color: '#00ffff', fontSize: '10px', fontFamily: 'monospace',
    });
    let fi = 0;
    this.time.addEvent({
      delay: 110, loop: true,
      callback: () => { fi = (fi + 1) % 8; anim.setTexture(`ninja-${fi}`); },
    });
    y += NH + 36;

    // ─── OBSTACLES (3x) ──────────────────────────────────────────────────
    const OS = 3;
    label('● OBSTACLES  (3×)', '#ff8866');
    y += 20;
    const obstacles = [
      { key: 'barricade', w: 40, h: 60 },
      { key: 'drone',     w: 50, h: 26 },
      { key: 'shuriken',  w: 28, h: 28 },
    ];
    const obsMaxH = 60 * OS;
    let ox = 20;
    for (const o of obstacles) {
      const cx = ox + (o.w * OS) / 2;
      // Center vertically in the row
      this.add.image(cx, y + obsMaxH / 2, o.key).setScale(OS);
      this.add.text(ox, y + obsMaxH + 4, o.key, {
        color: '#557788', fontSize: '10px', fontFamily: 'monospace',
      });
      ox += o.w * OS + 28;
    }
    y += obsMaxH + 32;

    // ─── ITEMS (3x) ───────────────────────────────────────────────────────
    const IS = 3;
    label('● ITEMS  (3×)', '#88ff88');
    y += 20;
    const items = [
      { key: 'coin-gold',   w: 44, h: 44, name: 'gold' },
      { key: 'coin-silver', w: 38, h: 38, name: 'silver' },
      { key: 'coin-bronze', w: 34, h: 34, name: 'bronze' },
      { key: 'bandaid',     w: 36, h: 16, name: 'bandaid' },
      { key: 'shield',      w: 32, h: 36, name: 'shield' },
      { key: 'boot',        w: 32, h: 34, name: 'boot' },
    ];
    const itemMaxH = 44 * IS;
    let ix = 20;
    for (const item of items) {
      const cx = ix + (item.w * IS) / 2;
      this.add.image(cx, y + itemMaxH / 2, item.key).setScale(IS);
      this.add.text(ix, y + itemMaxH + 4, item.name, {
        color: '#557788', fontSize: '10px', fontFamily: 'monospace',
      });
      ix += item.w * IS + 22;
    }
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  width: 1400,
  height: 720,
  backgroundColor: '#0a0520',
  parent: 'game',
  scene: ViewerScene,
});
