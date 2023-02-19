import { Dimensions } from 'react-native';

import { emitChannel } from './listener';
import { DataWatch } from './type';

export const WIDTH_COLUM = Dimensions.get('window').width / 3;
export const HEIGHT_COLUM = 40;
export const WIDTH_CHART = WIDTH_COLUM;
export const HEIGHT_CHART = HEIGHT_COLUM;
export const SPACE_WIDTH_CHART = WIDTH_CHART / 60;
export const LISTER_DRAW_CHART = 'LISTER_DRAW_CHART';

export const DATA_CHANGE_ACTION_TYPE = 'DATA_CHANGE_ACTION_TYPE';

let dataWatchList: Record<string, DataWatch> = {};
let timeOutRunning: any = null;

export const setDataWatch = (d: Record<string, DataWatch>) => {
  dataWatchList = d;
};

export const getDataWatch = () => {
  return dataWatchList;
};

export const getDataByKey = (key1: string) => {
  return dataWatchList?.[key1];
};

export const updateDataByKey = (key: string, data: DataWatch) => {
  dataWatchList[key] = data;
};

export const calculatorPercent = (currentPrice: number, openPrice: number) => {
  const priceUpDown = (currentPrice - openPrice).toFixed(2);
  const percent = (((currentPrice - openPrice) * 100) / openPrice).toFixed(2);

  return `${priceUpDown} / ${percent}%`;
};

export const timeOutDrawChart = (timeDraw: number, timeout = 5 * 60) => {
  timeOutRunning = setTimeout(() => {
    for (const key in dataWatchList) {
      emitChannel(LISTER_DRAW_CHART + key, timeDraw);
    }
    timeOutDrawChart(timeDraw + 1, timeout);
  }, timeout * 1000);
};

export const clearTimeOutDrawChart = () => {
  timeOutRunning && clearTimeout(timeOutRunning);
};
