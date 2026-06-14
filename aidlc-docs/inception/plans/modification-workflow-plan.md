# Workflow Plan - endless-runner v1.1 改修

## 実行フェーズ概要

```
INCEPTION PHASE
  [x] Workspace Detection   (完了)
  [-] Reverse Engineering   (SKIP - 既存アーティファクトあり、コード直接確認済み)
  [x] Requirements Analysis (完了)
  [-] User Stories          (SKIP - 新ユーザーペルソナなし、既存ゲームへの機能追加)
  [ ] Workflow Planning     (現在実行中)
  [-] Application Design    (SKIP - 既存パターンの踏襲で設計は自明)
  [-] Units Generation      (SKIP - 単一ユニット、全変更が密結合)

CONSTRUCTION PHASE - Unit: game-feature-v1.1
  [-] Functional Design     (SKIP - 要件定義で十分詳細)
  [-] NFR Requirements      (SKIP - 技術スタック変更なし)
  [-] NFR Design            (SKIP)
  [-] Infrastructure Design (SKIP - インフラ変更なし)
  [ ] Code Generation       (実行)
  [ ] Build and Test        (実行)
```

## スキップ理由

| ステージ | 理由 |
|----------|------|
| Reverse Engineering | 既存コードを直接確認済み。前サイクルの設計アーティファクトも存在 |
| User Stories | ゲームへの機能追加のみ。ユーザーペルソナの変化なし |
| Application Design | 新コンポーネントはすべて既存パターン（Pool / Manager / PowerUp 抽象クラス）の踏襲。設計判断は自明 |
| Units Generation | 全変更が GameScene を起点に密結合。単一ユニットとして実装するのが最適 |
| Functional / NFR / Infra Design | 要件定義が具体的で、技術スタック・インフラに変更なし |

## Code Generation 対象ファイル

### 新規作成（6ファイル）

| ファイル | 内容 |
|---------|------|
| `src/managers/LifeManager.ts` | ライフ管理（最大3・ダメージ・無敵時間・回復） |
| `src/objects/ProjectileObstacle.ts` | 直線飛来障害物（3レーン対応） |
| `src/objects/ScoreItem.ts` | 得点アイテム（+100スコア） |
| `src/objects/RecoveryItem.ts` | 回復アイテム（ライフ+1） |
| `src/managers/ItemManager.ts` | ScoreItem / RecoveryItem のスポーン・収集管理 |
| `src/powerups/InvincibilityPowerUp.ts` | 無敵パワーアップ（既存 PowerUp 抽象クラス継承） |

### 変更（5ファイル）

| ファイル | 変更内容 |
|---------|---------|
| `src/config/GameConfig.ts` | MAX_LIVES, PROJECTILE_Y 定数, アイテム定数を追加 |
| `src/managers/ObstacleManager.ts` | ProjectileObstacle プールとスポーン処理を追加 |
| `src/scenes/GameScene.ts` | LifeManager / ItemManager 統合、衝突処理更新、無敵考慮 |
| `src/hud/GameHUD.ts` | ライフ表示・無敵パワーアップ表示を追加 |
| `src/managers/ScoreManager.ts` | `addBonus(amount: number)` メソッドを追加 |

## 実装順序

1. `GameConfig.ts` — 定数追加（他全ファイルが依存）
2. `LifeManager.ts` — ライフ管理（GameScene が依存）
3. `ProjectileObstacle.ts` → `ObstacleManager.ts` — 新障害物
4. `ScoreItem.ts` → `RecoveryItem.ts` → `ItemManager.ts` — アイテム群
5. `InvincibilityPowerUp.ts` → `PowerUpManager.ts` の spawn 更新
6. `ScoreManager.ts` — addBonus 追加
7. `GameHUD.ts` — UI 更新
8. `GameScene.ts` — 全統合
