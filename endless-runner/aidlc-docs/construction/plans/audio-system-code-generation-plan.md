# Code Generation Plan: audio-system

## Unit Context
- **ユニット名**: audio-system
- **依存**: GameConfig, StorageService（既存）
- **対象ファイル**: 7ファイル変更 + 1ファイル新規作成

## Generation Steps

### Step 1: GameConfig に音量定数を追加
- [ ] `src/config/GameConfig.ts` に以下を追加:
  - `DEFAULT_BGM_VOLUME: 0.6`
  - `DEFAULT_SFX_VOLUME: 0.8`
  - `PAUSE_BGM_VOLUME: 0.15`
  - `BGM_VOLUME_KEY: 'endless_runner_bgm_volume'`
  - `SFX_VOLUME_KEY: 'endless_runner_sfx_volume'`

### Step 2: StorageService に音量設定メソッドを追加
- [ ] `src/services/StorageService.ts` に以下を追加:
  - `saveBgmVolume(volume: number): void`
  - `loadBgmVolume(): number`（デフォルト: `GameConfig.DEFAULT_BGM_VOLUME`）
  - `saveSfxVolume(volume: number): void`
  - `loadSfxVolume(): number`（デフォルト: `GameConfig.DEFAULT_SFX_VOLUME`）

### Step 3: AudioManager（新規）を作成
- [ ] `src/services/AudioManager.ts` を新規作成
- [ ] TypeScript Singleton パターン
- [ ] 公開メソッド:
  - `static getInstance(): AudioManager`
  - `init(game: Phaser.Game): void`
  - `playBGM(key: string): void`（既存BGMを停止してから再生）
  - `stopBGM(): void`
  - `onPause(): void`（sfxEnabled=false、BGM音量をPAUSE_BGM_VOLUMEに）
  - `onResume(): void`（sfxEnabled=true、BGM音量を元に戻す）
  - `playSFX(key: string): void`（sfxEnabled=falseなら no-op）
  - `setBgmVolume(v: number): void`（Phaser + Storage に保存）
  - `getBgmVolume(): number`
  - `setSfxVolume(v: number): void`（Storage に保存）
  - `getSfxVolume(): number`

### Step 4: BootScene に音声ファイルの preload を追加
- [ ] `src/scenes/BootScene.ts` を変更:
  - BGM: `this.load.audio('menu-bgm', 'audio/bgm/menu-bgm.ogg')`
  - BGM: `this.load.audio('game-bgm', 'audio/bgm/game-bgm.ogg')`
  - SFX: `this.load.audio('jump', 'audio/sfx/jump.ogg')`
  - SFX: `this.load.audio('double-jump', 'audio/sfx/double-jump.ogg')`
  - SFX: `this.load.audio('hit', 'audio/sfx/hit.ogg')`
  - SFX: `this.load.audio('coin', 'audio/sfx/coin.ogg')`
  - SFX: `this.load.audio('heal', 'audio/sfx/heal.ogg')`
  - SFX: `this.load.audio('powerup', 'audio/sfx/powerup.ogg')`
  - SFX: `this.load.audio('gameover', 'audio/sfx/gameover.ogg')`
  - `create()` で `AudioManager.getInstance().init(this.game)` を呼ぶ

### Step 5: MenuScene を変更（メニューBGM + 音量調整UI）
- [ ] `src/scenes/MenuScene.ts` を変更:
  - `create()` に `AudioManager.getInstance().playBGM('menu-bgm')` を追加
  - `createVolumeControls()` プライベートメソッドを追加:
    - BGMスライダー（ラベル・トラック・フィル・ドラッグ可能ハンドル・パーセント表示）
    - SFXスライダー（同上）
    - ネオンシティデザイン統一（シアン/マゼンタ、グロウシャドウ）
    - スライダー配置: STARTボタン(y=370)の下 → y=420付近
    - Phaser drag API: `this.input.setDraggable(handle)`

### Step 6: GameScene を変更（ゲームBGM・SFX・ポーズ連動）
- [ ] `src/scenes/GameScene.ts` を変更:
  - `create()` に `AudioManager.getInstance().playBGM('game-bgm')` を追加
  - `togglePause()` に AudioManager.onPause/onResume を追加
  - `checkCollisions()` に以下を追加:
    - コイン取得 → `audio.playSFX('coin')`
    - 回復取得 → `audio.playSFX('heal')`
    - パワーアップ取得 → `audio.playSFX('powerup')`
    - ダメージ（takeDamage 成功時） → `audio.playSFX('hit')`
    - ゲームオーバー → `audio.playSFX('gameover')`（stopBGMはGameOverSceneで）
  - Player.jump() 呼び出し箇所を `jumpWithSFX()` に変更 OR
    input ハンドラ内でジャンプSFXを再生（ジャンプが成功したかをPlayer側で返すように変更）
  
  **ジャンプSFX実装方針**: `Player.jump()` の戻り値を `'ground' | 'double' | null` にして、GameScene側でSFXを振り分ける

### Step 7: Player.jump() の戻り値を変更
- [ ] `src/objects/Player.ts` を変更:
  - `jump(): void` → `jump(): 'ground' | 'double' | null` に変更
  - 地上ジャンプ時: `return 'ground'`
  - 2段ジャンプ時: `return 'double'`
  - ジャンプ不可時: `return null`

### Step 8: GameScene の jump ハンドラを更新
- [ ] `src/scenes/GameScene.ts` を変更（Step 6と合わせて実施）:
  - `pointerdown` ハンドラ内で jump 戻り値を取得しSFXを再生:
    ```
    const result = this.player.jump();
    if (result === 'ground') audio.playSFX('jump');
    else if (result === 'double') audio.playSFX('double-jump');
    ```

### Step 9: GameOverScene を変更
- [ ] `src/scenes/GameOverScene.ts` を変更:
  - `create()` 冒頭で `AudioManager.getInstance().stopBGM()` を呼ぶ
  - `create()` で少し遅延してから `audio.playSFX('gameover')` を再生
    （シーン遷移直後より100ms後など）

### Step 10: 音声ファイルのプレースホルダーを作成
- [ ] `public/audio/bgm/` ディレクトリを作成
- [ ] `public/audio/sfx/` ディレクトリを作成
- [ ] `public/audio/README.md` を作成（必要なファイル一覧と素材サイトの案内）

## 実装上の注意事項
- Phaser の `scene.sound` は `game.sound`（グローバル）と同じ → シーン切り替えでBGMは自動継続
- Autoplay Policy: MenuScene/GameScene は常にユーザーのタップ後に遷移するため自動的にクリア
- 音量スライダーの drag: `this.input.setDraggable(handle)` + `handle.on('drag', ...)`
- SFX の音量制御: Phaser では個別サウンドに `setVolume()` するより、`SoundManager` の `volume` プロパティを使う方が統一的だが、BGM/SFX を分離したいので各サウンドに個別に音量を設定する
