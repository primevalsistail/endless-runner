# Application Design Plan: BGM & 効果音

## 設計対象コンポーネント

1. `AudioManager`（新規）— 音声の一元管理
2. `StorageService`（拡張）— 音量設定の永続化
3. `GameConfig`（拡張）— 音量デフォルト値の定数追加
4. `BootScene`（変更）— 音声ファイルのpreload
5. `MenuScene`（変更）— メニューBGM開始・音量調整UI
6. `GameScene`（変更）— ゲームBGM・SFX再生・ポーズ連動
7. `GameOverScene`（変更）— BGM停止・gameover SFX

---

## 設計上の決定が必要な事項

### Question 1
`AudioManager` の実装アーキテクチャをどうしますか？

A) **プレーンTypeScriptシングルトン** — `AudioManager.getInstance()` で各シーンからアクセス。Phaserの `scene.sound` をラップして使用。シンプルで予測可能。
B) **Phaser Scene（AudioScene）として実装** — 常時並行実行するシーンとして登録。Phaser のシーンライフサイクルを活用。BGMのシーン間持続が容易。
C) Other (please describe after [Answer]: tag below)

[Answer]: A（推奨）
※ 理由: Phaser 3 の `this.sound` はグローバルサウンドマネージャー（`game.sound`）であり、シーン切り替えでも自動的にBGMが継続される。Singetonで十分シンプルかつ安全。

---

### Question 2
音量調整UIを MenuScene のどこに配置しますか？

A) **ゲーム開始ボタンの下**（画面中央下段）— 自然な視線の流れ
B) **画面右下の小さなアイコン**（常時表示型）— スタートボタンを邪魔しない
C) **設定アイコンボタンをクリックして開くパネル**（ポップアップ型）— 視覚的にクリーン
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## 設計タスク（回答後に実行）

- [x] components.md — コンポーネント定義と責務
- [x] component-methods.md — メソッドシグネチャ
- [x] services.md — サービス定義とオーケストレーション
- [x] component-dependency.md — 依存関係マップ
