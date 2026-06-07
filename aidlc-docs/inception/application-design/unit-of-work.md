# Unit of Work — ユニット定義

> **v2 更新**: Phaser.js + TypeScript 向けに更新

## Unit 1: game-core

| 項目 | 内容 |
|------|------|
| **ユニット名** | game-core |
| **概要** | ゲームの中心ロジック・シーン・オブジェクト |
| **開発順序** | 1番目（先に実装） |

### 含まれるコンポーネント

| コンポーネント | 種別 | 責務 |
|--------------|------|------|
| GameScene | Phaser.Scene | ゲームループ管理・全オブジェクト統括・入力処理 |
| Player | Phaser.Physics.Arcade.Sprite | プレイヤー移動・ジャンプ・パワーアップ状態 |
| Obstacle | Abstract class | 全障害物の基底クラス（OCP 拡張ポイント） |
| StaticObstacle | Obstacle 継承 | 静止障害物 |
| MovingObstacle | Obstacle 継承 | 動く障害物 |
| ObstacleManager | TypeScript class | 障害物のスポーン・速度管理 |
| PowerUpItem | Phaser.GameObjects.Shape | フィールド上のパワーアップアイテム |
| PowerUp | Abstract class | パワーアップ基底クラス（拡張ポイント） |
| DoubleJumpPowerUp | PowerUp 継承 | ダブルジャンプ効果 |
| PowerUpManager | TypeScript class | パワーアップスポーン・効果管理 |
| ScoreManager | TypeScript class | スコア計算・ハイスコード判定 |
| DifficultyManager | TypeScript class | ステップ式難易度管理 |
| GameStateManager | TypeScript class | 状態マシン（countdown→playing→gameOver） |
| GameHUD | Phaser.GameObjects | スコア・パワーアップ残時間の表示 |
| IPersistenceService | Abstract interface | 永続化インターフェース（DIP 境界） |

---

## Unit 2: ui-infrastructure

| 項目 | 内容 |
|------|------|
| **ユニット名** | ui-infrastructure |
| **概要** | UI シーン・データ永続化・ビルド設定 |
| **開発順序** | 2番目（Unit 1 完了後） |

### 含まれるコンポーネント

| コンポーネント | 種別 | 責務 |
|--------------|------|------|
| BootScene | Phaser.Scene | アセット事前読み込み |
| MenuScene | Phaser.Scene | タイトル・ハイスコード表示・開始ボタン |
| GameOverScene | Phaser.Scene | ゲームオーバー・スコア・リトライボタン |
| StorageService | IPersistenceService 実装 | localStorage によるハイスコア保存 |
| Vite 設定 | vite.config.ts | 開発サーバー・ビルド設定 |
| GitHub Pages 設定 | デプロイ設定 | 静的サイトとして公開 |
