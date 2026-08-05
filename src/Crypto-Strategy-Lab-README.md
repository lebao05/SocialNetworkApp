# Crypto Strategy Lab – Đồ án cuối kỳ
# Nền tảng phân tích, kết hợp và đánh giá chiến lược giao dịch Crypto

---

## 1. Bối cảnh bài toán

Thị trường cryptocurrency như Bitcoin, Ethereum hoạt động liên tục 24/7. Giá được biểu diễn bằng biểu đồ nến – **Candlestick Chart**.

### Candlestick (nến) gồm các thành phần:
| Thành phần | Ý nghĩa |
|---|---|
| **Open** | Giá BTC ở đầu kỳ (ví dụ: 09:00) |
| **High** | Giá cao nhất trong kỳ |
| **Low** | Giá thấp nhất trong kỳ |
| **Close** | Giá cuối kỳ |
| **Volume** | Khối lượng giao dịch |

**Ví dụ:** cặp BTCUSDT khung 5 phút tại 09:00:
- Open = 118,000 | High = 118,200 | Low = 117,900 | Close = 118,150 | Volume = 125 BTC

### Các phương pháp phân tích kỹ thuật phổ biến:
- Moving Average (MA)
- RSI
- Bollinger Bands
- Support/Resistance
- Smart Money Concepts (SMC)
- Wyckoff

### Hạn chế của strategy đơn lẻ:
| Strategy | Tốt khi | Kém khi |
|---|---|---|
| MA | Thị trường có xu hướng | Thị trường đi ngang |
| RSI | Phát hiện quá mua/quá bán | Tạo nhiều tín hiệu sai khi trend mạnh |
| Support/Resistance | Tìm vùng giá quan trọng | Phụ thuộc vào thuật toán xác định |

### Câu hỏi chính của đồ án:
> Có thể xây dựng một hệ thống cho phép bổ sung nhiều strategy khác nhau, tự động kết hợp chúng thành các strategy phức hợp, đánh giá hiệu quả và liên tục tìm ra những tổ hợp strategy tốt nhất hay không?

---

## 2. Mục tiêu tổng thể

Xây dựng nền tảng **Crypto Strategy Lab** có khả năng:

- [x] Nhận dữ liệu thị trường cryptocurrency từ **Binance**
- [x] Hiển thị biểu đồ giá **realtime**
- [x] Theo dõi đồng thời tối đa **4 khung thời gian**
- [x] Cho phép bổ sung các strategy phân tích kỹ thuật
- [x] Cho phép kết hợp nhiều strategy thành chiến lược tổng hợp
- [x] Backtest các chiến lược trên dữ liệu lịch sử
- [x] Xếp hạng các strategy dựa trên hiệu quả giao dịch
- [x] Tự động tìm kiếm các combination strategy tốt hơn
- [x] Visualize tín hiệu và giao dịch lên biểu đồ
- [x] Thu thập tin tức liên quan đến coin/pair
- [x] Phân tích sentiment của tin tức bằng mô hình Machine Learning
- [x] Thiết kế hệ thống **mở rộng được** trong tương lai mà không sửa đổi toàn bộ

> **Trọng tâm của đồ án là Kiến trúc phần mềm, không phải tìm ra strategy đầu tư tốt nhất.**

---

## 3. Ví dụ tổng thể

Người dùng chọn:
- **Pair:** BTCUSDT
- **Timeframes:** 5m | 15m | 1h | 4h

### Dashboard 4 biểu đồ:

```
+------------------+------------------+
|  BTCUSDT - 5m    |  BTCUSDT - 15m   |
|  Candlestick     |  Candlestick     |
+------------------+------------------+
|  BTCUSDT - 1h    |  BTCUSDT - 4h    |
|  Candlestick     |  Candlestick     |
+------------------+------------------+
```

Người dùng có thể đổi timeframe: `5m → 1m`, `15m → 30m`, `1h → 2h`, `4h → 1d` mà không reload toàn bộ hệ thống.

### Bật strategy:
- MA + RSI + Bollinger + Support/Resistance

### Hệ thống tạo các tổ hợp:
| # | Strategy | Profit | Win Rate | Max Drawdown |
|---|---|---|---|---|
| 1 | MA + RSI + SR | +18.2% | 61% | -6.1% |
| 2 | MA + Bollinger | +15.7% | 58% | -8.4% |
| 3 | RSI + SR | +13.1% | 64% | -7.2% |

→ Đây chính là **Leaderboard**.

---

## 4. Module 1 – Realtime Market Data

Hệ thống cần lấy dữ liệu giá crypto từ **Binance**. Có hai loại:

### Historical Data
Dữ liệu trong quá khứ (01/07 → 30/07), các khung: 1 phút, 5 phút, 15 phút, 1 giờ, 4 giờ, 1 ngày.
→ Phù hợp cho: backtesting, tính indicator, huấn luyện ML, phân tích lịch sử.

### Realtime Data
Dữ liệu giá đang thay đổi tại thời điểm hiện tại, cập nhật liên tục qua WebSocket.

### Kiến trúc yêu cầu:

```
Binance
   ↓
Market Data Adapter
   ↓
Event / Stream
   ↓
Backend
   ↓
WebSocket
   ↓
Frontend
```

**Lưu ý:** Không được để frontend phụ thuộc trực tiếp vào cấu trúc dữ liệu Binance.

```
❌ Không nên:  Frontend → Binance API
✅ Nên:        Frontend → Market Data Service → Binance Adapter → Binance
```

→ Nhờ đó có thể bổ sung **OKXAdapter**, **BybitAdapter**, **CoinbaseAdapter** mà frontend không phải thay đổi.

---

## 5. Module 2 – Multi-Timeframe Chart

Hệ thống hỗ trợ tối đa **4 chart** trên một màn hình, mỗi chart có thể thay đổi timeframe riêng.

**Có thể visualize:**
- [x] Candlestick
- [x] Volume
- [x] MA
- [x] Bollinger Bands
- [x] Vùng Support / Resistance
- [x] Buy/Sell Signal
- [x] Điểm Entry / Stop Loss / Take Profit

---

## 6. Module 3 – Strategy Engine

Một strategy nhận dữ liệu thị trường và tạo ra tín hiệu chuẩn hóa:

```
interface Strategy {
    analyze(context) → BUY | SELL | HOLD
}
```

`context` có thể chứa: `price`, `volume`, `candles`, `timeframe`, `indicators`, `market state`, `sentiment`, ...

---

## 7. Strategy ví dụ 1 – Moving Average (MA)

**MA** = giá trung bình của một khoảng thời gian.

- `MA20` = trung bình giá của 20 candles gần nhất
- `MA50` = trung bình giá của 50 candles gần nhất

**Strategy:**
- MA20 cắt lên MA50 → `BUY`
- MA20 cắt xuống MA50 → `SELL`

```
MAStrategy {
    fastPeriod = 20
    slowPeriod = 50
}
```

> **Lưu ý kiến trúc:** MAStrategy chỉ nên chịu trách nhiệm về logic MA. Không nên chứa code gọi Binance, lưu database, vẽ chart, gửi notification.

---

## 8. Strategy ví dụ 2 – RSI

**RSI** có giá trị từ 0 → 100.

**Rule đơn giản:**
- `RSI < 30` → Oversold → `BUY`
- `RSI > 70` → Overbought → `SELL`

```
RSIStrategy {
    period = 14
    buyThreshold = 30
    sellThreshold = 70
}
```

→ Có thể thử: `RSI(14, 30, 70)`, `RSI(14, 25, 75)`, `RSI(21, 30, 70)`

---

## 9. Strategy ví dụ 3 – Bollinger Bands

Bollinger Bands tạo ba đường: **Upper Band**, **Middle Band**, **Lower Band**.

**Strategy:**
- Price < Lower Band → `BUY`
- Price > Upper Band → `SELL`

→ Cùng một indicator có thể sinh ra nhiều strategy khác nhau.

---

## 10. Strategy ví dụ 4 – Support/Resistance

- **Support** = vùng giá mà giá thường ngừng giảm
- **Resistance** = vùng giá mà giá thường gặp khó khăn khi tăng

**Strategy:**
- Price gần Support → `BUY`
- Price gần Resistance → `SELL`
- Price breakout Resistance → `BUY`

---

## 11. Strategy nâng cao – SMC, Wyckoff

Đây là phần **không bắt buộc** — mục tiêu là chứng minh kiến trúc có khả năng hỗ trợ chúng.

```
Strategy
├── MA Strategy
├── RSI Strategy
├── Bollinger Strategy
├── SMC Strategy
├── Wyckoff Strategy
└── Sentiment Strategy

Thêm một strategy mới không được yêu cầu sửa toàn bộ Strategy Engine.
```

→ Đây chính là yêu cầu về **Extensibility – khả năng mở rộng hệ thống**.

---

## 12. Module 4 – Strategy Plugin

Yêu cầu quan trọng: hệ thống phải cho phép bổ sung strategy mới dễ dàng.

```
strategies/
├── MA/
├── RSI/
├── Bollinger/
└── SupportResistance/  ← thêm mới
```

**Lý tưởng nhất:**
```csharp
StrategyRegistry.register(SupportResistance)
// thay vì phải sửa:
// if strategy == MA ...
// else if strategy == RSI ...
// else if strategy == Bollinger ...
// else if strategy == SR ...
```

**Các pattern cần nghiên cứu:**
- Strategy Pattern
- Plugin Architecture
- Factory
- Registry
- Dependency Injection

---

## 13. Module 5 – Composite Strategy

Từ 4 strategy: `MA`, `RSI`, `Bollinger`, `SupportResistance` → có thể tạo nhiều tổ hợp:
`MA + RSI`, `MA + Bollinger`, `RSI + SR`, `MA + RSI + SR`, ...

### Vấn đề: Khi các strategy đưa ra tín hiệu khác nhau thì kết hợp thế nào?

**Ví dụ:**
```
MA → BUY
RSI → BUY
SR → HOLD
```

**→ Majority Vote:** BUY = 2, HOLD = 1 → `BUY`

---

## 14. Weighted Combination

Không nhất thiết strategy nào cũng có trọng số giống nhau.

**Ví dụ:**
| Strategy | Trọng số |
|---|---|
| MA | 0.2 |
| RSI | 0.3 |
| SR | 0.5 |

**Encode tín hiệu:**
| Tín hiệu | Giá trị |
|---|---|
| BUY | +1 |
| HOLD | 0 |
| SELL | -1 |

**Tính Score:**
```
MA → BUY → 1×0.2 = 0.2
RSI → SELL → (-1)×0.3 = -0.3
SR → BUY → 1×0.5 = 0.5
Score = 0.2 + (-0.3) + 0.5 = 0.4
```

**Quy định ngưỡng:**
- `score > 0.3` → `BUY`
- `score < -0.3` → `SELL`
- còn lại → `HOLD`

---

## 15. Module 6 – Strategy Search Engine

Nếu có nhiều strategy, số tổ hợp có thể tăng rất nhanh.

**Ví dụ:** 4 strategy (MA, RSI, BB, SR) → tổ hợp 2+ = 11 combos
**Với tham số khác nhau:**
```
MA: 10/20, 20/50, 50/200
RSI: 14/30/70, 14/20/80, 21/30/70
```
→ Không gian tìm kiếm sẽ lớn hơn rất nhiều.

---

## 16. Cách tìm kiếm 1 – Random Search

Cách đơn giản nhất: Random một tổ hợp.

```
Loop 1: MA + RSI       → backtest → evaluate → rank
Loop 2: BB + SR        → backtest → evaluate → rank
Loop 3: MA + RSI + SR  → backtest → evaluate → rank
Loop 4: MA + BB + SR   → backtest → evaluate → rank
...
```

---

## 17. Cách tìm kiếm 2 – Domain-guided Search

Dựa trên đặc điểm domain để phân nhóm:

| Nhóm | Strategy |
|---|---|
| Trend | MA, MACD |
| Momentum | RSI, Stochastic |
| Volatility | Bollinger, ATR |
| Structure | Support/Resistance, SMC, Wyckoff |
| Information | News Sentiment |

**Rule:** Một composite strategy phải lấy:
```
1 Trend Strategy + 1 Momentum Strategy + 1 Structure Strategy
```

---

## 18. Cách tìm kiếm nâng cao (không bắt buộc)

- [ ] Genetic Algorithm
- [ ] Bayesian Optimization
- [ ] Evolutionary Search
- [ ] Reinforcement Learning
- [ ] LLM-generated Strategy
- [ ] Agent-based Search
- [ ] AlphaEvolve-style optimization
- [ ] Loop Engineering

---

## 19. Module 7 – Backtesting Engine

**Backtesting** = giả lập: "Nếu sử dụng strategy này trong quá khứ thì kết quả sẽ như thế nào?"

**Ví dụ:**
```
01/01 BTC = $80,000
...
01/03 BTC = $95,000

05/01 BUY  @82,000
12/01 SELL @86,000  → Profit
22/01 BUY  @88,000
31/01 SELL @87,000  → Loss
```

---

## 20. Không chỉ đánh giá Profit

| Strategy | Profit | Max Drawdown | Đánh giá |
|---|---|---|---|
| A | +30% | -45% | Rủi ro cao |
| B | +25% | -8% | Ổn định hơn |

**Hệ thống nên cung cấp các metrics:**
- Total Return
- Profit/Loss
- Win Rate
- Number of Trades
- Maximum Drawdown
- Profit Factor
- Sharpe Ratio

> **Lưu ý:** Strategy Evaluation phải tách biệt khỏi Strategy Implementation.

---

## 21. Module 8 – Leaderboard

Sau mỗi lần backtest, kết quả được đưa vào Leaderboard.

| Rank | Strategy | Return | Win Rate | MDD | Trades |
|---|---|---|---|---|---|
| 1 | MA+RSI+SR | 24.2% | 62% | -7.1% | 81 |
| 2 | MA+BB | 21.7% | 55% | -8.4% | 105 |
| 3 | RSI+SR | 18.4% | 64% | -6.7% | 52 |
| 4 | MA | 9.1% | 48% | -14.2% | 140 |

**Có thể sort by:** Return, Win Rate, Max Drawdown, Sharpe, Overall Score

---

## 22. Top-K Strategies

```
Top K = 10

Leaderboard luôn hiển thị Top 10 strategies hiện tại

Candidate mới: MA20 + RSI14 + SR → Score = 82.1
> Strategy đứng thứ 10: Score = 78.4

→ Strategy mới được đưa vào Leaderboard
```

---

## 23. Module 9 – Continuous Strategy Loop

Hệ thống chạy một vòng loop ngầm:

```
┌──────────────┐
│  Generate    │
│  Strategy    │
└──────┬───────┘
       ↓
┌──────────────┐
│  Backtest    │
└──────┬───────┘
       ↓
┌──────────────┐
│  Evaluate    │
└──────┬───────┘
       ↓
┌──────────────┐
│    Rank      │
└──────┬───────┘
       ↓
┌──────────────┐
│ Leaderboard  │
└──────┬───────┘
       │
       └────────→ Generate tiếp
```

**Stop Condition (bắt buộc thiết kế):**
- 100 candidates
- 1 giờ
- Đến khi không cải thiện sau 50 iterations

> **Không được để `while(true)` chạy vô hạn.**

---

## 24. Tại sao phần Loop quan trọng với Kiến trúc phần mềm?

### ❌ Implementation kém:
```python
for 100000 strategies:
    calculate indicator
    backtest
    save DB
    update UI
# Tất cả trong một function
```

### ✅ Implementation tốt:
```
Strategy Generator
       ↓
Strategy Queue
       ↓
Backtest Worker
       ↓
Evaluator
       ↓
Ranking Service
       ↓
Leaderboard
```

→ Có thể: chạy nhiều worker, retry khi lỗi, pause/resume loop, theo dõi tiến trình, scale trong tương lai.

---

## 25. Visualization Strategy

Không chỉ hiển thị `Profit = +20%` mà phải cho phép người dùng hiểu strategy đã làm gì.

**Click vào strategy `MA20 + RSI14 + SupportResistance`:**
→ Chart hiển thị: MA20, RSI signals, Support zones, Buy points, Sell points

---

## 26. Trade Detail

| # | Entry Time | Entry | Exit Time | Exit | Result |
|---|---|---|---|---|---|
| 1 | 01/07 08:00 | 108K | 01/07 15:00 | 110K | +1.85% |
| 2 | 02/07 10:00 | 111K | 02/07 18:00 | 110K | -0.90% |
| 3 | 04/07 07:00 | 109K | 05/07 12:00 | 114K | +4.58% |

Click Trade #3 → Chart highlight: `ENTRY ↑` ... `EXIT ↓`

---

## 27. Module 10 – News Crawler

### Thu thập tin tức từ nhiều nguồn:

```
Trading System
     ↑
┌────┼────────┐
│    │        │
RSS  News API Crawler
```

### Dữ liệu chuẩn hóa:
```json
{
  "id": "...",
  "title": "Bitcoin rises after ...",
  "content": "...",
  "source": "XXX",
  "publishedAt": "2026-07-28 08:15",
  "crawledAt": "...",
  "relatedCoins": ["BTC"],
  "url": "..."
}
```

---

## 28. News không được gắn cứng với một crawler

```
❌ Không nên:  Trading System → Website A Crawler

✅ Nên có:     News Provider
                   ↑
         ┌─────────┼─────────┐
         │         │         │
        RSS    News API   Crawler
```

---

## 29. Module 11 – Sentiment Analysis

**Machine Learning Service** phân loại tin tức:

| Tin tức | Sentiment | Score |
|---|---|---|
| "Bitcoin surges after institutional adoption..." | **POSITIVE** | 0.85 |
| "Major exchange suffers security breach..." | **NEGATIVE** | -0.72 |
| "Bitcoin network upgrade scheduled..." | **NEUTRAL** | 0.05 |

---

## 30. Sentiment có thể trở thành một Strategy

```
Average sentiment trong 1 giờ > 0.7  → BUY
Average sentiment < -0.7              → SELL
```

→ Sau đó hệ thống có thể tìm:
- `MA + RSI + News Sentiment`
- `Support Resistance + News Sentiment`

→ Kiến trúc không còn giới hạn ở **Technical Analysis**.

---

## 31. Kiến trúc tổng thể gợi ý

```
┌─────────────────┐
│    Frontend     │
│   Dashboard     │
└───────┬─────────┘
        │
    API / WebSocket
        │
┌───────▼─────────┐
│     Backend     │
└───────┬─────────┘
        │
┌───────┼───────┐
│       │       │
▼       ▼       ▼
Market    Strategy  News
Service   Service   Service
│          │         │
▼          ▼         ▼
Binance   Strategy  News
Adapter   Registry  Providers
           │
           ▼
    Combination Engine
           │
           ▼
       Backtester
           │
           ▼
       Evaluator
           │
           ▼
     Leaderboard
```

---

## 32. Các vấn đề Kiến trúc phần mềm cần giải quyết

### 32.1 Modifiability
> Có thể thêm MACD Strategy mà không phải sửa 20 module.

### 32.2 Scalability
> Ban đầu: 10 strategies → Sau này: 100,000 candidates. Hệ thống thay đổi kiến trúc như thế nào?

### 32.3 Realtime
> Khi Binance có dữ liệu mới: Market Data → Indicator → Strategy → UI. Làm sao cập nhật với độ trễ thấp?

### 32.4 Reliability
> Nếu Binance mất kết nối: Connection lost. Hệ thống xử lý ra sao? Reconnect? Retry? Có mất candles không?

### 32.5 Performance
> Có 1,000 strategy cần backtest. Có nên chạy tuần tự hay sử dụng Job Queue + Workers?

### 32.6 Maintainability
> Strategy Search không được phụ thuộc chặt vào Backtesting implementation. Có thể thay Random Search bằng Genetic Search mà Backtester vẫn giữ nguyên.

### 32.7 Observability
> Hệ thống nên biết: Loop đang chạy hay dừng? Đã thử bao nhiêu strategy? Backtest mất bao lâu? Có bao nhiêu job lỗi?

---

## 33. Luồng hoàn chỉnh của hệ thống

1. **Market Data:** Binance → BTC candles
2. **Strategy Generator:** Sinh candidate `MA20 + RSI14 + SupportResistance`
3. **Backtester:** Chạy trên `BTCUSDT, 01/01 → 01/07, 5m`
4. **Trade Simulation:** Sinh 82 trades
5. **Evaluator:** Return=18.2%, Win Rate=61%, MDD=-6.1%
6. **Ranking:** Score=81.4
7. **Candidate đứng Rank #2**
8. **Frontend nhận event:** `LEADERBOARD_UPDATED`
9. **Leaderboard tự cập nhật** — không cần refresh trang

---

## 34. Các Event có thể xuất hiện

Event-driven architecture giúp giảm coupling giữa các module:

| Event | Mô tả |
|---|---|
| `MarketPriceUpdated` | Giá thị trường cập nhật |
| `CandleClosed` | Nến đóng cửa |
| `StrategyGenerated` | Strategy mới được sinh |
| `BacktestStarted` | Backtest bắt đầu |
| `BacktestCompleted` | Backtest hoàn thành |
| `StrategyEvaluated` | Strategy được đánh giá |
| `LeaderboardUpdated` | Leaderboard thay đổi |
| `NewsCollected` | Tin tức được thu thập |
| `SentimentAnalyzed` | Sentiment được phân tích |

**Ví dụ:** `Backtest Worker` không cần gọi trực tiếp `LeaderboardService.update()`, mà chỉ publish `StrategyEvaluatedEvent` → `Ranking Service` nhận event đó.

---

## 35. Database

| Nhóm dữ liệu | Các bảng/collection |
|---|---|
| **Market Data** | Candles: Pair, Timeframe, Timestamp, Open, High, Low, Close, Volume |
| **Strategy** | StrategyDefinition, Parameters, Version, CreatedAt |
| **Experiment** | Combination, Dataset, Timeframe, Parameters, Result |
| **Trades** | Entry, Exit, Profit |
| **News** | Title, Content, Source, PublishedAt, RelatedCoin, Sentiment |
| **Leaderboard** | Lưu trực tiếp hoặc tính từ Experiment Results |

---

## 36. Strategy phải có Version

```
MA-RSI Strategy v1:  MA20, MA50, RSI14
MA-RSI Strategy v2:  MA10, MA30, RSI21  ← Không overwrite kết quả cũ

→ Experiment #122 luôn biết chính xác nó đã sử dụng strategy nào.
```

→ Đây là vấn đề **Reproducibility**.

---

## 37. MVP – Mức tối thiểu

### Market
- [x] Binance data
- [x] Candlestick chart
- [x] Realtime update
- [x] Tối đa 4 timeframe

### Strategy
- [x] Ít nhất 4 strategy đơn lẻ: MA, RSI, Bollinger, Support/Resistance

### Combination
- [x] Có khả năng tạo composite strategy

### Backtest
- [x] Có khả năng giả lập giao dịch trên historical data

### Evaluation
- [x] Return
- [x] Win Rate
- [x] Max Drawdown
- [x] Number of Trades

### Search
- [x] Ít nhất một phương pháp: Random Search

### Leaderboard
- [x] Top-K strategies

### Visualization
- [x] Chart có Buy/Sell, Entry/Exit

### News
- [x] Collect → Store → Analyze sentiment

---

## 38. Phần mở rộng

### Search
- [ ] Genetic Algorithm
- [ ] Evolutionary Search
- [ ] Bayesian Optimization
- [ ] LLM Strategy Generator

### Trading
- [ ] Long/Short
- [ ] Stop Loss / Take Profit
- [ ] Trailing Stop
- [ ] Position Sizing

### Market
- [ ] Multiple Coins
- [ ] Multiple Exchanges

### ML
- [ ] Sentiment
- [ ] Price Prediction
- [ ] Market Regime Detection

### Architecture
- [ ] Redis
- [ ] Kafka/RabbitMQ
- [ ] Worker Pool
- [ ] Microservices
- [ ] CQRS
- [ ] Event Sourcing
- [ ] Plugin Architecture

> **Lưu ý:** Không được cộng điểm chỉ vì sử dụng công nghệ phức tạp. Phải chứng minh công nghệ đó giải quyết vấn đề kiến trúc nào.

---

## 39. Hiểu đúng mục tiêu đồ án

### ❌ Không nên hiểu:
> Viết MA + RSI để kiếm tiền.

### ✅ Phải hiểu:
> Thiết kế một hệ thống mà hôm nay có MA + RSI, ngày mai có thể thêm SMC, Wyckoff, Sentiment hoặc một strategy hoàn toàn mới mà kiến trúc cũ vẫn hoạt động.

> Hôm nay dùng Random Search, ngày mai có thể thay bằng Genetic Algorithm mà Backtester, Evaluator, Leaderboard, Visualization không cần viết lại.

→ **Đây mới là vấn đề của Software Architecture.**

---

## 40. Câu hỏi kiến trúc trung tâm

Trong báo cáo, nhóm phải trả lời được:

1. **Strategy mới được thêm vào hệ thống như thế nào?** Ví dụ: MACDStrategy được thêm mà sửa những component nào?

2. **Search algorithm mới được thêm như thế nào?** Từ Random Search sang Genetic Search có ảnh hưởng Backtesting Engine không?

3. **Market Data Provider mới được thêm như thế nào?** Từ Binance sang Binance + OKX có phải sửa frontend không?

4. **Nếu số backtest tăng từ 100 lên 100,000 thì kiến trúc thay đổi thế nào?**

5. **Nếu News Service bị lỗi thì Chart có còn chạy không?**

6. **Nếu Sentiment Model thay đổi thì Strategy Engine có bị ảnh hưởng không?**

7. **Nếu Binance WebSocket disconnect thì hệ thống phục hồi như thế nào?**

8. **Làm sao kiểm tra một kết quả trên Leaderboard được tạo ra bởi version strategy nào?**

---

## 41. Scenario đánh giá khả năng mở rộng

> "Hệ thống hiện có MA, RSI, Bollinger và Support/Resistance. Hãy bổ sung MACD."

| Chất lượng thiết kế | Hành động cần sửa |
|---|---|
| **Tốt** | `class MACDStrategy implements Strategy` + `StrategyRegistry.register(MACDStrategy)` |
| **Kém** | Phải sửa: Controller, Backtester, UI, Database, Combination Engine, Evaluator |

→ Đây là minh chứng trực quan cho chất lượng kiến trúc.

---

## 42. Scenario đánh giá khả năng thay đổi

> "Hiện tại: RandomStrategyGenerator. Thêm: DomainGuidedStrategyGenerator."

```csharp
interface StrategyGenerator {
    generate()
}

class RandomGenerator implements StrategyGenerator {}
class DomainGuidedGenerator implements StrategyGenerator {}
class GeneticGenerator implements StrategyGenerator {}
```

Các component phía sau chỉ nhận `CandidateStrategy` và không cần biết candidate được sinh ra bằng cách nào.

---

## 43. Scenario đánh giá Scalability

```
1 Backtest Worker mất: 2 giây / candidate

10,000 candidates cần: 20,000 giây ≈ 5.5 giờ

→ Hệ thống nên cho phép mở rộng:
     Job Queue
    ┌────┼────┐
    ▼    ▼    ▼
Worker1 Worker2 Worker3
```

---

## 44. Các Anti-pattern nên tránh

### ❌ God Service
```
TradingService
vừa:
  get Binance data
  calculate RSI
  crawl news
  run ML
  backtest
  rank
  save database
  send WebSocket
```

### ❌ Hard-coded Strategy
```
if MA && RSI ...
else if MA && Bollinger ...
else if RSI && Bollinger ...
```

### ❌ Frontend chứa business logic
```
Không nên để React/Vue tính: trading strategy, backtest, profit, ranking
```

### ❌ Strategy truy cập trực tiếp Database
```
RSIStrategy → MySQL
Strategy nên nhận data cần thiết thông qua abstraction.
```

### ❌ Crawler phụ thuộc chặt vào ML
```
Không nên: Crawler → BERT model
Nên:        Crawler chỉ collect news
           Sentiment Service xử lý analyze news
```

---

## 45. Deliverables

### 1. Source Code
Repository hoàn chỉnh.

### 2. README
Hướng dẫn: Install, Run, Architecture, Demo.

### 3. Architecture Document
Mô tả tối thiểu:
- System Context
- Container/Module decomposition
- Component responsibilities
- Data Flow
- Realtime Flow
- Strategy Flow
- Search/Backtest Flow

### 4. Architectural Decisions (ADR)
Ví dụ:
- ADR-001: Tại sao dùng WebSocket?
- ADR-002: Tại sao dùng Plugin Architecture cho Strategy?
- ADR-003: Tại sao dùng Queue cho Backtesting?
- ADR-004: Tại sao tách Sentiment Service?

### 5. Demo
Demo tối thiểu:
- [x] Realtime chart
- [x] Multi timeframe
- [x] Thêm/chọn strategy
- [x] Generate combination
- [x] Backtest
- [x] Leaderboard
- [x] Trade visualization
- [x] News
- [x] Sentiment

---

## 46. Demo Scenario đề xuất

**Bước 1:** Mở BTCUSDT. 5m | 15m | 1h | 4h. 4 chart realtime.

**Bước 2:** Chọn MA, RSI, Bollinger, Support Resistance.

**Bước 3:** Bấm `START SEARCH`.

**Bước 4:** Màn hình hiển thị:
```
Candidates tested: 125
Current: MA20 + RSI14 + SR
Backtesting...
```

**Bước 5:** Leaderboard thay đổi:
```
#1 MA20 + RSI14 + SR
#2 MA50 + BB
#3 RSI + SR
```

**Bước 6:** Click Top #1 → Chart hiển thị: Buy, Sell, MA, Support, Resistance.

**Bước 7:** Hiển thị:
```
Trades = 81
Win Rate = 61%
Return = 18.2%
MDD = -6.1%
```

**Bước 8:** Chuyển sang News:
```
BTC News
Positive: 42%  Neutral: 38%  Negative: 20%
```

**Bước 9:** Thêm SentimentStrategy vào search space.

**Bước 10:** Chạy lại loop:
```
MA + RSI + Sentiment
MA + SR + Sentiment
...
```

---

## 47. Ý nghĩa cuối cùng của đồ án

### Đồ án không nhằm chứng minh rằng:
> MA + RSI + SMC có thể kiếm tiền thật.

### Mục tiêu là:
> Xây dựng một software architecture có khả năng thử nghiệm các ý tưởng như vậy một cách có hệ thống.

### Hệ thống phải chuyển bài toán:
```
"Tôi có một strategy mới."
        ↓
  Plugin Strategy
        ↓
    Combine
        ↓
    Backtest
        ↓
   Evaluate
        ↓
   Compare
        ↓
  Leaderboard
        ↓
  Visualize
        ↓
→ Lặp lại: Generate → Execute → Measure → Rank → Improve → Generate...
```

### Bản chất đồ án:
```
Realtime System
+ Plugin Architecture
+ Data Pipeline
+ Event-driven Architecture
+ Experiment Platform
+ Verification Loop
```

> **Điều quan trọng nhất cần chứng minh:**
>
> Kiến trúc được thiết kế như thế nào để các thành phần có thể **thay đổi**, **mở rộng** và **hoạt động độc lập** trong khi toàn bộ hệ thống vẫn duy trì được **tính đúng đắn**, **khả năng quan sát** và **khả năng phát triển lâu dài**.
