import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig';
import type { PowerUp } from '../powerups/PowerUp';
import type { PowerUpType } from '../powerups/PowerUp';

export class Player extends Phaser.Physics.Arcade.Sprite {
  isOnGround = false;
  jumpHoldTime = 0;
  isHoldingJump = false;
  hasDoubleJump = false;
  airJumpUsed = false;
  isInvincibleFromPowerUp = false;

  private activePowerUps = new Map<PowerUpType, PowerUp>();

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'ninja');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDisplaySize(40, 50);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setGravityY(GameConfig.GRAVITY);
  }

  jump(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;

    if (this.isOnGround) {
      body.setVelocityY(GameConfig.INITIAL_JUMP_FORCE);
      this.jumpHoldTime = 0;
      this.isHoldingJump = true;
      this.airJumpUsed = false;
    } else if (this.hasDoubleJump && !this.airJumpUsed) {
      body.setVelocityY(GameConfig.INITIAL_JUMP_FORCE);
      this.jumpHoldTime = 0;
      this.isHoldingJump = true;
      this.airJumpUsed = true;
    }
  }

  releaseJump(): void {
    this.isHoldingJump = false;
  }

  update(deltaMs: number): void {
    const body = this.body as Phaser.Physics.Arcade.Body;

    if (this.isHoldingJump && this.jumpHoldTime < GameConfig.MAX_JUMP_HOLD_TIME) {
      this.jumpHoldTime += deltaMs;
      body.setVelocityY(body.velocity.y + GameConfig.HOLD_JUMP_FORCE * (deltaMs / 1000));
    }

    this.isOnGround = body.blocked.down;
    if (this.isOnGround) this.airJumpUsed = false;
  }

  applyPowerUp(powerUp: PowerUp): void {
    const existing = this.activePowerUps.get(powerUp.type);
    if (existing) existing.remove(this);
    powerUp.apply(this);
    this.activePowerUps.set(powerUp.type, powerUp);
  }

  removePowerUp(type: PowerUpType): void {
    const powerUp = this.activePowerUps.get(type);
    if (powerUp) {
      powerUp.remove(this);
      this.activePowerUps.delete(type);
    }
  }

  reset(): void {
    this.activePowerUps.forEach(p => p.remove(this));
    this.activePowerUps.clear();
    this.hasDoubleJump = false;
    this.airJumpUsed = false;
    this.isHoldingJump = false;
    this.jumpHoldTime = 0;
    this.isInvincibleFromPowerUp = false;
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
    this.setPosition(GameConfig.PLAYER_X, GameConfig.GROUND_Y - 25);
  }
}
