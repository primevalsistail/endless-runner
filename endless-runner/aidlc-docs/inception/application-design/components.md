# Application Design: Components

## 新規コンポーネント

### AudioManager
- **種別**: TypeScript Singleton Service
- **パス**: `src/services/AudioManager.ts`
- **責務**:
  - Phaser グローバルサウンドマネージャー（`game.sound`）のラッパー
  - BGM（ループ再生）の開始・停止・フェード
  - SFX（単発再生）の再生（有効/無効チェック付き）
  - BGM / SFX 音量の読み書き
  - ポーズ時の音声制御（SFX停止、BGM音量ダウン）
  - `StorageService` を通じた音量設定の永続化

---

## 変更対象コンポーネント

### BootScene
- **パス**: `src/scenes/BootScene.ts`
- **変更内容**: BGM2ファイル + SFX7ファイルの `preload` 追加

### MenuScene
- **パス**: `src/scenes/MenuScene.ts`
- **変更内容**:
  - `create()`: AudioManager 初期化、メニューBGM開始
  - 音量調整UI（BGMスライダー + SFXスライダー）をSTARTボタン下に追加
  - シーン終了前のBGM停止は不要（GameSceneで上書き）

### GameScene
- **パス**: `src/scenes/GameScene.ts`
- **変更内容**:
  - `create()`: ゲームBGM開始
  - `togglePause()`: ポーズ時にAudioManager.pause()/resume()を呼ぶ
  - `checkCollisions()`: コイン・回復・パワーアップ取得時にSFX再生
  - `Player.jump()` の呼び出し後にSFX再生
  - `lifeManager.takeDamage()` の呼び出し後にSFX再生
  - `gameStateManager.endGame()` の呼び出し後にSFX再生

### GameOverScene
- **パス**: `src/scenes/GameOverScene.ts`
- **変更内容**:
  - `create()`: ゲームBGM停止、gameover SFX再生

### StorageService
- **パス**: `src/services/StorageService.ts`
- **変更内容**: `saveBgmVolume` / `loadBgmVolume` / `saveSfxVolume` / `loadSfxVolume` メソッド追加

### GameConfig
- **パス**: `src/config/GameConfig.ts`
- **変更内容**: `DEFAULT_BGM_VOLUME`, `DEFAULT_SFX_VOLUME`, `PAUSE_BGM_VOLUME` 定数追加
