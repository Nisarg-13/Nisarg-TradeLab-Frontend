export const TRADE_DATA_REFRESH_EVENT = "tradelab-trade-data-refresh";

const STORAGE_KEY = "tradelab-trade-data-refresh-at";

export function dispatchTradeDataRefresh() {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(STORAGE_KEY, String(Date.now()));
  window.dispatchEvent(new CustomEvent(TRADE_DATA_REFRESH_EVENT));
}

export function getTradeDataRefreshAt() {
  if (typeof window === "undefined") {
    return 0;
  }

  return Number(sessionStorage.getItem(STORAGE_KEY) ?? 0);
}
