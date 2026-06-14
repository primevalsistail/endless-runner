# Requirements: BGM & 効果音実装

## Intent Analysis

| 項目 | 内容 |
|------|------|
| **リクエスト** | BGMと効果音の追加 |
| **タイプ** | New Feature（音声システム全体の新設） |
| **スコープ** | Multiple Components（BootScene, MenuScene, GameScene, GameOverScene, HUD, GameConfig, 新規AudioManager） |
| **複雑度** | Moderate（音声管理サービスの新設・UIの追加・ポーズ連動あり） |

---

## Functional Requirements

### FR-1: BGM

| ID | 要件 | 詳細 |
|----|------|------|
| FR-1.1 | メニューBGM | MenuSceneでサイバーパンク/シンセウェーブ系BGMをループ再生 |
| FR-1.2 | ゲームBGM | GameSceneでサイバーパンク/シンセウェーブ系BGMをループ再生 |
| FR-1.3 | シーン切り替え | Menu→GameSceneでBGM切り替え。GameScene→GameOverSceneでBGM停止 |
| FR-1.4 | フリー素材 | freesound.org / OpenGameArt等から調達（.ogg推奨） |

### FR-2: 効果音（SFX）

| ID | SFX名 | トリガー箇所 |
|----|-------|------------|
| FR-2.1 | jump | `Player.jump()` - 地上からジャンプ時 |
| FR-2.2 | double-jump | `Player.jump()` - 空中2段ジャンプ時 |
| FR-2.3 | hit | `LifeManager.takeDamage()` - 障害物ヒット時 |
| FR-2.4 | coin | `checkCollisions()` - スコアアイテム取得時 |
| FR-2.5 | heal | `LifeManager.recover()` - 回復アイテム取得時 |
| FR-2.6 | powerup | `PowerUpManager.collect()` - パワーアップ取得時 |
| FR-2.7 | gameover | `GameStateManager.endGame()` - ゲームオーバー時 |

### FR-3: 音量調整UI

| ID | 要件 | 詳細 |
|----|------|------|
| FR-3.1 | BGM音量スライダー | 0〜100%で調整可能 |
| FR-3.2 | SFX音量スライダー | 0〜100%で調整可能 |
| FR-3.3 | UIの配置 | MenuScene内に設定エリアとして配置 |
| FR-3.4 | 設定の永続化 | LocalStorageに保存・次回起動時に復元 |
| FR-3.5 | ネオンUIデザイン | 既存のネオンシティUIデザインに統一 |

### FR-4: ポーズ時の音声制御

| ID | 要件 | 詳細 |
|----|------|------|
| FR-4.1 | SFX停止 | ポーズ中は全SFX再生を停止 |
| FR-4.2 | BGM音量ダウン | ポーズ中はBGMを低音量（例: 30%）に下げる |
| FR-4.3 | 復帰時リストア | ポーズ解除後にBGMを元の音量に戻す |

---

## Non-Functional Requirements

| ID | 要件 | 詳細 |
|----|------|------|
| NFR-1 | Autoplay Policy対応 | ブラウザのAutoplay規制に準拠（ユーザーインタラクション後に音声開始） |
| NFR-2 | ファイル形式 | .ogg（Web互換性が高い）、必要に応じて.mp3フォールバック |
| NFR-3 | 設定永続化 | LocalStorageへ保存（既存StorageServiceを拡張） |
| NFR-4 | パフォーマンス | Phaser WebAudio APIを使用（低レイテンシSFX） |

---

## Technical Design Notes

### 新規コンポーネント
- **`AudioManager`**: シングルトンパターンで全音声を一元管理
  - BGM再生/停止/フェード
  - SFX再生（isEnabled チェック付き）
  - 音量設定の読み書き

### 既存コンポーネントへの変更
| ファイル | 変更内容 |
|---------|---------|
| `BootScene.ts` | BGM + SFXファイルのpreload追加 |
| `MenuScene.ts` | AudioManager初期化、メニューBGM開始、音量調整UI追加 |
| `GameScene.ts` | ゲームBGM開始、各イベントでSFX再生、ポーズ連動 |
| `GameOverScene.ts` | BGM停止、gameover SFX再生 |
| `StorageService.ts` | BGM/SFX音量の保存・読み込みメソッド追加 |
| `GameConfig.ts` | デフォルト音量定数の追加 |

### ファイル構成（公開ディレクトリ）
```
public/audio/
├── bgm/
│   ├── menu-bgm.ogg
│   └── game-bgm.ogg
└── sfx/
    ├── jump.ogg
    ├── double-jump.ogg
    ├── hit.ogg
    ├── coin.ogg
    ├── heal.ogg
    ├── powerup.ogg
    └── gameover.ogg
```

---

## Out of Scope（今回は対象外）

- カウントダウン音（3・2・1・GO!）
- レベルアップ効果音
- ゲームオーバー画面BGM
