# Business Logic Model — Unit 1: game-core

## 1. ゲーム開始フロー（カウントダウン）

```
[スタート画面] → プレイ開始ボタン押下
    │
    ▼
カウントダウン状態
    ├── プレイヤーは表示されるが動かない
    ├── 障害物・パワーアップはスポーンしない
    └── 3 → 2 → 1 → GO! を1秒ずつ表示
    │
    ▼
ゲームプレイ状態
    └── ゲームループ開始
```

---

## 2. ジャンプロジック（長押し可変ジャンプ）

```
タップ押下
    ├── isOnGround = true → ジャンプ開始
    │       velocity.y = -INITIAL_JUMP_FORCE
    │       isOnGround = false
    │       jumpHoldTime = 0
    │
    └── isOnGround = false かつ airJumpUsed = false
            （DoubleJumpPowerUp 有効時のみ）
            → 空中ジャンプ実行
              velocity.y = -INITIAL_JUMP_FORCE
              airJumpUsed = true

タップ押下中（毎フレーム）
    └── jumpHoldTime < MAX_JUMP_HOLD_TIME
            → velocity.y -= HOLD_JUMP_EXTRA_FORCE * dt
               jumpHoldTime += dt

タップ離す OR jumpHoldTime >= MAX_JUMP_HOLD_TIME
    └── 長押し終了（以後は重力のみ）

毎フレーム（空中時）
    └── velocity.y += GRAVITY * dt
        position.y += velocity.y * dt

地面到達時
    └── position.y = GROUND_Y
        velocity.y = 0
        isOnGround = true
        airJumpUsed = false  ← 地面に着くとリセット
```

---

## 3. スコア計算（走行距離ベース）

```
毎フレーム（ゲームプレイ中のみ）
    distanceTraveled += gameSpeed * dt
    currentScore = floor(distanceTraveled * SCORE_MULTIPLIER)

ゲームオーバー時
    isNewHighScore = currentScore > storedHighScore
    if isNewHighScore → PersistenceService.saveHighScore(currentScore)
```

---

## 4. 難易度進行（ステップ式）

```
難易度テーブル（例）:
  Level 1:  0m〜200m    → gameSpeed = INITIAL_SPEED
  Level 2:  200m〜500m  → gameSpeed = INITIAL_SPEED × 1.3
  Level 3:  500m〜1000m → gameSpeed = INITIAL_SPEED × 1.7
  Level 4:  1000m〜     → gameSpeed = min(INITIAL_SPEED × 2.2, MAX_SPEED)
  ...

毎フレーム
    if distanceTraveled >= currentLevel.distanceThreshold
        currentLevel = nextLevel
        gameSpeed = min(currentLevel.gameSpeed, MAX_SPEED)
        obstacleInterval = currentLevel.obstacleInterval
        ※ レベルアップ時に短い演出（画面フラッシュなど）を表示
```

---

## 5. 障害物スポーン

```
スポーンタイマー
    timer += dt
    if timer >= obstacleInterval
        timer = 0
        type = selectObstacleType(currentLevel)
        → Level 1-2: StaticObstacle のみ
           Level 3+:  StaticObstacle 70% / MovingObstacle 30%（レベルが上がるほど移動障害物増加）
        position.x = SCREEN_WIDTH + margin
        position.y = ランダム or パターンに基づく高さ

毎フレーム（全障害物）
    obstacle.position.x -= gameSpeed * dt
    if obstacle.position.x < -obstacle.size.x
        → 障害物を削除
```

---

## 6. パワーアップ挙動

```
スポーン
    powerUpTimer += dt
    if powerUpTimer >= powerUpInterval（難易度に応じた間隔）
        powerUpTimer = 0
        スポーン位置 = ジャンプで届く高さ範囲内のランダム位置

取得時
    collectType = 取得したパワーアップの type

    if collectType already in activePowerUps
        → 同種上書き: activePowerUps[collectType] = powerUp.duration（タイマーリセット）
    else
        → 別種追加: activePowerUps[collectType] = powerUp.duration（同時有効）

    powerUp.apply(player)
    PowerUpItem をワールドから削除
    AudioManager.playSFX(powerUpCollect)

毎フレーム（有効中パワーアップ）
    for each (type, remainingTime) in activePowerUps
        remainingTime -= dt
        if remainingTime <= 0
            powerUp.remove(player)
            activePowerUps.remove(type)
```

---

## 7. 衝突判定

```
毎フレーム
    for each obstacle in activeObstacles
        if player.hitbox.overlaps(obstacle.hitbox)
            → GameService.endGame(currentScore) を呼ぶ
               AudioManager.playSFX(collision)
               ゲームループ停止

    for each powerUpItem in activePowerUpItems
        if player.hitbox.overlaps(powerUpItem.hitbox)
            → PowerUpManager.activatePowerUp(powerUpItem.type, player)
```
