# 開発環境・アプローチ確認

Mac なしで iOS アプリを開発・公開する方法はいくつかあります。
それぞれの特徴をまとめたので、希望するアプローチを選んでください。

---

## 選択肢の概要

| 方法 | 難易度 | Mac 不要 | App Store 公開 | ゲーム適性 |
|------|--------|----------|----------------|------------|
| A) Flutter + Flame + クラウドビルド | 中 | ✅ | ✅ | ◎ |
| B) Swift Playgrounds（iPad/iPhoneで開発） | 低 | ✅ | ✅（制限あり） | △ |
| C) クラウド Mac サービスを使う | 中 | ✅（有料） | ✅ | ◎ |
| D) ブラウザゲーム（PWA）に変更 | 低 | ✅ | ❌（App Storeなし） | ○ |

---

## Question 1
どのアプローチを希望しますか？

A) **Flutter + Flame + クラウドビルド（推奨）**
   → Windows/Linux PC でゲームを開発し、Codemagic などのクラウドサービスで iOS ビルドを自動生成。App Store 公開も可能。無料枠あり。

B) **Swift Playgrounds（iPad / iPhone 上で開発）**
   → 持っている iOS デバイス上でそのまま Swift コードを書いて App Store に直接公開できる。ただし IDE が小さく、複雑なゲームには向かない。

C) **クラウド Mac を借りる（例: MacinCloud、MacStadium）**
   → 月数百円〜でリモート Mac にアクセスして Xcode を使う。フル Swift/SpriteKit 開発ができるが費用がかかる。

D) **Web ゲーム（PWA）に変更する**
   → ブラウザで動くゲームを作る（HTML5/JavaScript）。iOS Safari で遊べるが App Store には載らない。

E) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2
現在、開発に使える PC・環境はありますか？

A) Windows PC がある
B) Linux PC がある
C) Chromebook / Web ブラウザのみ
D) iOS デバイス（iPad / iPhone）しかない
E) Other (please describe after [Answer]: tag below)

[Answer]: A, WSLでよければBも

---

回答が完了したら「**完了しました**」とお知らせください。
