# Tech Stack Decisions — Unit 1: game-core

> **v2 更新**: Flutter + Flame → Phaser.js + TypeScript

## 確定技術スタック

| レイヤー | 採用技術 | 選定理由 |
|---------|---------|---------|
| 言語 | TypeScript | 型安全・VS Code との相性◎・JavaScript として動作 |
| ゲームエンジン | Phaser 3.x（最新安定版） | ブラウザ向け定番 2D エンジン。iPhone Safari 対応。Mac 不要 |
| バンドラー | Vite | 軽量・高速な開発サーバー。TypeScript をそのまま扱える |
| データ保存 | localStorage | ブラウザ標準。追加ライブラリ不要 |
| 開発 IDE | VS Code（Windows / WSL） | TypeScript・Phaser の補完対応 |
| テスト確認 | localhost + iPhone Safari | ローカルネットワーク経由で実機確認 |
| 配布 | GitHub Pages | 無料・Mac 不要・静的サイトとしてそのまま公開 |

## 見送った選択肢

| 技術 | 見送り理由 |
|------|-----------|
| Flutter + Flame | iOS ビルドに Codemagic 等が必要。設定コストが高い |
| Unity | 学習コスト大・ビルドに専用環境が必要 |
| React + PixiJS | ゲーム向け機能が少ない。物理エンジン統合が手間 |

## Phaser.js 採用の利点

- **Windows 完結**: npm start で即座に開発サーバー起動
- **iPhone 確認**: 同一 Wi-Fi 上の iPhone Safari からアクセスするだけ
- **低コスト公開**: GitHub Pages に push するだけで公開完了
- **拡張性**: ゲームジャンル変更時も Phaser のシーン構成が流用できる
- **TypeScript 対応**: `@types/phaser` で型補完あり
