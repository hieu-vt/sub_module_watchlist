import React, { useEffect, useRef } from 'react';

import axios from 'axios';

import { WatchList } from './index';

import { useSocketContext } from './app/common/socketIo';

export const WatchListDemo = () => {
  // state
  const { socketOff, socketListen } = useSocketContext();
  const ref = useRef<WatchList>();
  // const keyDataRef = useRef<Array<string>>([]);

  // effect
  useEffect(() => {
    axios.get('http://10.0.60.46:3001/snapshot').then(({ data: d }) => {
      // keyDataRef.current = Object.keys(d);
      ref.current?.onSetKeyData(Object.keys(d));
      setTimeout(() => {
        ref.current?.onSetDataWatchList(d);
      }, 1000);
    });
  }, []);

  useEffect(() => {
    socketListen('NEW_LIST', d => {
      ref.current?.onSetDataWatchList(d);
      // if (!isEqual(keyDataRef.current, Object.keys(d))) {
      //   const newKey = [...Object.keys(getDataWatch()), ...];
      //   ref.current?.onSetKeyData(newKey);
      //   keyDataRef.current = Object.keys(d);
      //   console.log('Change', Object.keys(d).length);
      // }
    });
  }, [socketListen]);

  // render
  return <WatchList onSocketOff={socketOff} ref={ref} />;
};
