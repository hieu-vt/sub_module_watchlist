import React, { useEffect } from 'react';

import BootSplash from 'react-native-bootsplash';

import { useSocketContext } from './app/common/socketIo';
import { WatchListDemo } from './watch-list-demo';

export const TestWatchList = () => {
  // state
  const { socketInit, socketDisconnect } = useSocketContext();

  // effect
  useEffect(() => {
    socketInit();
    const id = setTimeout(() => {
      BootSplash.hide({ fade: true });
    }, 1000);
    return () => {
      clearTimeout(id);
      socketDisconnect();
    };
  }, []);

  // render
  return (
    <>
      <WatchListDemo />
    </>
  );
};
