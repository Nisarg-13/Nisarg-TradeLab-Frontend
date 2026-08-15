import type { AssetClass } from "@/types/instrument";
import type { RiskInstrument } from "@/types/risk";

type CatalogSpec = {
  symbol: string;
  description: string;
  assetClass: AssetClass;
  digits: number;
  point: number;
  tickSize: number;
  tickValueProfit: number;
  tickValueLoss: number;
  contractSize: number;
  volumeMin: number;
  volumeMax: number;
  volumeStep: number;
  baseCurrency?: string;
  profitCurrency?: string;
};

type ForexTemplate = Pick<
  CatalogSpec,
  "digits" | "point" | "tickSize" | "tickValueProfit" | "tickValueLoss"
>;

const STANDARD_FOREX: ForexTemplate = {
  digits: 5,
  point: 0.00001,
  tickSize: 0.00001,
  tickValueProfit: 1,
  tickValueLoss: 1,
};

const JPY_FOREX: ForexTemplate = {
  digits: 3,
  point: 0.001,
  tickSize: 0.001,
  tickValueProfit: 0.67,
  tickValueLoss: 0.67,
};

function formatPairName(symbol: string) {
  return `${symbol.slice(0, 3)}/${symbol.slice(3, 6)}`;
}

function createForexPair(
  symbol: string,
  description: string,
  baseCurrency: string,
  profitCurrency: string,
  template: ForexTemplate = STANDARD_FOREX,
): CatalogSpec {
  return {
    symbol,
    description,
    assetClass: "FOREX",
    ...template,
    contractSize: 100000,
    volumeMin: 0.01,
    volumeMax: 100,
    volumeStep: 0.01,
    baseCurrency,
    profitCurrency,
  };
}

function forexMajor(
  symbol: string,
  baseCurrency: string,
  profitCurrency: string,
  label: string,
): CatalogSpec {
  const template =
    profitCurrency === "JPY" || baseCurrency === "JPY"
      ? JPY_FOREX
      : STANDARD_FOREX;

  return createForexPair(
    symbol,
    `${label} (${formatPairName(symbol)})`,
    baseCurrency,
    profitCurrency,
    template,
  );
}

function forexCross(
  symbol: string,
  baseCurrency: string,
  profitCurrency: string,
): CatalogSpec {
  const template =
    baseCurrency === "JPY" || profitCurrency === "JPY"
      ? JPY_FOREX
      : STANDARD_FOREX;

  return createForexPair(
    symbol,
    `${formatPairName(symbol)} cross`,
    baseCurrency,
    profitCurrency,
    template,
  );
}

const CATALOG_SPECS: CatalogSpec[] = [
  forexMajor("EURUSD", "EUR", "USD", "Euro vs US Dollar"),
  forexMajor("GBPUSD", "GBP", "USD", "British Pound vs US Dollar"),
  forexMajor("USDJPY", "USD", "JPY", "US Dollar vs Japanese Yen"),
  forexMajor("USDCHF", "USD", "CHF", "US Dollar vs Swiss Franc"),
  forexMajor("USDCAD", "USD", "CAD", "US Dollar vs Canadian Dollar"),
  forexMajor("AUDUSD", "AUD", "USD", "Australian Dollar vs US Dollar"),
  forexMajor("NZDUSD", "NZD", "USD", "New Zealand Dollar vs US Dollar"),
  forexCross("EURGBP", "EUR", "GBP"),
  forexCross("EURJPY", "EUR", "JPY"),
  forexCross("EURCHF", "EUR", "CHF"),
  forexCross("EURAUD", "EUR", "AUD"),
  forexCross("EURCAD", "EUR", "CAD"),
  forexCross("EURNZD", "EUR", "NZD"),
  forexCross("GBPJPY", "GBP", "JPY"),
  forexCross("GBPCHF", "GBP", "CHF"),
  forexCross("GBPAUD", "GBP", "AUD"),
  forexCross("GBPCAD", "GBP", "CAD"),
  forexCross("GBPNZD", "GBP", "NZD"),
  forexCross("AUDJPY", "AUD", "JPY"),
  forexCross("AUDCAD", "AUD", "CAD"),
  forexCross("AUDNZD", "AUD", "NZD"),
  forexCross("AUDCHF", "AUD", "CHF"),
  forexCross("NZDJPY", "NZD", "JPY"),
  forexCross("NZDCAD", "NZD", "CAD"),
  forexCross("NZDCHF", "NZD", "CHF"),
  forexCross("CADJPY", "CAD", "JPY"),
  forexCross("CADCHF", "CAD", "CHF"),
  forexCross("CHFJPY", "CHF", "JPY"),
  forexMajor("USDSEK", "USD", "SEK", "US Dollar vs Swedish Krona"),
  forexMajor("USDNOK", "USD", "NOK", "US Dollar vs Norwegian Krone"),
  forexMajor("USDDKK", "USD", "DKK", "US Dollar vs Danish Krone"),
  forexMajor("USDPLN", "USD", "PLN", "US Dollar vs Polish Zloty"),
  forexMajor("USDTRY", "USD", "TRY", "US Dollar vs Turkish Lira"),
  forexMajor("USDZAR", "USD", "ZAR", "US Dollar vs South African Rand"),
  forexMajor("USDMXN", "USD", "MXN", "US Dollar vs Mexican Peso"),
  forexMajor("USDSGD", "USD", "SGD", "US Dollar vs Singapore Dollar"),
  forexMajor("USDHKD", "USD", "HKD", "US Dollar vs Hong Kong Dollar"),
  forexMajor("USDCNH", "USD", "CNH", "US Dollar vs Chinese Yuan"),
  {
    symbol: "XAUUSD",
    description: "Gold vs US Dollar",
    assetClass: "COMMODITY",
    digits: 2,
    point: 0.01,
    tickSize: 0.01,
    tickValueProfit: 1,
    tickValueLoss: 1,
    contractSize: 100,
    volumeMin: 0.01,
    volumeMax: 50,
    volumeStep: 0.01,
    baseCurrency: "XAU",
    profitCurrency: "USD",
  },
  {
    symbol: "XAGUSD",
    description: "Silver vs US Dollar",
    assetClass: "COMMODITY",
    digits: 3,
    point: 0.001,
    tickSize: 0.001,
    tickValueProfit: 5,
    tickValueLoss: 5,
    contractSize: 5000,
    volumeMin: 0.01,
    volumeMax: 50,
    volumeStep: 0.01,
    baseCurrency: "XAG",
    profitCurrency: "USD",
  },
  {
    symbol: "USOIL",
    description: "US Crude Oil (WTI)",
    assetClass: "COMMODITY",
    digits: 2,
    point: 0.01,
    tickSize: 0.01,
    tickValueProfit: 1,
    tickValueLoss: 1,
    contractSize: 1000,
    volumeMin: 0.01,
    volumeMax: 100,
    volumeStep: 0.01,
    profitCurrency: "USD",
  },
  {
    symbol: "UKOIL",
    description: "UK Brent Crude Oil",
    assetClass: "COMMODITY",
    digits: 2,
    point: 0.01,
    tickSize: 0.01,
    tickValueProfit: 1,
    tickValueLoss: 1,
    contractSize: 1000,
    volumeMin: 0.01,
    volumeMax: 100,
    volumeStep: 0.01,
    profitCurrency: "USD",
  },
  {
    symbol: "BTCUSD",
    description: "Bitcoin vs US Dollar",
    assetClass: "CRYPTO",
    digits: 2,
    point: 0.01,
    tickSize: 0.01,
    tickValueProfit: 1,
    tickValueLoss: 1,
    contractSize: 1,
    volumeMin: 0.01,
    volumeMax: 20,
    volumeStep: 0.01,
    profitCurrency: "USD",
  },
  {
    symbol: "ETHUSD",
    description: "Ethereum vs US Dollar",
    assetClass: "CRYPTO",
    digits: 2,
    point: 0.01,
    tickSize: 0.01,
    tickValueProfit: 1,
    tickValueLoss: 1,
    contractSize: 1,
    volumeMin: 0.01,
    volumeMax: 100,
    volumeStep: 0.01,
    profitCurrency: "USD",
  },
  {
    symbol: "US100",
    description: "Nasdaq 100 Index",
    assetClass: "INDEX",
    digits: 2,
    point: 0.01,
    tickSize: 0.01,
    tickValueProfit: 1,
    tickValueLoss: 1,
    contractSize: 1,
    volumeMin: 0.01,
    volumeMax: 100,
    volumeStep: 0.01,
    profitCurrency: "USD",
  },
];

function toRiskInstrument(spec: CatalogSpec): RiskInstrument {
  return {
    symbol: spec.symbol,
    description: spec.description,
    assetClass: spec.assetClass,
    digits: spec.digits,
    point: String(spec.point),
    tickSize: String(spec.tickSize),
    tickValueProfit: String(spec.tickValueProfit),
    tickValueLoss: String(spec.tickValueLoss),
    contractSize: String(spec.contractSize),
    volumeMin: String(spec.volumeMin),
    volumeMax: String(spec.volumeMax),
    volumeStep: String(spec.volumeStep),
    baseCurrency: spec.baseCurrency ?? null,
    profitCurrency: spec.profitCurrency ?? null,
  };
}

export const RISK_INSTRUMENTS: RiskInstrument[] =
  CATALOG_SPECS.map(toRiskInstrument);

export function formatInstrumentDisplay(symbol: string): string {
  if (symbol.length === 6 && /^[A-Z]{6}$/.test(symbol)) {
    return `${symbol.slice(0, 3)}/${symbol.slice(3, 6)}`;
  }

  return symbol;
}

export function filterInstruments(query: string): RiskInstrument[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return RISK_INSTRUMENTS;
  }

  const compact = normalized.replace(/\//g, "");

  return RISK_INSTRUMENTS.filter((instrument) => {
    const display = formatInstrumentDisplay(instrument.symbol).toLowerCase();
    const symbol = instrument.symbol.toLowerCase();
    const description = instrument.description.toLowerCase();
    const assetClass = instrument.assetClass.toLowerCase();

    return (
      display.includes(normalized) ||
      symbol.includes(compact) ||
      description.includes(normalized) ||
      assetClass.includes(normalized)
    );
  });
}
