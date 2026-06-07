# Domain Entities — Unit 2: ui-infrastructure

## BootScene

| 属性 | 型 | 説明 |
|------|-----|------|
| — | — | アセットなし。設定のみ |

**責務**: 起動直後に MenuScene へ即座に遷移。将来のアセットロードのエントリーポイント。

---

## MenuScene

| 要素 | 型 | 説明 |
|------|-----|------|
| titleText | Phaser.GameObjects.Text | ゲームタイトル表示 |
| highScoreText | Phaser.GameObjects.Text | "BEST: 0" 形式で表示 |
| startButton | Phaser.GameObjects.Text | タップ/クリックで GameScene へ遷移 |
| highScore | number | StorageService から読み込んだ値 |

---

## GameOverScene

| 要素 | 型 | 説明 |
|------|-----|------|
| score | number | GameScene から受け取った最終スコア |
| highScore | number | StorageService から読み込んだ値 |
| scoreText | Phaser.GameObjects.Text | "SCORE: 123" 表示 |
| highScoreText | Phaser.GameObjects.Text | "BEST: 456" 表示 |
| retryButton | Phaser.GameObjects.Text | GameScene を再スタート |
| menuButton | Phaser.GameObjects.Text | MenuScene へ戻る |

---

## StorageService

| メソッド | 返り値 | 説明 |
|---------|-------|------|
| `saveHighScore(score: number)` | void | localStorage に保存。例外時は無視 |
| `loadHighScore()` | number | localStorage から読み込み。例外・未設定時は 0 を返す |

**キー**: `endless_runner_high_score`（GameConfig.HIGH_SCORE_KEY）
