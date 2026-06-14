# Audio Files

このディレクトリに音声ファイルを配置してください。

## 必要なファイル

### BGM（`bgm/` フォルダ）

| ファイル名 | 用途 | スタイル |
|-----------|------|---------|
| `menu-bgm.ogg` | メニュー画面BGM（ループ） | サイバーパンク／シンセウェーブ |
| `game-bgm.ogg` | ゲームプレイBGM（ループ） | サイバーパンク／シンセウェーブ（テンポ速め） |

### SFX（`sfx/` フォルダ）

| ファイル名 | 用途 |
|-----------|------|
| `jump.ogg` | ジャンプ |
| `double-jump.ogg` | 2段ジャンプ |
| `hit.ogg` | 障害物ヒット・ダメージ |
| `coin.ogg` | コイン／スコアアイテム取得 |
| `heal.ogg` | 回復アイテム取得 |
| `powerup.ogg` | パワーアップ取得 |
| `gameover.ogg` | ゲームオーバー |

## 推奨素材サイト

- **[OpenGameArt.org](https://opengameart.org/)** — ゲーム用フリー素材（CC0/CC-BY等）
  - 検索例: "synthwave bgm loop", "8bit jump sfx", "game over jingle"
- **[freesound.org](https://freesound.org/)** — 効果音中心（要アカウント、CC0多数）
  - 検索例: "jump", "coin collect", "hit damage", "game over"
- **[itch.io](https://itch.io/game-assets/free/tag-sound-effects)** — ゲーム素材パック

## ファイル形式

- **推奨**: `.ogg`（Web互換性が高い、ファイルサイズ小）
- **代替**: `.mp3`（必要な場合は BootScene.ts の拡張子を変更）
