# Functional Design Plan — Unit 1: game-core

## 対象ユニット
game-core（ゲームループ・プレイヤー・障害物・パワーアップ・スコア・背景・オーディオ）

## 生成するアーティファクト
- [x] domain-entities.md — ドメインエンティティ定義
- [x] business-logic-model.md — ビジネスロジックモデル
- [x] business-rules.md — ビジネスルール・制約

---

## 設計確認質問

ゲームロジックを正確に設計するために確認させてください。

---

### Question 1
スコアの計算方法はどれにしますか？

A) 生存時間ベース（1秒 = 10点など）
B) 走行距離ベース（移動量に比例）
C) 障害物回避数ベース（1回避 = 点数）
D) Other (please describe after [Answer]: tag below)

[Answer]: B

---

### Question 2
ジャンプの操作感はどうしたいですか？

A) タップで固定の高さにジャンプ（シンプル）
B) 長押しで高くジャンプ（押す時間で高さが変わる）
C) Other (please describe after [Answer]: tag below)

[Answer]: B

---

### Question 3
難易度の上がり方はどうしますか？

A) 時間とともに一定の速さで上がる（線形）
B) 最初はゆっくり、後半に一気に上がる（指数的）
C) 一定時間ごとに段階的に上がる（ステップ式）
D) Other (please describe after [Answer]: tag below)

[Answer]: C

---

### Question 4
速度に上限（最高速度）を設けますか？

A) はい、上限を設ける（ある速さ以上にはならない）
B) いいえ、無制限に上がり続ける
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 5
パワーアップが複数重なった場合の挙動はどうしますか？

A) 後から取ったものに上書き（タイマーリセット）
B) 複数同時に有効にする（スタック可能）
C) 取得中は同じ種類のパワーアップは出現しない
D) Other (please describe after [Answer]: tag below)

[Answer]: 同種は上書き、別種は有効としたい

---

### Question 6
ゲーム開始時の演出はどうしますか？

A) 即スタート（ボタンを押したらすぐ動く）
B) カウントダウンあり（3・2・1・GO！）
C) Other (please describe after [Answer]: tag below)

[Answer]: B

---

回答が完了したら「**完了しました**」とお知らせください。
