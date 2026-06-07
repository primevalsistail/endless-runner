# Unit of Work Story Map — 機能要件とユニットのマッピング

## 機能要件 → ユニットマッピング

> **v2 更新**: Phaser.js + TypeScript 向けに更新

| 機能要件 ID | 内容 | ユニット | 主要コンポーネント |
|-----------|------|---------|----------------|
| FR-01 | エンドレスランナーゲームプレイ | Unit 1 | GameScene, Player |
| FR-01 | シングルジャンプ | Unit 1 | Player |
| FR-01 | ダブルジャンプ（パワーアップ時） | Unit 1 | Player, DoubleJumpPowerUp |
| FR-01 | 速度増加（難易度） | Unit 1 | DifficultyManager, ObstacleManager |
| FR-01 | 静止障害物 | Unit 1 | ObstacleManager, StaticObstacle |
| FR-01 | 動く障害物 | Unit 1 | ObstacleManager, MovingObstacle |
| FR-01 | 衝突でゲームオーバー | Unit 1 | Player → GameStateManager |
| FR-02 | スコアリアルタイム計算 | Unit 1 | ScoreManager |
| FR-02 | ゲームオーバー時スコア表示 | Unit 2 | GameOverScene |
| FR-02b | パワーアップスポーン | Unit 1 | PowerUpManager |
| FR-02b | パワーアップ効果適用 | Unit 1 | PowerUpManager, Player |
| FR-03 | ゲーム中スコア表示 | Unit 1 | GameHUD |
| FR-03 | パワーアップ状態表示 | Unit 1 | GameHUD |
| FR-03 | ホーム/スタート画面 | Unit 2 | MenuScene |
| FR-03 | ゲームオーバー画面 | Unit 2 | GameOverScene |
| FR-04 | ハイスコア保存 | Unit 1+2 | ScoreManager（Unit 1）+ StorageService（Unit 2） |
| FR-04 | ハイスコア表示 | Unit 2 | MenuScene, GameOverScene |
| NFR-01 | 60fps 動作 | Unit 1 | GameScene（Phaser デフォルト） |
| NFR-COMPAT | ブラウザ対応（Chrome/Safari/Firefox） | Unit 2 | Vite ビルド設定 |
| NFR-COMPAT | iPhone Safari 対応（iOS 16+・横向き） | Unit 2 | Vite ビルド設定 |
| NFR-03 | オフライン動作 | Unit 1+2 | 外部通信なし |
| NFR-DEPLOY | GitHub Pages 公開 | Unit 2 | GitHub Pages デプロイ設定 |

## ユニット別サマリー

### Unit 1: game-core
- **機能要件カバー**: FR-01（全）, FR-02（計算部分）, FR-02b, FR-03（HUD）, FR-04（計算）
- **主な責務**: ゲームが「動く」ためのすべて

### Unit 2: ui-infrastructure
- **機能要件カバー**: FR-02（表示）, FR-03（画面）, FR-04（表示・保存）, NFR-COMPAT, NFR-DEPLOY
- **主な責務**: ゲームを「包む」画面・保存・ビルド・デプロイ基盤
