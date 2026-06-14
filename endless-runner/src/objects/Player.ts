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
  private runFrame = 0;
  private jumpFrame = 0;
  private runTimer = 0;
  private static readonly FRAME_INTERVAL = 110;
  private static readonly JUMP_FRAME_INTERVAL = 80;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'ninja-0');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Sprites saved at 112×146 (2x display, Lanczos); displayed at 0.5x → 56×73 game units.
    // GPU does clean 2:1 bilinear — avoids crushing eyes at 4:1.
    // scaleX=scaleY=0.5, textureH=146, displayOriginY=73
    // body.bottom = player.y + 0.5*(offsetY + sourceH - 73)
    //   = player.y + 0.5*(8 + 130 - 73) = player.y + 32.5 ≈ display bottom ✓
    // spawn at GROUND_Y-33 → body.bottom ≈ GROUND_Y ✓
    this.setDisplaySize(56, 73);

    const body = this.body as Phaser.Physics.Arcade.Body;
    // setSize/setOffset in texture-space (112×146); scaleX/Y=0.5 applied internally
    body.setSize(70, 130);
    body.setOffset(24, 8);
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
    if (this.isOnGround) {
      this.airJumpUsed = false;
      this.jumpFrame = 0;
    }

    if (this.isOnGround) {
      this.runTimer += deltaMs;
      if (this.runTimer >= Player.FRAME_INTERVAL) {
        this.runTimer -= Player.FRAME_INTERVAL;
        this.runFrame = (this.runFrame + 1) % 8;
        this.setTexture(`ninja-${this.runFrame}`);
      }
    } else {
      this.runTimer += deltaMs;
      if (this.runTimer >= Player.JUMP_FRAME_INTERVAL) {
        this.runTimer -= Player.JUMP_FRAME_INTERVAL;
        // クランプ: 最終フレームで止める（ループしない）
        if (this.jumpFrame < 7) this.jumpFrame++;
        this.setTexture(`jump-${this.jumpFrame}`);
      }
    }
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
    this.setPosition(GameConfig.PLAYER_X, GameConfig.GROUND_Y - 33);
  }
}
