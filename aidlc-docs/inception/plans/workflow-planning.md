# 📋 Workflow Planning — Execution Plan

> **v2 更新**: Phaser.js（ブラウザゲーム）へ変更。スコープを技術デモに再設定。

## プロジェクト概要

- **プロジェクト**: ブラウザ動作のエンドレスランナーゲーム（Phaser.js + TypeScript）
- **種別**: グリーンフィールド（新規）
- **スコープ**: 技術デモ（v1 完成後に方向を判断）
- **開発環境**: Windows PC + WSL / VS Code

---

## Change Impact Assessment

| 影響領域 | 有無 | 内容 |
|---------|------|------|
| ユーザー向け変更 | Yes | ゲーム全体がユーザー向けの新規機能 |
| 構造的変更 | Yes | 新規アプリ（Phaser.js シーン構成） |
| データモデル変更 | Yes | ゲーム状態・スコア・パワーアップ |
| API変更 | No | 外部APIなし |
| NFR影響 | Yes | ブラウザ動作・iPhone Safari 対応 |

## Risk Assessment

- **リスクレベル**: Low
- **ロールバック複雑度**: Easy（新規開発のため）
- **テスト複雑度**: Simple

---

## Workflow Visualization（テキスト版）

```
INCEPTION PHASE:
  ✅ Workspace Detection    - COMPLETED
  ⬜ Reverse Engineering    - SKIPPED（グリーンフィールドのため）
  ✅ Requirements Analysis  - COMPLETED（v2 更新済み）
  ⬜ User Stories           - SKIPPED（小規模・明確な要件のため）
  ✅ Workflow Planning      - COMPLETED（v2 更新済み）
  ✅ Application Design    - COMPLETED（v2 更新済み）
  ✅ Units Generation      - COMPLETED（v2 更新済み）

CONSTRUCTION PHASE:
  ✅ Functional Design      - COMPLETED（ゲームロジック流用）
  ✅ NFR Requirements       - COMPLETED（v2 更新済み）
  🔶 NFR Design             - EXECUTE
  🔶 Infrastructure Design  - EXECUTE（Vite + GitHub Pages 設定）
  🔶 Code Generation        - EXECUTE
  🔶 Build and Test         - EXECUTE

OPERATIONS PHASE:
  ⬜ Operations             - PLACEHOLDER
```

---

## 実行するステージ

### 🔵 INCEPTION PHASE（完了・v2 更新済み）
| ステージ | 状態 |
|--------|------|
| Workspace Detection | ✅ 完了 |
| Requirements Analysis | ✅ 完了（v2） |
| Workflow Planning | ✅ 完了（v2） |
| Application Design | ✅ 完了（v2） |
| Units Generation | ✅ 完了（v2） |

### 🟢 CONSTRUCTION PHASE
| ステージ | 状態 | 備考 |
|--------|------|------|
| Functional Design | ✅ 完了 | ゲームロジックは流用。v2 変更なし |
| NFR Requirements | ✅ 完了（v2） | Phaser.js 向けに更新 |
| NFR Design | 🔶 EXECUTE | 次のステージ |
| Infrastructure Design | 🔶 EXECUTE | Vite 設定・GitHub Pages |
| Code Generation | 🔶 EXECUTE | |
| Build and Test | 🔶 EXECUTE | |

---

## スキップするステージ

| ステージ | 理由 |
|--------|------|
| Reverse Engineering | グリーンフィールド |
| User Stories | 小規模・個人・明確な要件 |
| Operations | プレースホルダー |

---

## ユニット構成

| ユニット | 内容 |
|--------|------|
| Unit 1: game-core | GameScene・Player・障害物・パワーアップ・スコア・HUD |
| Unit 2: ui-infrastructure | MenuScene・GameOverScene・StorageService・Vite 設定・GitHub Pages デプロイ |

---

## 技術デモ完成基準

- [ ] ジャンプ・障害物・スコア・ゲームオーバー・リトライが動作する
- [ ] iPhone Safari（横向き）で動作確認できる
- [ ] GitHub Pages または localhost で公開できる
