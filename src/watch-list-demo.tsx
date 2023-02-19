import React, { useEffect, useRef } from 'react';

import axios from 'axios';

import { WatchList } from './index';

import { useSocketContext } from './app/common/socketIo';
import { clearTimeOutDrawChart, timeOutDrawChart } from './constant';

export const WatchListDemo = () => {
  // state
  const { socketOff, socketListen } = useSocketContext();
  const ref = useRef<WatchList>();
  // func
  const handleNavigateItem = (keyItem: string) => () => {
    console.log('keyItem', keyItem);
  };

  // effect
  useEffect(() => {
    axios.get('http://192.168.0.102:3001/snapshot').then(({ data: d }) => {
      ref.current?.onSetKeyData(Object.keys(d));
      setTimeout(() => {
        ref.current?.onSetDataWatchList(d);
        ref.current?.onEmitWithEvenKey(d);
      }, 1000);
    });
  }, []);

  useEffect(() => {
    socketListen('NEW_LIST', d => {
      ref.current?.onEmitWithEvenKey(d);
    });
  }, [socketListen]);

  useEffect(() => {
    timeOutDrawChart(1, 10);

    return () => {
      clearTimeOutDrawChart();
    };
  }, []);

  // render
  return (
    <WatchList
      onSocketOff={socketOff}
      onNavigateToItem={handleNavigateItem}
      ref={ref}
    />
  );
};
