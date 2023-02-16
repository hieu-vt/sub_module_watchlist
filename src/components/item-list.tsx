import React, { useEffect } from 'react';
import { Text, View } from 'react-native';

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
  Skia,
  Text as SKText,
  useValue,
  vec,
} from '@shopify/react-native-skia';

import {
  calculatorPercent,
  getDataWatch,
  HEIGHT_CHART,
  HEIGHT_COLUM,
  WIDTH_CHART,
  WIDTH_COLUM,
} from '../constant';
import { emitChannel, subscribeChannel } from '../listener';
import { styles } from '../styles';
import { DataWatch, ItemListProps } from '../type';

export const ItemList = ({ keyItem, font }: ItemListProps) => {
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
  const p2Line = useValue(vec(WIDTH_CHART - 3, 3));
  const path = Skia.Path.Make();
  path.moveTo(0, HEIGHT_CHART / 2);
  path.lineTo(WIDTH_CHART, 0);
  const pathValue = useValue(path);
  const cXValue = useValue(WIDTH_CHART - 3);
  const cYValue = useValue(3);

  // effect
  useEffect(() => {
    const unsubscribe = subscribeChannel((data: DataWatch) => {
      const percent =
        Math.abs(Number(data.price1) - Number(data.openPrice)) /
          Number(data.openPrice) >
        1
          ? 1
          : Math.abs(Number(data.price1) - Number(data.openPrice)) /
            Number(data.openPrice);
      openPrice.current = `${data.openPrice}`;
      price1.current = `${data.price1}`;

      fluctuate.current = calculatorPercent(data.price1, data.openPrice);
      p2Line.current = vec(WIDTH_COLUM * percent, (HEIGHT_CHART - 3) * percent);

      cXValue.current = WIDTH_COLUM * percent;
      cYValue.current = (HEIGHT_CHART - 3) * percent;

      pathValue.current = path;

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
    }, keyItem);
    return () => {
      emitChannel(keyItem, getDataWatch()?.[keyItem]);
      unsubscribe();
    };
  }, [keyItem]);

  const fillStyle = useAnimatedStyle(
    () => ({
      backgroundColor: bgColor.value,
    }),
    [],
  );

  // render
  return (
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
  );
};
