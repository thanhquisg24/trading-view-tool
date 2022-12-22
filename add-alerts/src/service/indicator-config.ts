export interface ICoinLong {
  timeFrame: number;
  symbol: string;
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

export interface IConfigCoinDetail {
  indicatorName: string;
  symbol: string;
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

interface IConfigItemSelector {
  class: string;
  index: number;
  type: "checkbox" | "text";
}
interface IStudyTemplate {
  indicatorName: string;
  configSelectors: {
    [key in LongElementTypes]: IConfigItemSelector;
  };
}
export const LongStudyTemplate: IStudyTemplate = {
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
    useMa100Filter: {
      class: "input-bUw_gKIQ",
      index: 6,
      type: "checkbox",
    },
    useMa50Filter: {
      class: "input-bUw_gKIQ",
      index: 7,
      type: "checkbox",
    },
    useBolFilter: {
      class: "input-bUw_gKIQ",
      index: 8,
      type: "checkbox",
    },
    useRSI_SMA_entry: {
      class: "input-bUw_gKIQ",
      index: 9,
      type: "checkbox",
    },
    rsiUnderSMA: {
      class: "input-bUw_gKIQ",
      index: 10,
      type: "checkbox",
    },
    minMa100Percents: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 1,
      type: "text",
    },
    minMa50Percents: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 2,
      type: "text",
    },
    BolMinPercents: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 3,
      type: "text",
    },
    PinbarPercents: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 4,
      type: "text",
    },
    rsiOverSell: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 5,
      type: "text",
    },
    rsiOverBuy: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 6,
      type: "text",
    },
    rsiSMAignore: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 7,
      type: "text",
    },
    ma_type: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 8,
      type: "text",
    },
    ma_slow: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 9,
      type: "text",
    },
    ma_fast: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 10,
      type: "text",
    },
    ma_signal: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 11,
      type: "text",
    },
    overSellLv1: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 16,
      type: "text",
    },
    overSellLv2: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 17,
      type: "text",
    },
    rsiLength: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 20,
      type: "text",
    },
    smaLength: {
      class: "input-input-oiYdY6I4 with-end-slot-oiYdY6I4",
      index: 21,
      type: "text",
    },
  },
};

export const coinlongtop: ICoinLong[] = [
  {
    timeFrame: 33,
    symbol: "BINANCE:AAVEUSDTPERP",
    strategyLong: {
      // useUptrend: true,
      useBol: true,
      useRsiCross: true,
      useWt: true,
      minMa100Percents: 1,
      minMa50Percents: 0.3,
      BolMinPercents: 3,
      PinbarPercents: 0.0001,
      rsiOverSell: 22,
      rsiOverBuy: 49,
      // rsiSMAignore: 30,
    },
    waveTrend: {
      overSellLv1: -58,
      overSellLv2: 30,
    },
    SO: {
      TP: 0.88,
      maxSO: 3,
      SO_PercentDrawdown: 6,
      SO_VolScale: 2,
      SO_StepScale: 2.3,
    },
    MA: {
      ma_slow: 200,
      ma_fast: 100,
      ma_signal: 50,
      ma_type: 2,
    },
    rsiConfig: {
      rsiLength: 10,
      smaLength: 10,
    },
    //232u ,232 trades,87% win,1.5 factor ,drawdown 206u
  },
];
