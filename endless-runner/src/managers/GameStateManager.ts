import Phaser from 'phaser';

export type GameState = 'countdown' | 'playing' | 'gameOver';

export class GameStateManager {
  private _state: GameState = 'countdown';
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  get state(): GameState { return this._state; }
  get isPlaying(): boolean { return this._state === 'playing'; }

  startCountdown(): void {
    this._state = 'countdown';
  }

  startPlaying(): void {
    this._state = 'playing';
  }

  endGame(score: number): void {
    if (this._state === 'gameOver') return;
    this._state = 'gameOver';
    this.scene.scene.start('GameOverScene', { score });
  }
}
