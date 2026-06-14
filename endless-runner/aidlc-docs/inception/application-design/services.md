# Application Design: Services

## AudioManager（新規サービス）

### 役割
音声の一元管理サービス。Phaser の `game.sound`（グローバル）をラップし、BGM・SFX・音量設定・ポーズ制御の窓口となる。

### 初期化フロー
```
BootScene.create()
  └── AudioManager.getInstance().init(this.game)
        └── Phaser.Sound.BaseSoundManager を取得・保持
              └── StorageService から音量設定を読み込み
```

### BGMシーン切り替えフロー
```
MenuScene.create()
  └── AudioManager.playBGM('menu-bgm')

ユーザーがゲーム開始
  └── GameScene.create()
        └── AudioManager.playBGM('game-bgm')   // menu-bgm は自動停止

ゲームオーバー
  └── GameOverScene.create()
        └── AudioManager.stopBGM()
              └── AudioManager.playSFX('gameover')
```

### ポーズフロー
```
GameScene.togglePause()
  ├── isPaused → AudioManager.onPause()
  │               ├── sfxEnabled = false
  │               └── BGM音量を PAUSE_BGM_VOLUME に変更
  └── isPlaying → AudioManager.onResume()
                  ├── sfxEnabled = true
                  └── BGM音量を元の値に戻す
```

## StorageService（拡張）

### 音量設定の読み書き
- `endless_runner_bgm_volume` / `endless_runner_sfx_volume` キーで LocalStorage に保存
- 既存の `endless_runner_high_score` と同じパターン

### AudioManager との連携
- `AudioManager.setBgmVolume()` → 即時 `StorageService.saveBgmVolume()` を呼ぶ
- `AudioManager.init()` → `StorageService.loadBgmVolume()` / `loadSfxVolume()` で初期値を取得
