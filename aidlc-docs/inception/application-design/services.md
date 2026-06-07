# Services — サービス定義

> **v2 更新**: Phaser.js + TypeScript 向けに更新

## GameStateManager

### 概要
ゲーム全体の状態マシンを管理するクラス。GameScene 内でインスタンス化。

### 状態遷移
```
[countdown] --GO!--> [playing] --衝突--> [gameOver]
                                              |
                    <--retry()-------------- |
                    <--toMenu()----------[menu scene]
```

### 責務
- GameState（countdown / playing / gameOver）の保持と遷移制御
- Phaser の scene.start() を使ったシーン遷移のトリガー
- スコア情報を GameOverScene へ受け渡し

---

## StorageService

### 概要
ブラウザの localStorage を使ってデータを保存するクラス。シングルトン。

### 責務
- ハイスコアの永続保存・読込
- ブラウザを閉じてもデータを維持
- IPersistenceService インターフェースを実装

### 保存データ形式

| キー | 型 | 内容 |
|-----|-----|------|
| `endless_runner_high_score` | number | ローカルハイスコア |
