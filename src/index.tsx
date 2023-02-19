/* eslint-disable @typescript-eslint/no-var-requires */
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View } from 'react-native';

import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { useFont } from '@shopify/react-native-skia';

import { Header } from './components/header';
import { ItemList } from './components/item-list';
import { PostDelay } from './components/post-delay';
import { HEIGHT_COLUM, setDataWatch } from './constant';
import { useUnMount } from './hooks';
import { emitChannel } from './listener';
import { DataWatch } from './type';

export const WatchList = forwardRef(
  (
    {
      onSocketOff,
      onNavigateToItem,
    }: {
      onSocketOff: (event?: string | undefined, listener?: any) => void;
      onNavigateToItem: ((key: string) => void) | any;
    },
    ref,
  ) => {
    // state
    const font = useFont(require('./assets/fonts/Roboto-Bold.ttf'), 14);
    const [keyData, setKeyData] = useState<Array<string>>([]);

    // func
    useImperativeHandle(
      ref,
      () => ({
        onSetKeyData: (data: Array<string>) => {
          setKeyData(data);
        },
        onSetDataWatchList: (d: Record<string, DataWatch>) => {
          setDataWatch(d);
        },
        onEmitWithEvenKey: (d: Record<string, DataWatch>) => {
          for (const key in d) {
            if (d?.[key]) {
              emitChannel(key, d[key]);
            }
          }
        },
      }),
      [],
    );

    // func
    const renderRow = ({ item }: ListRenderItemInfo<string>) => {
      return (
        <ItemList
          keyItem={item}
          font={font}
          onNavigateToItem={onNavigateToItem}
        />
      );
    };

    // effect
    useUnMount(() => onSocketOff('NEW_LIST'));

    if (!font) {
      return null;
    }
    // render
    return (
      <PostDelay delay={100}>
        <>
          <View style={{ paddingTop: 40 }} />
          <Header />
          <FlashList
            data={keyData}
            estimatedItemSize={HEIGHT_COLUM}
            renderItem={renderRow}
          />
        </>
      </PostDelay>
    );
  },
);

export interface WatchList {
  onSetKeyData(data: Array<string>): void;
  onSetDataWatchList(d: Record<string, DataWatch>): void;
  onEmitWithEvenKey(d: Record<string, DataWatch>): void;
}
