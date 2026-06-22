import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig';
import { StorageService } from './StorageService';

export class AudioManager {
  private static instance: AudioManager;

  private soundManager!: Phaser.Sound.BaseSoundManager;
  private storage = new StorageService();

  private bgmKey = '';
  private bgmSound: Phaser.Sound.BaseSound | null = null;
  private bgmVolume: number = GameConfig.DEFAULT_BGM_VOLUME;
  private sfxVolume: number = GameConfig.DEFAULT_SFX_VOLUME;
  private sfxEnabled = true;

  private constructor() {}

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  init(game: Phaser.Game): void {
    this.soundManager = game.sound;
    this.bgmVolume = this.storage.loadBgmVolume();
    this.sfxVolume = this.storage.loadSfxVolume();
  }

  // ── BGM ────────────────────────────────────────────────────────────────────

  playBGM(key: string): void {
    if (this.bgmKey === key && this.bgmSound?.isPlaying) return;
    this.stopBGM();
    try {
      this.bgmKey = key;
      this.bgmSound = this.soundManager.add(key, { loop: true, volume: this.bgmVolume });
      this.bgmSound.play();
    } catch {
      this.bgmSound = null;
      this.bgmKey = '';
    }
  }

  stopBGM(): void {
    if (this.bgmSound) {
      this.bgmSound.stop();
      this.bgmSound.destroy();
      this.bgmSound = null;
      this.bgmKey = '';
    }
  }

  onPause(): void {
    this.sfxEnabled = false;
    if (this.bgmSound && 'setVolume' in this.bgmSound) {
      (this.bgmSound as Phaser.Sound.WebAudioSound | Phaser.Sound.HTML5AudioSound)
        .setVolume(GameConfig.PAUSE_BGM_VOLUME);
    }
  }

  onResume(): void {
    this.sfxEnabled = true;
    if (this.bgmSound && 'setVolume' in this.bgmSound) {
      (this.bgmSound as Phaser.Sound.WebAudioSound | Phaser.Sound.HTML5AudioSound)
        .setVolume(this.bgmVolume);
    }
  }

  setBgmVolume(volume: number): void {
    this.bgmVolume = Phaser.Math.Clamp(volume, 0, 1);
    if (this.bgmSound && 'setVolume' in this.bgmSound) {
      (this.bgmSound as Phaser.Sound.WebAudioSound | Phaser.Sound.HTML5AudioSound)
        .setVolume(this.bgmVolume);
    }
    this.storage.saveBgmVolume(this.bgmVolume);
  }

  getBgmVolume(): number {
    return this.bgmVolume;
  }

  // ── SFX ────────────────────────────────────────────────────────────────────

  playSFX(key: string): void {
    if (!this.sfxEnabled) return;
    try {
      this.soundManager.play(key, { volume: this.sfxVolume });
    } catch {
      // audio file not loaded — skip silently
    }
  }

  setSfxVolume(volume: number): void {
    this.sfxVolume = Phaser.Math.Clamp(volume, 0, 1);
    this.storage.saveSfxVolume(this.sfxVolume);
  }

  getSfxVolume(): number {
    return this.sfxVolume;
  }
}
