import React, { useEffect } from 'react';
import { Text, TouchableWithoutFeedback, View } from 'react-native';

import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

import {
  Canvas,
  DashPathEffect,
  Group,
  Line,
  Path,
  Skia,
  Text as SKText,
  useValue,
  vec,
} from '@shopify/react-native-skia';

import {
  calculatorPercent,
  getDataByKey,
  getDataWatch,
  HEIGHT_CHART,
  HEIGHT_COLUM,
  LISTER_DRAW_CHART,
  SPACE_WIDTH_CHART,
  updateDataByKey,
  WIDTH_CHART,
  WIDTH_COLUM,
} from '../constant';
import { emitChannel, subscribeChannel } from '../listener';
import { styles } from '../styles';
import { DataWatch, ItemListProps } from '../type';

export const ItemList = ({
  keyItem,
  font,
  onNavigateToItem,
}: ItemListProps) => {
  // state
  const progress = useSharedValue(0);
  const bgColorEnd = useSharedValue('#FEC260');
  const bgColor = useDerivedValue(
    () =>
      interpolateColor(
        progress.value,
        [0, 1],
        ['transparent', bgColorEnd.value],
      ),
    [],
  );
  const textColor = useValue('#FEC260');
  const openPrice = useValue('');
  const price1 = useValue('');
  const fluctuate = useValue('');
  const path = Skia.Path.Make();
  path.moveTo(0, HEIGHT_CHART / 2);
  path.lineTo(SPACE_WIDTH_CHART, HEIGHT_CHART / 2);
  const pathValue = useValue(path);

  // effect
  useEffect(() => {
    const unsubscribe = subscribeChannel((data: DataWatch) => {
      openPrice.current = `${data.openPrice}`;
      price1.current = `${data.price1}`;

      fluctuate.current = calculatorPercent(data.price1, data.openPrice);

      if (data.price1 > data.openPrice) {
        textColor.current = 'green';
        bgColorEnd.value = '#0080001c';
      }
      if (data.price1 === data.openPrice) {
        textColor.current = '#FEC260';
        bgColorEnd.value = 'transparent';
      }
      if (data.price1 < data.openPrice) {
        textColor.current = 'red';
        bgColorEnd.value = '#ff00000f';
      }
      progress.value = 1;
      price1.current = `${data.price1}`;
      updateDataByKey(keyItem, data);
    }, keyItem);
    return () => {
      emitChannel(keyItem, getDataWatch()?.[keyItem]);
      unsubscribe();
    };
  }, [keyItem]);

  useEffect(() => {
    const unsubscribe = subscribeChannel((timeDraw: number) => {
      const data = getDataByKey(keyItem);

      const { openPrice, price1: currentPrice } = data;
      const prefix = openPrice >= currentPrice ? -1 : 1;

      const rangePrice = Math.abs(currentPrice - openPrice);

      const yAxis =
        prefix > 0
          ? HEIGHT_CHART - rangePrice - 4
          : HEIGHT_CHART + rangePrice + 4;

      path.lineTo(SPACE_WIDTH_CHART * timeDraw, yAxis / 2);
      pathValue.current = path;
    }, LISTER_DRAW_CHART + keyItem);
    return () => {
      unsubscribe();
    };
  }, [keyItem, path]);

  const fillStyle = useAnimatedStyle(
    () => ({
      backgroundColor: bgColor.value,
    }),
    [],
  );

  // render
  return (
    <TouchableWithoutFeedback onPress={onNavigateToItem?.(keyItem)}>
      <Animated.View style={[styles.itemListContainer, fillStyle]}>
        <View style={[styles.cell]}>
          <Text style={styles.name}>{keyItem}</Text>
        </View>
        <Canvas
          style={{
            width: WIDTH_CHART,
            height: HEIGHT_CHART,
          }}>
          <Group>
            <Line
              p1={vec(0, HEIGHT_CHART / 2)}
              p2={vec(WIDTH_CHART, HEIGHT_CHART / 2)}
              color="gray"
              style="stroke"
              strokeWidth={1}>
              <DashPathEffect intervals={[5, 5]} />
            </Line>
            <Path
              path={pathValue}
              color={'red'}
              style="stroke"
              strokeJoin="round"
              strokeWidth={2}
            />
          </Group>
        </Canvas>
        <Canvas style={[styles.cell, { width: WIDTH_COLUM / 1.2 }]}>
          <Group>
            <SKText
              color={textColor}
              text={price1}
              x={0}
              y={HEIGHT_COLUM / 2.5}
              font={font}
            />
            <SKText
              color={textColor}
              text={fluctuate}
              x={0}
              y={HEIGHT_COLUM / 2 + 15}
              font={font}
            />
          </Group>
        </Canvas>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};
