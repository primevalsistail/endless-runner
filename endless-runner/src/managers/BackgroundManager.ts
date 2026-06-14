import Phaser from 'phaser';

export class BackgroundManager {
  private farLayer!: Phaser.GameObjects.TileSprite;
  private midLayer!: Phaser.GameObjects.TileSprite;

  create(scene: Phaser.Scene): void {
    // Sky (fixed, covers full screen)
    scene.add.image(400, 225, 'bg-sky').setDepth(-3);

    // Far building layer — scrolls at 15% of game speed
    this.farLayer = scene.add.tileSprite(400, 300, 800, 300, 'bg-far').setDepth(-2);

    // Mid building layer — scrolls at 40% of game speed
    this.midLayer = scene.add.tileSprite(400, 335, 800, 230, 'bg-mid').setDepth(-1);
  }

  update(deltaMs: number, gameSpeed: number): void {
    const delta = deltaMs / 1000;
    this.farLayer.tilePositionX += gameSpeed * 0.15 * delta;
    this.midLayer.tilePositionX += gameSpeed * 0.40 * delta;
  }
}
