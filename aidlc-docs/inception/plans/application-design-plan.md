# Application Design Plan

## 設計対象
iOSエンドレスランナーゲーム（Flutter + Flame）

---

## 設計するコンポーネント一覧（案）

要件を分析した結果、以下のコンポーネント構成を提案します。

### ゲームコンポーネント（Flame）
| コンポーネント | 責務 |
|--------------|------|
| `GameScene` | ゲームループ管理・コンポーネント統括 |
| `PlayerCharacter` | プレイヤーの移動・ジャンプ・衝突判定 |
| `ObstacleManager` | 障害物（静止・動く）のスポーン・管理 |
| `PowerUpManager` | パワーアップアイテムのスポーン・効果管理 |
| `ScoreManager` | スコア計算・ハイスコア保存/読込 |
| `GameHUD` | ゲーム中UI（スコア表示・パワーアップ表示） |

### 画面（Flutter）
| コンポーネント | 責務 |
|--------------|------|
| `MainMenuScreen` | タイトル画面・ハイスコア表示・ゲーム開始 |
| `GameOverScreen` | ゲームオーバー画面・スコア表示・リトライ |

### サービス
| サービス | 責務 |
|---------|------|
| `GameService` | 画面遷移・ゲーム状態管理（メニュー→ゲーム→ゲームオーバー） |
| `PersistenceService` | ローカルデータ保存（shared_preferences でハイスコア管理） |

---

## 設計計画チェックリスト

- [x] components.md — コンポーネント定義・責務
- [x] component-methods.md — メソッドシグネチャ
- [x] services.md — サービス定義・オーケストレーション
- [x] component-dependency.md — 依存関係・通信パターン

---

## 設計確認質問

設計を確定するために、以下の点を確認させてください。

---

### Question 1
オーディオ（BGM・効果音）はこのプロジェクトのスコープに含めますか？

A) はい、BGMと効果音を実装したい
B) 効果音のみ実装したい（ジャンプ、ゲームオーバーなど）
C) いいえ、今回はオーディオなしでシンプルに作りたい
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 2
パワーアップは「ダブルジャンプ」のみですか？それとも他のパワーアップも追加したいですか？

A) ダブルジャンプのみでいい（シンプルに）
B) もう1〜2種類追加したい（例：無敵時間、スロー効果など）
C) Other (please describe after [Answer]: tag below)

[Answer]: C 今後追加可能な仕組みを導入したい

---

### Question 3
背景はスクロールする演出（視差スクロール）を入れたいですか？

A) はい、奥行き感のある視差スクロール（遠景・近景）を入れたい
B) シンプルな単色または静止画背景でいい
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

回答が完了したら「**完了しました**」とお知らせください。
