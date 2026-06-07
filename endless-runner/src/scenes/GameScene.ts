import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig';
import { Player } from '../objects/Player';
import { ObstacleManager } from '../managers/ObstacleManager';
import { PowerUpManager } from '../managers/PowerUpManager';
import { ScoreManager } from '../managers/ScoreManager';
import { DifficultyManager } from '../managers/DifficultyManager';
import { GameStateManager } from '../managers/GameStateManager';
import { GameHUD } from '../hud/GameHUD';
import { InMemoryPersistenceService, type IPersistenceService } from '../services/IPersistenceService';
import { StorageService } from '../services/StorageService';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private obstacleManager!: ObstacleManager;
  private powerUpManager!: PowerUpManager;
  private scoreManager!: ScoreManager;
  private difficultyManager!: DifficultyManager;
  private gameStateManager!: GameStateManager;
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
    const ground = this.add.rectangle(
      GameConfig.WIDTH / 2, GameConfig.GROUND_Y + 10,
      GameConfig.WIDTH, 20, 0x888888
    );
    this.physics.add.existing(ground, true);

    this.player = new Player(this, GameConfig.PLAYER_X, GameConfig.GROUND_Y - 25);
    this.physics.add.collider(this.player, ground);

    this.gameStateManager = new GameStateManager(this);
    this.scoreManager = new ScoreManager(this.persistence);
    this.difficultyManager = new DifficultyManager();
    this.obstacleManager = new ObstacleManager(this);
    this.powerUpManager = new PowerUpManager(this);
    this.hud = new GameHUD(this);

    this.input.on('pointerdown', () => {
      if (this.gameStateManager.isPlaying) this.player.jump();
    });
    this.input.on('pointerup', () => this.player.releaseJump());

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

    this.player.update(deltaMs);
    this.obstacleManager.update(deltaMs, speed, level, interval);
    this.powerUpManager.update(deltaMs, speed, this.player);
    this.scoreManager.update(deltaMs, speed);
    this.difficultyManager.update(this.scoreManager.distanceTraveled);

    this.hud.updateScore(this.scoreManager.currentScore);
    const remaining = this.powerUpManager.getRemainingTime('doubleJump');
    this.hud.updatePowerUp(remaining > 0 ? `2x JUMP ${Math.ceil(remaining / 1000)}s` : '');

    this.checkCollisions();
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

    for (const obs of this.obstacleManager.getActive()) {
      if (Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, obs.getBounds())) {
        this.scoreManager.saveHighScore();
        this.gameStateManager.endGame(this.scoreManager.currentScore);
        return;
      }
    }

    for (const item of this.powerUpManager.getActiveItems()) {
      if (Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, item.getBounds())) {
        this.powerUpManager.collect(item, this.player);
      }
    }
  }
}
