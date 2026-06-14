import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig';

export type CoinTier = 'gold' | 'silver' | 'bronze';

export class ScoreItem extends Phaser.GameObjects.Image {
  scrollSpeed = 0;
  tier: CoinTier = 'bronze';

  get bonusValue(): number {
    if (this.tier === 'gold') return GameConfig.SCORE_ITEM_BONUS_GOLD;
    if (this.tier === 'silver') return GameConfig.SCORE_ITEM_BONUS_SILVER;
    return GameConfig.SCORE_ITEM_BONUS_BRONZE;
  }

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 'coin-bronze');
    scene.add.existing(this);
    this.setActive(false).setVisible(false);
  }

  activate(x: number, y: number, speed: number, tier: CoinTier): void {
    this.tier = tier;
    this.setTexture(`coin-${tier}`);
    this.setPosition(x, y);
    this.scrollSpeed = speed;
    this.setActive(true).setVisible(true);
  }

  deactivate(): void {
    this.setActive(false).setVisible(false);
  }

  update(deltaMs: number): void {
    this.x -= this.scrollSpeed * (deltaMs / 1000);
  }
}
