# Application Design: Component Methods

## AudioManager

```typescript
class AudioManager {
  // Singleton
  static getInstance(): AudioManager

  // 初期化（BootScene完了後、最初のシーンで呼ぶ）
  init(game: Phaser.Game): void

  // BGM
  playBGM(key: string): void          // keyのBGMをループ再生（既存BGMは停止）
  stopBGM(): void                      // BGM停止
  pauseBGM(): void                     // BGM一時停止（ポーズ用）
  resumeBGM(): void                    // BGM再開（ポーズ解除用）
  setBgmVolume(volume: number): void   // 0.0〜1.0、設定を保存
  getBgmVolume(): number

  // SFX
  playSFX(key: string): void           // SFXを1回再生（無効時はno-op）
  setSfxVolume(volume: number): void   // 0.0〜1.0、設定を保存
  getSfxVolume(): number

  // ポーズ制御
  onPause(): void    // SFX無効化、BGMを PAUSE_BGM_VOLUME に下げる
  onResume(): void   // SFX有効化、BGMを元の音量に戻す
}
```

## StorageService（追加メソッド）

```typescript
saveBgmVolume(volume: number): void
loadBgmVolume(): number   // デフォルト: GameConfig.DEFAULT_BGM_VOLUME
saveSfxVolume(volume: number): void
loadSfxVolume(): number   // デフォルト: GameConfig.DEFAULT_SFX_VOLUME
```

## GameConfig（追加定数）

```typescript
DEFAULT_BGM_VOLUME: 0.6,  // BGMデフォルト音量
DEFAULT_SFX_VOLUME: 0.8,  // SFXデフォルト音量
PAUSE_BGM_VOLUME: 0.15,   // ポーズ中のBGM音量
BGM_VOLUME_KEY: 'endless_runner_bgm_volume',
SFX_VOLUME_KEY: 'endless_runner_sfx_volume',
```

## 音量スライダーUI（MenuScene内ヘルパー）

```typescript
// MenuScene内のプライベートメソッドとして実装
private createVolumeControls(): void
// BGMスライダーとSFXスライダーをネオンUIで生成
// AudioManagerと双方向バインド
```
