import { ISingleAlertSettings } from "../interfaces";

export interface IBaseCoin {
  symbol: string;
  shortSymbol?: string;
}
export interface ICoinLong extends IBaseCoin {
  [x: string]: any;
  timeFrame: number;
  // candlema_type?: CANDLE_ma_typeS;
  strategyLong: {
    useMa?: boolean;
    useBol?: boolean;
    useUptrend?: boolean;
    useWt?: boolean;
    useRsiCross?: boolean;
    minMa100Percents?: number;
    minMa50Percents?: number;
    BolMinPercents?: number;
    PinbarPercents?: number;
    rsiOverBuy?: number;
    rsiOverSell?: number;
    rsiUnderSMA?: boolean;
    rsiSMAignore?: number;
  };
  SO: {
    TP: number;
    maxSO: number;
    SO_PercentDrawdown: number;
    SO_VolScale: number;
    SO_StepScale: number;
  };
  MA: {
    ma_slow: number;
    ma_fast: number;
    ma_signal: number;
    ma_type: number;
  };
  waveTrend: {
    overSellLv1: number;
    overSellLv2: number;
  };
  rsiConfig: {
    rsiLength: number;
    smaLength: number;
  };
}
export interface ICoinShort extends IBaseCoin {
  [x: string]: any;
  timeFrame: number;
  // candlema_type?: CANDLE_ma_typeS;
  strategyShort: {
    useBol?: boolean;
    useDownTrend?: boolean;
    useWt?: boolean;
    useRsiCross?: boolean;
    minMa100Percents?: number;
    minMa50Percents?: number;
    BolMinPercents?: number;
    PinbarPercents?: number;
    rsiOverBuy?: number;
    rsiOverSell?: number;
    rsiUnderSMA?: boolean;
    rsiSMAignore?: number;
  };
  extendRsi?: {
    rsiOverBuy_1?: number;
    rsiOverBuy_2?: number;
    rsiOverBuy_3?: number;
    rsiOverBuy_4?: number;
  };
  SO: {
    TP: number;
    maxSO: number;
    SO_PercentDrawdown: number;
    SO_VolScale: number;
    SO_StepScale: number;
  };
  MA: {
    ma_slow: number;
    ma_fast: number;
    ma_signal: number;
    ma_type: number;
  };
  waveTrend: {
    overBuyLv1: number;
    overBuyLv2: number;
  };
  rsiConfig: {
    rsiLength: number;
    smaLength: number;
  };
}
export interface IBaseConfigYML {
  tradingview: {
    chartUrl: string;
    interval: number;
    username: string;
    password: string;
  };
  alert: ISingleAlertSettings;
}
export interface ICoinAlertInfo extends IBaseCoin {
  indicatorName: string;
  timeFrame: number;
  direction: "LONG" | "SHORT" | "";
  condition: {
    primaryLeft: string;
    secondary: string;
  };
  actions?: {
    webhook: {
      enabled: boolean;
      url: string;
    };
  };
}
export interface IConfigCoinDetail extends IBaseCoin {
  indicatorName: string;
  timeFrame: number;
  config: {
    [key: string]: any;
  };
}
// export const;
type LongElementTypes =
  | "useMa"
  | "useBol"
  | "useUptrend"
  | "useWt"
  | "useRsiCross"
  | "useMa100Filter"
  | "useMa50Filter"
  | "useBolFilter"
  | "useRSI_SMA_entry"
  | "rsiUnderSMA"
  | "minMa100Percents"
  | "minMa50Percents"
  | "BolMinPercents"
  | "PinbarPercents"
  | "rsiOverSell"
  | "rsiOverBuy"
  | "rsiSMAignore"
  | "overSellLv1"
  | "overSellLv2"
  | "ma_slow"
  | "ma_fast"
  | "ma_signal"
  | "ma_type"
  | "rsiLength"
  | "smaLength";

export interface IConfigLongItemSelector {
  class: string;
  index: number;
  type: "checkbox" | "text";
}
export interface ILongStudyTemplate {
  indicatorName: string;
  configSelectors: {
    [key in LongElementTypes]: IConfigLongItemSelector;
  };
}
export const LongStudyTemplate: ILongStudyTemplate = {
  indicatorName: "long.10.BB.WT.ver.3",
  configSelectors: {
    useBol: {
      class: "input-bUw_gKIQ",
      index: 0,
      type: "checkbox",
    },
    useUptrend: {
      class: "input-bUw_gKIQ",
      index: 1,
      type: "checkbox",
    },
    useWt: {
      class: "input-bUw_gKIQ",
      index: 2,
      type: "checkbox",
    },
    useRsiCross: {
      class: "input-bUw_gKIQ",
      index: 3,
      type: "checkbox",
    },
    useMa: {
      class: "input-bUw_gKIQ",
      index: 4,
      type: "checkbox",
    },
    minMa100Percents: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 7,
      type: "text",
    },
    useMa100Filter: {
      class: "input-bUw_gKIQ",
      index: 8,
      type: "checkbox",
    },
    minMa50Percents: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 9,
      type: "text",
    },
    useMa50Filter: {
      class: "input-bUw_gKIQ",
      index: 10,
      type: "checkbox",
    },
    BolMinPercents: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 11,
      type: "text",
    },
    useBolFilter: {
      class: "input-bUw_gKIQ",
      index: 12,
      type: "checkbox",
    },

    PinbarPercents: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 13,
      type: "text",
    },
    rsiOverSell: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 14,
      type: "text",
    },
    rsiOverBuy: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 15,
      type: "text",
    },
    rsiSMAignore: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 16,
      type: "text",
    },
    useRSI_SMA_entry: {
      class: "input-bUw_gKIQ",
      index: 17,
      type: "checkbox",
    },
    rsiUnderSMA: {
      class: "input-bUw_gKIQ",
      index: 18,
      type: "checkbox",
    },
    ma_type: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 19,
      type: "text",
    },
    ma_slow: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 20,
      type: "text",
    },
    ma_fast: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 21,
      type: "text",
    },
    ma_signal: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 22,
      type: "text",
    },

    overSellLv1: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 27,
      type: "text",
    },
    overSellLv2: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 28,
      type: "text",
    },
    rsiLength: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 31,
      type: "text",
    },
    smaLength: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 32,
      type: "text",
    },
  },
};

type ShortElementTypes =
  | "useBol"
  | "useDownTrend"
  | "useWt"
  | "useRsiCross"
  | "useMa100Filter"
  | "useMa50Filter"
  | "useBolFilter"
  | "useRSI_SMA_entry"
  | "rsiUnderSMA"
  | "minMa100Percents"
  | "minMa50Percents"
  | "BolMinPercents"
  | "PinbarPercents"
  | "rsiOverSell"
  | "rsiOverBuy"
  | "rsiSMAignore"
  | "rsiOverBuy_1"
  | "useRsiOverBuy_1"
  | "rsiOverBuy_2"
  | "useRsiOverBuy_2"
  | "rsiOverBuy_3"
  | "useRsiOverBuy_3"
  | "rsiOverBuy_4"
  | "useRsiOverBuy_4"
  | "overBuyLv1"
  | "overBuyLv2"
  | "ma_slow"
  | "ma_fast"
  | "ma_signal"
  | "ma_type"
  | "rsiLength"
  | "smaLength";

export interface IConfigShortItemSelector {
  class: string;
  index: number;
  type: "checkbox" | "text";
}
export interface IShortStudyTemplate {
  indicatorName: string;
  configSelectors: {
    [key in ShortElementTypes]: IConfigShortItemSelector;
  };
}
export const ShortStudyTemplate: IShortStudyTemplate = {
  indicatorName: "short.11.BB.WT.ver.3",
  configSelectors: {
    useBol: {
      class: "input-bUw_gKIQ",
      index: 0,
      type: "checkbox",
    },
    useDownTrend: {
      class: "input-bUw_gKIQ",
      index: 1,
      type: "checkbox",
    },
    useWt: {
      class: "input-bUw_gKIQ",
      index: 2,
      type: "checkbox",
    },
    useRsiCross: {
      class: "input-bUw_gKIQ",
      index: 3,
      type: "checkbox",
    },

    minMa100Percents: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 5,
      type: "text",
    },
    useMa100Filter: {
      class: "input-bUw_gKIQ",
      index: 6,
      type: "checkbox",
    },
    minMa50Percents: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 7,
      type: "text",
    },
    useMa50Filter: {
      class: "input-bUw_gKIQ",
      index: 8,
      type: "checkbox",
    },
    BolMinPercents: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 9,
      type: "text",
    },
    useBolFilter: {
      class: "input-bUw_gKIQ",
      index: 10,
      type: "checkbox",
    },

    PinbarPercents: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 11,
      type: "text",
    },
    rsiOverSell: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 12,
      type: "text",
    },
    rsiOverBuy: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 13,
      type: "text",
    },
    rsiSMAignore: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 14,
      type: "text",
    },
    useRSI_SMA_entry: {
      class: "input-bUw_gKIQ",
      index: 15,
      type: "checkbox",
    },
    rsiUnderSMA: {
      class: "input-bUw_gKIQ",
      index: 16,
      type: "checkbox",
    },

    rsiOverBuy_1: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 17,
      type: "text",
    },
    useRsiOverBuy_1: {
      class: "input-bUw_gKIQ",
      index: 20,
      type: "checkbox",
    },
    rsiOverBuy_2: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 18,
      type: "text",
    },
    useRsiOverBuy_2: {
      class: "input-bUw_gKIQ",
      index: 21,
      type: "checkbox",
    },
    rsiOverBuy_3: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 19,
      type: "text",
    },
    useRsiOverBuy_3: {
      class: "input-bUw_gKIQ",
      index: 22,
      type: "checkbox",
    },
    rsiOverBuy_4: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 23,
      type: "text",
    },
    useRsiOverBuy_4: {
      class: "input-bUw_gKIQ",
      index: 24,
      type: "checkbox",
    },

    ma_type: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 25,
      type: "text",
    },

    ma_slow: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 26,
      type: "text",
    },
    ma_fast: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 27,
      type: "text",
    },
    ma_signal: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 28,
      type: "text",
    },
    overBuyLv1: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 31,
      type: "text",
    },
    overBuyLv2: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 32,
      type: "text",
    },

    rsiLength: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 37,
      type: "text",
    },
    smaLength: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 38,
      type: "text",
    },
  },
};

export const coinlongtop: ICoinLong[] = [
  {
    timeFrame: 33,
    symbol: "BINANCE:AAVEUSDTPERP",
    shortSymbol: "AAVE",
    strategyLong: {
      useUptrend: true,
      useBol: true,
      useRsiCross: true,
      useWt: true,
      useMa: true,
      minMa100Percents: 1,
      minMa50Percents: 2,
      BolMinPercents: 3,
      PinbarPercents: 4,
      rsiOverSell: 5,
      rsiOverBuy: 6,
      rsiSMAignore: 30,
      rsiUnderSMA: true,
    },
    waveTrend: {
      overSellLv1: -7,
      overSellLv2: 8,
    },
    SO: {
      TP: 0.88,
      maxSO: 3,
      SO_PercentDrawdown: 6,
      SO_VolScale: 2,
      SO_StepScale: 2.3,
    },
    MA: {
      ma_type: 3,
      ma_slow: 188,
      ma_fast: 10,
      ma_signal: 11,
    },
    rsiConfig: {
      rsiLength: 12,
      smaLength: 13,
    },
    //232u ,232 trades,87% win,1.5 factor ,drawdown 206u
  },
];
export const coinshorttop: ICoinShort[] = [
  {
    symbol: "BINANCE:XMRUSDTPERP",
    timeFrame: 45,
    strategyShort: {
      useBol: true,
      useDownTrend: true,
      useWt: true,
      useRsiCross: true,
      minMa100Percents: 1,
      minMa50Percents: 2,
      BolMinPercents: 3,
      PinbarPercents: 4,
      rsiOverBuy: 5,
      rsiOverSell: 6,
      rsiSMAignore: 7,
      rsiUnderSMA: true,
    },
    extendRsi: {
      rsiOverBuy_1: 8,
      rsiOverBuy_2: 9,
      rsiOverBuy_3: 10,
      rsiOverBuy_4: 11,
    },
    SO: {
      TP: 0.88,
      maxSO: 3,
      SO_PercentDrawdown: 6,
      SO_VolScale: 2,
      SO_StepScale: 2.3,
    },
    MA: {
      ma_type: 1,
      ma_slow: 12,
      ma_fast: 13,
      ma_signal: 14,
    },
    waveTrend: {
      overBuyLv1: 15,
      overBuyLv2: 16,
    },
    rsiConfig: {
      rsiLength: 17,
      smaLength: 18,
    },
  },
];
