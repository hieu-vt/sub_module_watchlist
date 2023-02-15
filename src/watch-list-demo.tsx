import React, { useEffect, useRef } from 'react';

import isEqual from 'react-fast-compare';

import { WatchList } from './index';

import { useSocketContext } from './app/common/socketIo';

export const WatchListDemo = () => {
  // state
  const { socketOff, socketListen } = useSocketContext();
  const ref = useRef<WatchList>();
  const keyDataRef = useRef<Array<string>>([]);

  // effect
  // effect
  useEffect(() => {
    socketListen('NEW_LIST', d => {
      ref.current?.onSetDataWatchList(d);

      if (!isEqual(keyDataRef.current, Object.keys(d))) {
        ref.current?.onSetKeyData(Object.keys(d));
        keyDataRef.current = Object.keys(d);
        console.log('Change', Object.keys(d).length);
      }
    });
  });

  // render
  return <WatchList onSocketOff={socketOff} ref={ref} />;
};
