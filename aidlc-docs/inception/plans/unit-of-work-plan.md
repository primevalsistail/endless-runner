# Unit of Work Plan

## ユニット構成（提案）

ワークフロープランで合意した通り、2ユニットに分割します。

---

### Unit 1: Game Core
**概要**: ゲームの中心ロジックと演出

| 含まれるコンポーネント | 理由 |
|----------------------|------|
| GameScene | ゲームループの中核 |
| PlayerCharacter | プレイヤー制御 |
| ObstacleManager / StaticObstacle / MovingObstacle | 障害物システム |
| PowerUpManager / PowerUp / DoubleJumpPowerUp | パワーアップシステム |
| ScoreManager | スコア計算 |
| GameHUD | ゲーム中UI |
| ParallaxBackground | 視差スクロール背景 |
| AudioManager | BGM・効果音 |

**開発順序**: 先に実装する（ゲームが動かないとUIの確認もできないため）

---

### Unit 2: UI & Infrastructure
**概要**: Flutter UI画面とCI/CDインフラ

| 含まれるコンポーネント | 理由 |
|----------------------|------|
| MainMenuScreen | タイトル画面 |
| GameOverScreen | ゲームオーバー画面 |
| GameService | 画面遷移・状態管理 |
| PersistenceService | ハイスコード永続化 |
| Codemagic CI/CD 設定 | iOS ビルド・TestFlight 配布 |

**開発順序**: Unit 1 完了後に実装

---

## 生成チェックリスト

- [x] unit-of-work.md — ユニット定義・責務
- [x] unit-of-work-dependency.md — ユニット間依存関係
- [x] unit-of-work-story-map.md — 機能要件とユニットのマッピング
