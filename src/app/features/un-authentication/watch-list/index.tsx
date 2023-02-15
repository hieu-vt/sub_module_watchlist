import React, { useEffect, useRef, useState } from 'react';

import isEqual from 'react-fast-compare';

import { dispatch, useSocketContext } from '@common';
import { PostDelay, Text } from '@components';
import { useUnMount } from '@hooks';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { useFont } from '@shopify/react-native-skia';

import { Header } from './components/header';
import { ItemList } from './components/item-list';
import {
  DATA_CHANGE_ACTION_TYPE,
  HEIGHT_COLUM,
  setDataWatch,
} from './constant';
export const WatchList = () => {
  // state
  const font = useFont(require('../../../assets/fonts/Roboto-Bold.ttf'), 14);
  const { socketListen, socketOff } = useSocketContext();
  const [keyData, setKeyData] = useState<Array<string>>([]);
  const keyDataRef = useRef<Array<string>>([]);

  // func
  const renderRow = ({ item }: ListRenderItemInfo<string>) => {
    return <ItemList keyItem={item} font={font} />;
  };

  // effect
  useEffect(() => {
    socketListen('NEW_LIST', d => {
      setDataWatch(d);
      dispatch({
        type: DATA_CHANGE_ACTION_TYPE,
      });
      if (!isEqual(keyDataRef.current, Object.keys(d))) {
        setKeyData(Object.keys(d));
        keyDataRef.current = Object.keys(d);
        console.log('Change', Object.keys(d).length);
      }
    });
  });

  useUnMount(() => socketOff('NEW_LIST'));

  if (!font) {
    return null;
  }
  // render
  return (
    <PostDelay delay={300}>
      <>
        <Header />
        <FlashList
          data={keyData}
          estimatedItemSize={HEIGHT_COLUM}
          renderItem={renderRow}
        />
      </>
    </PostDelay>
  );
};
