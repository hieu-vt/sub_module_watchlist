import React, { useEffect } from 'react';
import { Text, View } from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import {
  Canvas,
  Circle,
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
  DATA_CHANGE_ACTION_TYPE,
  getDataByKey,
  HEIGHT_CHART,
  HEIGHT_COLUM,
  SPACER_BOTTOM,
  WIDTH_CHART,
  WIDTH_COLUM,
} from '../constant';
import { subscribeChannel } from '../listener';
import { styles } from '../styles';
import { ItemListProps } from '../type';

export const ItemList = ({ keyItem, font }: ItemListProps) => {
  // state
  const progress = useSharedValue(0);
  const bgColorEnd = useSharedValue('#FEC260');

  const textColor = useValue('#FEC260');
  const openPrice = useValue(getDataByKey(keyItem, 'openPrice'));
  const price1 = useValue(getDataByKey(keyItem, 'price1'));
  const fluctuate = useValue(calculatorPercent(keyItem, 'price1', 'openPrice'));
  const kl3 = useValue(getDataByKey(keyItem, 'kl3'));
  const kl2 = useValue(getDataByKey(keyItem, 'kl2'));
  const kl1 = useValue(getDataByKey(keyItem, 'kl1'));
  const p2Line = useValue(vec(WIDTH_CHART - 3, SPACER_BOTTOM + 3));
  const path = Skia.Path.Make();
  path.moveTo(0, HEIGHT_CHART / 2 + SPACER_BOTTOM);
  path.lineTo(WIDTH_CHART, SPACER_BOTTOM);
  const pathValue = useValue(path);
  const cXValue = useValue(WIDTH_CHART - 3);
  const cYValue = useValue(SPACER_BOTTOM + 3);

  // effect
  useEffect(() => {
    const unsubscribe = subscribeChannel({
      type: DATA_CHANGE_ACTION_TYPE,
      cb: () => {
        const openPriceValue = getDataByKey(keyItem, 'openPrice');
        const currentPrice = getDataByKey(keyItem, 'price1');
        const percent =
          Math.abs(Number(currentPrice) - Number(openPriceValue)) /
            Number(openPriceValue) >
          1
            ? 1
            : Math.abs(Number(currentPrice) - Number(openPriceValue)) /
              Number(openPriceValue);
        openPrice.current = openPriceValue;
        price1.current = currentPrice;
        fluctuate.current = calculatorPercent(keyItem, 'price1', 'openPrice');
        p2Line.current = vec(
          WIDTH_COLUM * percent,
          (HEIGHT_CHART - (SPACER_BOTTOM + 3)) * percent,
        );

        cXValue.current = WIDTH_COLUM * percent;
        cYValue.current = (HEIGHT_CHART - (SPACER_BOTTOM + 3)) * percent;

        pathValue.current = path;

        if (price1.current > openPrice.current) {
          textColor.current = 'green';
          bgColorEnd.value = 'green';
        }
        if (price1.current === openPrice.current) {
          textColor.current = '#FEC260';
          bgColorEnd.value = '#FEC260';
        }
        if (price1.current < openPrice.current) {
          textColor.current = 'red';
          bgColorEnd.value = 'red';
        }
        progress.value = 1;
        //   progress.value = withTiming(0, { duration: 500 });
        // price2.current = getDataByKey(keyItem, 'price2');
        price1.current = getDataByKey(keyItem, 'price1');
        kl3.current = getDataByKey(keyItem, 'kl3');
        kl2.current = getDataByKey(keyItem, 'kl2');
        kl1.current = getDataByKey(keyItem, 'kl1');
      },
    });
    return () => {
      unsubscribe();
    };
  }, [keyItem]);

  const fillStyle = useAnimatedStyle(
    () => ({
      //   backgroundColor: bgColor.value,
    }),
    [],
  );

  // render
  return (
    <View style={styles.itemListContainer}>
      <View style={[styles.cell]}>
        <Text style={styles.name}>{keyItem}</Text>
      </View>
      <View style={[styles.cell]}>
        <Canvas
          style={{
            width: WIDTH_CHART,
            height: HEIGHT_CHART,
          }}>
          <Group>
            <Line
              p1={vec(0, HEIGHT_CHART / 2 + SPACER_BOTTOM)}
              p2={vec(WIDTH_CHART, HEIGHT_CHART / 2 + SPACER_BOTTOM)}
              color="gray"
              style="stroke"
              strokeWidth={1}>
              <DashPathEffect intervals={[5, 5]} />
            </Line>
            <Group>
              <Line
                p1={vec(0, HEIGHT_CHART / 2 + SPACER_BOTTOM)}
                p2={p2Line}
                color={textColor}
                style={'stroke'}
                strokeWidth={1.5}
              />
              <Circle r={3} cx={cXValue} cy={cYValue} color={textColor} />
            </Group>
          </Group>
        </Canvas>
      </View>
      <Animated.View style={[styles.cell, fillStyle]}>
        <Canvas
          style={[
            styles.cell,
            { flexDirection: 'row', width: WIDTH_COLUM * 1.8 },
          ]}>
          <Group>
            <SKText
              color={textColor}
              text={price1}
              x={WIDTH_COLUM / 4}
              y={HEIGHT_COLUM / 2 + 3}
              font={font}
            />

            <SKText
              color={textColor}
              text={fluctuate}
              x={WIDTH_COLUM / 10}
              y={HEIGHT_COLUM / 2 + 20}
              font={font}
            />
          </Group>
        </Canvas>
      </Animated.View>
    </View>
  );
};

// export const ItemList1 = ({ keyItem }: ItemListProps) => {
//   // state

//   const textColor = useSharedValue('yellow');
//   const progress = useSharedValue(0);
//   const bgColorEnd = useSharedValue('yellow');
//   const bgColor = useDerivedValue(
//     () =>
//       interpolateColor(
//         progress.value,
//         [0, 1],
//         ['transparent', bgColorEnd.value],
//       ),
//     [],
//   );

//   const openPrice = useSharedValue(getDataByKey(keyItem, 'openPrice'));
//   const price3 = useSharedValue(getDataByKey(keyItem, 'price3'));
//   const price2 = useSharedValue(getDataByKey(keyItem, 'price2'));
//   const price1 = useSharedValue(getDataByKey(keyItem, 'price1'));
//   const kl3 = useSharedValue(getDataByKey(keyItem, 'kl3'));
//   const kl2 = useSharedValue(getDataByKey(keyItem, 'kl2'));
//   const kl1 = useSharedValue(getDataByKey(keyItem, 'kl1'));

//   const animatedOpenPriceText = useDerivedValue(() => `${openPrice.value}`, []);
//   const animatedPrice3Text = useDerivedValue(() => `${price3.value}`, []);
//   const animatedPrice2Text = useDerivedValue(() => `${price2.value}`, []);
//   const animatedPrice1Text = useDerivedValue(() => `${price1.value}`, []);
//   const animatedKl3Text = useDerivedValue(() => `${kl3.value}`, []);
//   const animatedKl2Text = useDerivedValue(() => `${kl2.value}`, []);
//   const animatedKl1Text = useDerivedValue(() => `${kl1.value}`, []);

//   // effect
//   useEffect(() => {
//     const unsubscribe = subscribeActionAfter(DATA_CHANGE_ACTION_TYPE, () => {
//       openPrice.value = getDataByKey(keyItem, 'openPrice');
//       price3.value = getDataByKey(keyItem, 'price3');
//       if (price3.value > openPrice.value) {
//         textColor.value = 'green';
//         bgColorEnd.value = 'green';
//       }
//       if (price3.value === openPrice.value) {
//         textColor.value = 'yellow';
//         bgColorEnd.value = 'yellow';
//       }
//       if (price3.value < openPrice.value) {
//         textColor.value = 'red';
//         bgColorEnd.value = 'red';
//       }
//       //   progress.value = 1;
//       price2.value = getDataByKey(keyItem, 'price2');
//       price1.value = getDataByKey(keyItem, 'price1');
//       kl3.value = getDataByKey(keyItem, 'kl3');
//       kl2.value = getDataByKey(keyItem, 'kl2');
//       kl1.value = getDataByKey(keyItem, 'kl1');
//     });
//     return () => {
//       unsubscribe();
//     };
//   }, [keyItem]);

//   // text
//   const animatedOpenPriceProps = useAnimatedProps(() => {
//     return {
//       text: animatedOpenPriceText.value,
//     };
//   }, []);
//   const animatedPrice3Props = useAnimatedProps(() => {
//     return {
//       text: animatedPrice3Text.value,
//     };
//   }, []);

//   const animatedPrice2Props = useAnimatedProps(() => {
//     return {
//       text: animatedPrice2Text.value,
//     };
//   }, []);

//   const animatedPrice1Props = useAnimatedProps(() => {
//     return {
//       text: animatedPrice1Text.value,
//     };
//   }, []);

//   const animatedKl3Props = useAnimatedProps(() => {
//     return {
//       text: animatedKl3Text.value,
//     };
//   }, []);

//   const animatedKl2Props = useAnimatedProps(() => {
//     return {
//       text: animatedKl2Text.value,
//     };
//   }, []);

//   const animatedKl1Props = useAnimatedProps(() => {
//     return {
//       text: animatedKl1Text.value,
//     };
//   }, []);

//   //   restyle
//   const textStyle = useAnimatedStyle(
//     () => ({ color: textColor.value, fontWeight: 'bold' }),
//     [],
//   );
//   const bgStyle = useAnimatedStyle(
//     () => ({ backgroundColor: bgColor.value }),
//     [],
//   );

//   // render
//   return (
//     <View style={styles.itemListContainer}>
//       <View style={[styles.cell]}>
//         <Text style={styles.name}>{keyItem}</Text>
//       </View>
//       <Animated.View style={[styles.cell, bgStyle]}>
//         <AnimateableText
//           animatedProps={animatedOpenPriceProps}
//           style={textStyle}
//         />
//       </Animated.View>
//       <Animated.View style={[styles.cell, bgStyle]}>
//         <AnimateableText
//           animatedProps={animatedPrice3Props}
//           style={textStyle}
//         />
//       </Animated.View>
//       <Animated.View style={[styles.cell, bgStyle]}>
//         <AnimateableText
//           animatedProps={animatedPrice2Props}
//           style={textStyle}
//         />
//       </Animated.View>
//       <Animated.View style={[styles.cell, bgStyle]}>
//         <AnimateableText
//           animatedProps={animatedPrice1Props}
//           style={textStyle}
//         />
//       </Animated.View>
//       <Animated.View style={[styles.cell, bgStyle]}>
//         <AnimateableText animatedProps={animatedKl3Props} style={textStyle} />
//       </Animated.View>
//       <Animated.View style={[styles.cell, bgStyle]}>
//         <AnimateableText animatedProps={animatedKl2Props} style={textStyle} />
//       </Animated.View>
//       <Animated.View style={[styles.cell, bgStyle]}>
//         <AnimateableText animatedProps={animatedKl1Props} style={textStyle} />
//       </Animated.View>
//     </View>
//   );
// };
