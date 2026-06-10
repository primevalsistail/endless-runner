# Endless Runner

ブラウザで遊べる横スクロール型エンドレスランナーゲームです。

**Play:** https://primevalsistail.github.io/endless-runner/

## ゲームの遊び方

- **スペースキー / クリック / タップ** でジャンプ
- 長押しで高くジャンプできます
- 障害物を避けながら走り続けてスコアを稼ごう
- ダブルジャンプのパワーアップを取ると空中でもう一度ジャンプできます

## ゲームの特徴

- 距離に応じて難易度が上昇（スピードアップ・障害物頻度増加）
- 静止障害物 / 動く障害物の2種類
- ダブルジャンプパワーアップアイテム
- ハイスコアをローカルに保存

## 開発

```bash
npm install
npm run dev     # 開発サーバー起動
npm run build   # ビルド
npm test        # テスト実行
```

## 技術スタック

- [Phaser 3](https://phaser.io/) — ゲームエンジン
- TypeScript
- Vite
- GitHub Pages（自動デプロイ）
