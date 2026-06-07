# Unit of Work Dependency — ユニット間依存関係

> **v2 更新**: Phaser.js + TypeScript 向けに更新

## 依存関係マトリクス

| ユニット | 依存先ユニット | 依存の種類 |
|---------|-------------|-----------|
| Unit 1: game-core | なし | — |
| Unit 2: ui-infrastructure | Unit 1: game-core | 実行時依存（GameScene を呼び出す） |

## 依存の詳細

### Unit 2 → Unit 1 の依存

```
MenuScene（Unit 2）
    └─ Phaser.scene.start('GameScene') で GameScene（Unit 1）を起動

GameOverScene（Unit 2）
    └─ Phaser.scene.start('GameScene') でリトライ
       GameStateManager.endGame() からスコアを受け取る

StorageService（Unit 2）
    └─ ScoreManager（Unit 1）から IPersistenceService 経由で呼び出される
       （Unit 1 が IPersistenceService インターフェースに依存し、
        Unit 2 の StorageService が実装を提供する）
```

## 開発順序の根拠

```
Unit 1 (game-core)
    │  ゲームが動いていないとUIの動作確認ができないため先に開発
    │
    ▼
Unit 2 (ui-infrastructure)
       Unit 1 完了後、画面遷移・インフラを整備して GitHub Pages 公開可能な状態にする
```

## インターフェース契約

Unit 1 開発中に Unit 2 への依存を避けるため、以下のインターフェースを先に定義する：

| インターフェース | 定義側 | 実装側 | 利用側 |
|--------------|-------|-------|-------|
| `IPersistenceService.saveHighScore()` | Unit 1 | Unit 2 (StorageService) | Unit 1 (ScoreManager) |
| `IPersistenceService.loadHighScore()` | Unit 1 | Unit 2 (StorageService) | Unit 1 (ScoreManager) |

> **注意**: ScoreManager（Unit 1）が IPersistenceService（Unit 1 定義）を呼び出すため、
> Unit 1 開発時は IPersistenceService のスタブ実装を用意してテストする。
