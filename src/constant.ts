import { Dimensions } from 'react-native';

import { DataWatch } from './type';

export const WIDTH_COLUM = Dimensions.get('window').width / 8;
export const HEIGHT_COLUM = 40;
export const WIDTH_CHART = WIDTH_COLUM * 2;
export const HEIGHT_CHART = HEIGHT_COLUM * 1.5;
export const SPACER_BOTTOM = 10;

export const DATA_CHANGE_ACTION_TYPE = 'DATA_CHANGE_ACTION_TYPE';

let dataWatchList: Record<string, DataWatch> = {};

export const setDataWatch = (d: Record<string, DataWatch>) => {
  dataWatchList = d;
};

export const getDataWatch = () => {
  return dataWatchList;
};

export const getDataByKey = (key1: string, key2: keyof DataWatch) => {
  if (Object.keys(dataWatchList).length <= 0) {
    return '0';
  }
  return dataWatchList[key1][key2].toFixed(2);
};

export const calculatorPercent = (
  key1: string,
  key2: keyof DataWatch,
  key3: keyof DataWatch,
) => {
  const currentPrice = dataWatchList[key1][key2];
  const openPrice = dataWatchList[key1][key3];

  const priceUpDown = currentPrice - openPrice;
  const percent = ((priceUpDown / openPrice) * 100).toFixed(2);

  return `${priceUpDown} / ${percent}%`;
};
