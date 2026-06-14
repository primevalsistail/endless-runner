import Phaser from 'phaser';

export class BackgroundManager {
  private farLayer!: Phaser.GameObjects.TileSprite;
  private midLayer!: Phaser.GameObjects.TileSprite;

  create(scene: Phaser.Scene): void {
    // Sky (fixed, covers full screen)
    scene.add.image(400, 225, 'bg-sky').setDepth(-3);

    // Far building layer — ends at y≈360, 20px above ground line
    this.farLayer = scene.add.tileSprite(400, 210, 800, 300, 'bg-far').setDepth(-2);

    // Mid building layer — ends at y≈365, just above ground line
    this.midLayer = scene.add.tileSprite(400, 250, 800, 230, 'bg-mid').setDepth(-1);

    // Dark street surface below buildings (covers building bottoms to canvas edge)
    scene.add.rectangle(400, 415, 800, 110, 0x06030e).setDepth(-0.5);
  }

  update(deltaMs: number, gameSpeed: number): void {
    const delta = deltaMs / 1000;
    this.farLayer.tilePositionX += gameSpeed * 0.15 * delta;
    this.midLayer.tilePositionX += gameSpeed * 0.40 * delta;
  }
}
