import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Trend helper
const detectTrend = (arr: number[]) => {
  if (!arr || arr.length < 2) return "neutral";
  return arr[arr.length - 1] > arr[0] ? "up" : "down";
};

// Fallback chart generator (Day 1 → Day N)
const buildFallbackChart = (value: number, days = 7) =>
  Array.from({ length: days }, (_, i) => ({
    date: `Day ${i + 1}`,
    price: value,
  }));

export async function fetchAllData(symbol: string) {
  try {
    const [
      basic,
      signals,
      arima,
      prophet,
      sma,
      linear,
      lstm,
      sentiment,
    ] = await Promise.all([
      api.post("/indicators/basic", { symbol }),
      api.post("/indicators/signals", { symbol }),
      api.post("/predict/arima", { symbol }),
      api.post("/predict/prophet", { symbol }),
      api.post("/predict/sma", { symbol }),
      api.post("/predict/linear", { symbol }),
      api.post("/predict/lstm", { symbol }),
      api.post("/sentiment/analyze", { symbol }),
    ]);


    const candles = (basic.data.candlestick || []).map((c: any, i: number) => ({
      date: c.Date ?? c.date ?? `Day ${i + 1}`,
      open: c.open ?? 0,
      high: c.high ?? 0,
      low: c.low ?? 0,
      close: c.close ?? 0,
      volume: basic.data.volume?.[i]?.volume ?? 0,
    }));

    const last = candles[candles.length - 1] ?? {
      close: 0,
      volume: 0,
    };
    const ind = basic.data.indicators;

    const indicators = {
      candlestick: candles,
      volume: basic.data.volume?.map((v: any) => v.volume) ?? [],

      sma20: candles.map(() => ind?.SMA20 ?? 0),
      sma50: candles.map(() => ind?.SMA50 ?? 0),
      ema20: candles.map(() => ind?.EMA20 ?? 0),
      ema50: candles.map(() => ind?.EMA50 ?? 0),

      rsi: candles.map(() => ind?.RSI ?? 0),
      macd: candles.map(() => ind?.MACD ?? 0),

      bollinger_upper: candles.map(() => ind?.Upper_BB ?? 0),
      bollinger_lower: candles.map(() => ind?.Lower_BB ?? 0),

      current_price: last.close,
      current_volume: last.volume,
    };

    // ----------------------------------------------------
    // ARIMA FIX – backend gives array of numbers
    // ----------------------------------------------------
    const arimaArr: number[] = arima.data.forecast ?? [];

    const arimaPrediction = {
      predicted_price: arimaArr[arimaArr.length - 1] ?? 0,
      trend: detectTrend(arimaArr),
      chart_data:
        arimaArr.length > 0
          ? arimaArr.map((p, i) => ({
              date: `Day ${i + 1}`,
              price: p,
            }))
          : buildFallbackChart(0),
    };

    // ----------------------------------------------------
    // PROPHET FIX – backend gives list of dicts
    // ----------------------------------------------------
    const prophetArr = prophet.data.forecast ?? [];

    const prophetPrices = prophetArr.map((x: any) => x.yhat ?? x.y ?? 0);

    const prophetPrediction = {
      predicted_price: prophetPrices[prophetPrices.length - 1] ?? 0,
      trend: detectTrend(prophetPrices),
      chart_data:
        prophetArr.length > 0
          ? prophetArr.map((p: any, i: number) => ({
              date: p.ds ?? p.date ?? `Day ${i + 1}`,
              price: p.yhat ?? p.y ?? 0,
            }))
          : buildFallbackChart(0),
    };

    // ----------------------------------------------------
    // SMA FIX – backend returns a single number
    // ----------------------------------------------------
    const smaVal = sma.data.prediction ?? 0;

    const smaPrediction = {
      predicted_price: smaVal,
      trend: "neutral",
      chart_data: buildFallbackChart(smaVal),
    };

    // ----------------------------------------------------
    // LINEAR FIX – backend returns a single number
    // ----------------------------------------------------
    const linearVal = linear.data.prediction ?? 0;

    const linearPrediction = {
      predicted_price: linearVal,
      trend: "up",
      chart_data: buildFallbackChart(linearVal),
    };

    // ----------------------------------------------------
    // LSTM FIX – backend returns a single number
    // ----------------------------------------------------
    const lstmVal = lstm.data.prediction ?? 0;

    const lstmPrediction = {
      predicted_price: lstmVal,
      trend: "up",
      chart_data: buildFallbackChart(lstmVal),
    };

    // ---------------------------------------------------
    // SIGNAL FIX
    // ---------------------------------------------------
    const finalSignal = {
      signal: signals.data.final_signal ?? "HOLD",
      confidence: signals.data.confidence ?? 50,
      reasons: signals.data.reasons ?? [],
    };

    // ---------------------------------------------------
    // SENTIMENT FIX
    // ---------------------------------------------------
    const sentimentFixed = {
      sentiment: sentiment.data.sentiment ?? "NEUTRAL",
      confidence: sentiment.data.confidence ?? 50,
      signal: sentiment.data.signal ?? "HOLD",
    };

    return {
      indicators,
      signals: finalSignal,
      predictions: {
        arima: arimaPrediction,
        prophet: prophetPrediction,
        sma: smaPrediction,
        linear: linearPrediction,
        lstm: lstmPrediction,
      },
      sentiment: sentimentFixed,
    };
  } catch (err) {
    console.error("FIXED API MAPPING ERROR:", err);
    throw err;
  }
}
