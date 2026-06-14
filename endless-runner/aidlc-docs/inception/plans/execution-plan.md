# Execution Plan: BGM & 効果音実装

## Detailed Analysis Summary

### Transformation Scope
- **変換タイプ**: Single-feature addition（音声システム全体の新設）
- **主要変更**: 新規 AudioManager サービス + 既存5シーン/サービスへの統合
- **関連コンポーネント**: BootScene, MenuScene, GameScene, GameOverScene, StorageService, GameConfig

### Change Impact Assessment
- **User-facing changes**: Yes — 音量調整UI がMenuSceneに追加される
- **Structural changes**: Yes — AudioManager（singleton）が新設される
- **Data model changes**: Yes — LocalStorageに音量設定が追加される
- **API changes**: No — 外部APIなし
- **NFR impact**: Yes — Autoplay Policy対応が必要

### Component Relationships

```
GameConfig ← AudioManager → StorageService（拡張）
                ↑               
    BootScene（preload）        
    MenuScene（BGM, UI）        
    GameScene（BGM, SFX, pause）
    GameOverScene（BGM stop, SFX）
```

### Risk Assessment
- **Risk Level**: Low
  - Phaser の組み込み Sound API を使用
  - 既存ゲームロジックへの影響なし
  - フリー素材の調達は事前に実施
- **Rollback Complexity**: Easy（音声ファイルとAudioManagerを削除するだけ）
- **Testing Complexity**: Simple（目視・聴覚確認で十分）

---

## Workflow Visualization

```mermaid
flowchart TD
    Start(["BGM & 効果音実装"])

    subgraph INCEPTION["🔵 INCEPTION PHASE"]
        WD["Workspace Detection\nCOMPLETED"]
        RE["Reverse Engineering\nCOMPLETED"]
        RA["Requirements Analysis\nCOMPLETED"]
        US["User Stories\nSKIP"]
        WP["Workflow Planning\nIN PROGRESS"]
        AD["Application Design\nEXECUTE"]
        UG["Units Generation\nSKIP"]
    end

    subgraph CONSTRUCTION["🟢 CONSTRUCTION PHASE"]
        FD["Functional Design\nSKIP"]
        NFRA["NFR Requirements\nSKIP"]
        NFRD["NFR Design\nSKIP"]
        ID["Infrastructure Design\nSKIP"]
        CG["Code Generation\nEXECUTE"]
        BT["Build and Test\nEXECUTE"]
    end

    subgraph OPERATIONS["🟡 OPERATIONS PHASE"]
        OPS["Operations\nPLACEHOLDER"]
    end

    Start --> WD --> RE --> RA --> WP
    WP -.-> US
    WP --> AD
    AD --> CG
    US -.-> CG
    UG -.-> CG
    FD -.-> CG
    NFRA -.-> CG
    NFRD -.-> CG
    ID -.-> CG
    CG --> BT
    BT -.-> OPS
    BT --> End(["Complete"])

    style WD fill:#4CAF50,stroke:#1B5E20,stroke-width:3px,color:#fff
    style RE fill:#4CAF50,stroke:#1B5E20,stroke-width:3px,color:#fff
    style RA fill:#4CAF50,stroke:#1B5E20,stroke-width:3px,color:#fff
    style WP fill:#4CAF50,stroke:#1B5E20,stroke-width:3px,color:#fff
    style AD fill:#FFA726,stroke:#E65100,stroke-width:3px,stroke-dasharray: 5 5,color:#000
    style US fill:#BDBDBD,stroke:#424242,stroke-width:2px,stroke-dasharray: 5 5,color:#000
    style UG fill:#BDBDBD,stroke:#424242,stroke-width:2px,stroke-dasharray: 5 5,color:#000
    style FD fill:#BDBDBD,stroke:#424242,stroke-width:2px,stroke-dasharray: 5 5,color:#000
    style NFRA fill:#BDBDBD,stroke:#424242,stroke-width:2px,stroke-dasharray: 5 5,color:#000
    style NFRD fill:#BDBDBD,stroke:#424242,stroke-width:2px,stroke-dasharray: 5 5,color:#000
    style ID fill:#BDBDBD,stroke:#424242,stroke-width:2px,stroke-dasharray: 5 5,color:#000
    style CG fill:#4CAF50,stroke:#1B5E20,stroke-width:3px,color:#fff
    style BT fill:#4CAF50,stroke:#1B5E20,stroke-width:3px,color:#fff
    style OPS fill:#BDBDBD,stroke:#424242,stroke-width:2px,stroke-dasharray: 5 5,color:#000
    style Start fill:#CE93D8,stroke:#6A1B9A,stroke-width:3px,color:#000
    style End fill:#CE93D8,stroke:#6A1B9A,stroke-width:3px,color:#000
    style INCEPTION fill:#BBDEFB,stroke:#1565C0,stroke-width:3px,color:#000
    style CONSTRUCTION fill:#C8E6C9,stroke:#2E7D32,stroke-width:3px,color:#000
    style OPERATIONS fill:#FFF59D,stroke:#F57F17,stroke-width:3px,color:#000

    linkStyle default stroke:#333,stroke-width:2px
```

---

## Phases to Execute

### 🔵 INCEPTION PHASE
- [x] Workspace Detection — COMPLETED
- [x] Reverse Engineering — COMPLETED（音声関連フォーカス）
- [x] Requirements Analysis — COMPLETED
- [ ] User Stories — **SKIP**
  - **理由**: 機能が明確でシンプル。受け入れ基準は要件ドキュメントで十分。
- [x] Workflow Planning — IN PROGRESS（本ドキュメント）
- [ ] Application Design — **EXECUTE**
  - **理由**: 新規コンポーネント（AudioManager）の設計が必要。既存シーンとのI/F定義が必要。
- [ ] Units Generation — **SKIP**
  - **理由**: 実装単位は「音声システム」の1ユニットのみ。分解不要。

### 🟢 CONSTRUCTION PHASE
- [ ] Functional Design — **SKIP**
  - **理由**: 音声再生に複雑なビジネスロジックなし。AudioManagerのI/Fで十分。
- [ ] NFR Requirements — **SKIP**
  - **理由**: NFR要件（Autoplay Policy, .ogg形式, LocalStorage永続化）は要件で特定済み。
- [ ] NFR Design — **SKIP**
  - **理由**: NFR Requirements をスキップのため不要。
- [ ] Infrastructure Design — **SKIP**
  - **理由**: インフラ変更なし。ブラウザゲームの内部機能のみ。
- [ ] Code Generation — **EXECUTE**（ALWAYS）
  - **理由**: 実装が必要。
- [ ] Build and Test — **EXECUTE**（ALWAYS）
  - **理由**: ビルド・動作確認が必要。

### 🟡 OPERATIONS PHASE
- [ ] Operations — PLACEHOLDER（将来予定）

---

## Estimated Timeline
- **実行ステージ数**: 3（Application Design, Code Generation, Build and Test）
- **スキップ数**: 7
- **推定所要時間**: 1〜2セッション

## Success Criteria
- **Primary Goal**: BGM2曲・SFX7種の実装、音量調整UIの提供
- **Key Deliverables**:
  - `AudioManager.ts`（新規）
  - 音声ファイル（public/audio/）
  - 音量調整UI（MenuScene内）
  - StorageService の音量設定永続化
- **Quality Gates**:
  - ゲームプレイ中に音が鳴ること
  - ポーズ時にSFX停止・BGM音量ダウンが動作すること
  - 音量設定が再起動後も維持されること
  - ブラウザのAutoplay Policyに違反しないこと
