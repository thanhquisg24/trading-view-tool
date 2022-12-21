export interface IConfigCoin {
  indicatorName: string;
  symbol: string;
  timeFrame: number;
  config: {
    [key: string]: {};
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
