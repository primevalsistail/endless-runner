import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig';
import { Player } from '../objects/Player';
import { ObstacleManager } from '../managers/ObstacleManager';
import { PowerUpManager } from '../managers/PowerUpManager';
import { ScoreManager } from '../managers/ScoreManager';
import { DifficultyManager } from '../managers/DifficultyManager';
import { GameStateManager } from '../managers/GameStateManager';
import { LifeManager } from '../managers/LifeManager';
import { ItemManager } from '../managers/ItemManager';
import { BackgroundManager } from '../managers/BackgroundManager';
import { GameHUD } from '../hud/GameHUD';
import { InMemoryPersistenceService, type IPersistenceService } from '../services/IPersistenceService';
import { StorageService } from '../services/StorageService';
import { AudioManager } from '../services/AudioManager';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private obstacleManager!: ObstacleManager;
  private powerUpManager!: PowerUpManager;
  private scoreManager!: ScoreManager;
  private difficultyManager!: DifficultyManager;
  private gameStateManager!: GameStateManager;
  private lifeManager!: LifeManager;
  private itemManager!: ItemManager;
  private backgroundManager!: BackgroundManager;
  private hud!: GameHUD;

  private countdownRemaining = GameConfig.COUNTDOWN_DURATION;
  private countdownElapsed = 0;

  private persistence: IPersistenceService = typeof localStorage !== 'undefined'
    ? new StorageService()
    : new InMemoryPersistenceService();

  constructor() {
    super({ key: 'GameScene' });
  }

  setPersistence(p: IPersistenceService): void {
    this.persistence = p;
  }

  create(): void {
    this.backgroundManager = new BackgroundManager();
    this.backgroundManager.create(this);

    const ground = this.add.rectangle(
      GameConfig.WIDTH / 2, GameConfig.GROUND_Y + 10,
      GameConfig.WIDTH, 20, 0x1a1a3a
    );
    this.physics.add.existing(ground, true);
    // Neon ground line
    this.add.rectangle(
      GameConfig.WIDTH / 2, GameConfig.GROUND_Y,
      GameConfig.WIDTH, 2, 0x00f5ff
    );

    this.player = new Player(this, GameConfig.PLAYER_X, GameConfig.GROUND_Y - 33);
    this.physics.add.collider(this.player, ground);

    this.gameStateManager = new GameStateManager(this);
    this.scoreManager = new ScoreManager(this.persistence);
    this.difficultyManager = new DifficultyManager();
    this.lifeManager = new LifeManager();
    this.obstacleManager = new ObstacleManager(this);
    this.powerUpManager = new PowerUpManager(this);
    this.itemManager = new ItemManager(this);
    this.hud = new GameHUD(this, {
      onPause: () => this.togglePause(),
      onRetry: () => this.scene.restart(),
      onTitle: () => this.scene.start('MenuScene'),
    });

    AudioManager.getInstance().playBGM('game-bgm');

    const audio = AudioManager.getInstance();
    this.input.on('pointerdown', () => {
      if (!this.gameStateManager.isPlaying) return;
      const result = this.player.jump();
      if (result === 'ground') audio.playSFX('jump');
      else if (result === 'double') audio.playSFX('double-jump');
    });
    this.input.on('pointerup', () => this.player.releaseJump());

    this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
      .on('down', () => this.togglePause());

    this.startCountdown();
  }

  private startCountdown(): void {
    this.gameStateManager.startCountdown();
    this.countdownRemaining = GameConfig.COUNTDOWN_DURATION;
    this.countdownElapsed = 0;
    this.hud.showCountdown(String(this.countdownRemaining));
  }

  update(_time: number, delta: number): void {
    try {
      this.gameLoop(delta);
    } catch (e) {
      console.error(e);
      this.gameStateManager.endGame(this.scoreManager.currentScore);
    }
  }

  private gameLoop(deltaMs: number): void {
    if (this.gameStateManager.state === 'countdown') {
      this.tickCountdown(deltaMs);
      return;
    }
    if (!this.gameStateManager.isPlaying) return;

    const speed = this.difficultyManager.gameSpeed;
    const level = this.difficultyManager.level;
    const interval = this.difficultyManager.obstacleInterval;

    this.backgroundManager.update(deltaMs, speed);
    this.player.update(deltaMs);
    this.lifeManager.update(deltaMs);
    this.obstacleManager.update(deltaMs, speed, level, interval);
    this.powerUpManager.update(deltaMs, speed, this.player);
    this.itemManager.update(deltaMs, speed);
    this.scoreManager.update(deltaMs, speed);
    this.difficultyManager.update(this.scoreManager.distanceTraveled);

    this.hud.updateScore(this.scoreManager.currentScore);
    this.hud.updatePowerUp(
      this.powerUpManager.getRemainingTime('doubleJump'),
      this.powerUpManager.getRemainingTime('invincibility'),
    );

    this.updateInvincibleVisual();
    this.checkCollisions();
  }

  private togglePause(): void {
    if (this.gameStateManager.state !== 'playing' && this.gameStateManager.state !== 'paused') return;
    this.gameStateManager.togglePause();
    this.hud.setPaused(this.gameStateManager.isPaused);
    if (this.gameStateManager.isPaused) {
      AudioManager.getInstance().onPause();
    } else {
      AudioManager.getInstance().onResume();
    }
  }

  private updateInvincibleVisual(): void {
    const isInvincible = this.player.isInvincibleFromPowerUp || this.lifeManager.isDamageInvincible;
    if (isInvincible) {
      this.player.setAlpha(Math.floor(this.time.now / 120) % 2 === 0 ? 0.3 : 1);
    } else {
      this.player.setAlpha(1);
    }
  }

  private tickCountdown(deltaMs: number): void {
    this.countdownElapsed += deltaMs;
    if (this.countdownElapsed < 1000) return;
    this.countdownElapsed -= 1000;
    this.countdownRemaining--;
    if (this.countdownRemaining <= 0) {
      this.hud.showCountdown('GO!');
      this.time.delayedCall(500, () => {
        this.hud.hideCountdown();
        this.gameStateManager.startPlaying();
      });
    } else {
      this.hud.showCountdown(String(this.countdownRemaining));
    }
  }

  private checkCollisions(): void {
    const playerBounds = this.player.getBounds();
    const isInvincible = this.player.isInvincibleFromPowerUp || this.lifeManager.isDamageInvincible;
    const audio = AudioManager.getInstance();

    if (!isInvincible) {
      for (const obs of this.obstacleManager.getActive()) {
        if (Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, obs.getBounds())) {
          if (this.lifeManager.takeDamage()) {
            audio.playSFX('hit');
            this.hud.updateLives(this.lifeManager.lives);
            if (this.lifeManager.isDead()) {
              this.scoreManager.saveHighScore();
              this.gameStateManager.endGame(this.scoreManager.currentScore);
              return;
            }
          }
          break;
        }
      }
    }

    for (const item of this.itemManager.getActiveScoreItems()) {
      if (Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, item.getBounds())) {
        audio.playSFX('coin');
        this.scoreManager.addBonus(item.bonusValue);
        item.deactivate();
      }
    }

    for (const item of this.itemManager.getActiveRecoveryItems()) {
      if (Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, item.getBounds())) {
        audio.playSFX('heal');
        this.lifeManager.recover();
        this.hud.updateLives(this.lifeManager.lives);
        item.deactivate();
      }
    }

    for (const item of this.powerUpManager.getActiveItems()) {
      if (Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, item.getBounds())) {
        audio.playSFX('powerup');
        this.powerUpManager.collect(item, this.player);
      }
    }
  }
}
