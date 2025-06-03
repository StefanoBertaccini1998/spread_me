const API_KEY = import.meta.env.VITE_MARKETSTACK_API_KEY;
const BASE_URL = "http://api.marketstack.com/v1";

export const fetchStockData = async (symbol) => {
  const res = await fetch(
    `${BASE_URL}/eod?access_key=${API_KEY}&symbols=${symbol}`
  );
  if (!res.ok) throw new Error("Errore nel recupero dati azione");
  const json = await res.json();
  return json.data;
};

export const fetchTopAssets = async () => {
  const symbols = [
    "VOO",
    "SPY",
    "IVV",
    "VTI",
    "QQQ",
    "EFA",
    "VEA",
    "VWO",
    "IEMG",
    "BND",
    "TLT",
    "ARKK",
    "LQD",
    "XLF",
    "XLE",
  ];

  const res = await fetch(
    `${BASE_URL}/eod/latest?access_key=${API_KEY}&symbols=${symbols.join(",")}`
  );
  const data = await res.json();

  return data.data.map((item) => ({
    symbol: item.symbol,
    name: item.symbol, // puoi sostituire con una mappa per nome completo
    changePercent: ((item.close - item.open) / item.open) * 100,
  }));
};

export const fetchHistoricalData = async (symbol, startDate, endDate) => {
  const API_KEY = import.meta.env.VITE_MARKETSTACK_API_KEY;
  const BASE_URL = "https://api.marketstack.com/v1";

  const res = await fetch(
    `${BASE_URL}/eod?access_key=${API_KEY}&symbols=${symbol}&date_from=${startDate}&date_to=${endDate}&limit=1000`
  );

  const data = await res.json();
  return data.data.map((d) => ({
    date: d.date.split("T")[0],
    close: d.close,
  }));
};
