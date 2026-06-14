# Reverse Engineering: Architecture（音声関連フォーカス）

## シーン構成とライフサイクル

```
BootScene → MenuScene ⇄ GameScene → GameOverScene
                ↑___________________________|
```

| Scene | 役割 | 音声関連イベント |
|-------|------|----------------|
| BootScene | アセット読み込み | 音声ファイルの preload 追加ポイント |
| MenuScene | タイトル画面 | BGM再生開始 |
| GameScene | メインゲームプレイ | SFX全般＋ゲームBGM |
| GameOverScene | スコア表示・リトライ | BGM停止・ゲームオーバー音 |

## 現在の Phaser 設定（main.ts）

- `type: Phaser.AUTO`
- `width: 800, height: 450`
- **audio設定なし**（デフォルトのWebAudioを使用）
- シーン配列: `[BootScene, MenuScene, GameScene, GameOverScene]`

## 音声トリガーとなるゲームイベント

### GameScene 内
| イベント | 発生箇所 | 推奨SFX |
|---------|---------|---------|
| ジャンプ | `player.jump()` - isOnGround時 | jump.ogg |
| 2段ジャンプ | `player.jump()` - airJump時 | double-jump.ogg |
| ダメージ | `lifeManager.takeDamage()` | hit.ogg |
| コイン取得 | `item.deactivate()` in checkCollisions | coin.ogg |
| 回復アイテム | `lifeManager.recover()` | heal.ogg |
| パワーアップ取得 | `powerUpManager.collect()` | powerup.ogg |
| ゲームオーバー | `gameStateManager.endGame()` | gameover.ogg |
| カウントダウン | `hud.showCountdown()` | beep.ogg / go.ogg |
| レベルアップ | `difficultyManager.update()` | levelup.ogg |

### MenuScene / GameOverScene
| イベント | 推奨音声 |
|---------|---------|
| MenuScene 表示 | menu-bgm.ogg（ループ） |
| ゲーム開始 | BGM切り替え → game-bgm.ogg |
| ゲームオーバー画面 | BGM停止、gameover-bgm.ogg |

## 音声ファイル配置場所

```
endless-runner/
└── public/
    └── audio/          ← 新規作成
        ├── bgm/
        │   ├── menu-bgm.ogg
        │   ├── game-bgm.ogg
        │   └── gameover-bgm.ogg
        └── sfx/
            ├── jump.ogg
            ├── double-jump.ogg
            ├── hit.ogg
            ├── coin.ogg
            ├── heal.ogg
            ├── powerup.ogg
            ├── gameover.ogg
            ├── beep.ogg
            └── levelup.ogg
```

## Phaser Audio API 要点

- `this.sound.add(key, { loop: true })` → BGM
- `this.sound.play(key)` → 一発SFX
- `this.sound.pauseAll()` / `this.sound.resumeAll()` → ポーズ対応
- BGMはシーン間で持続させるには `scene.sys.sound`（global）を使うか、専用の AudioScene を作る
- `WebAudioContext` はユーザーインタラクション後に初期化が必要（Phaser が自動対応）
