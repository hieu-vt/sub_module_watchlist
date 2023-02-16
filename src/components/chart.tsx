import React from 'react';

import Animated, {
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { HEIGHT_CHART, WIDTH_CHART } from '../constant';

const data = [
  [0, HEIGHT_CHART / 2],
  [1, HEIGHT_CHART / 2],
];

const PathAnimated = Animated.createAnimatedComponent(Path);

const MiniLineChart = () => {
  const animatedData = useSharedValue(data);

  const animatedProps = useAnimatedProps(() => {
    const path = animatedData.value.reduce(
      (acc, val, index) =>
        `${acc} ${index === 0 ? 'M' : 'L'} ${val[0]},${val[1]}`,
      '',
    );
    console.log('first', path);
    return { d: path };
  });

  return (
    <Svg
      width={WIDTH_CHART}
      height={HEIGHT_CHART}
      fill="none"
      stroke="blue"
      strokeWidth="1"
      strokeLinejoin="round"
      strokeLinecap="round"
      style={{ backgroundColor: 'red' }}>
      <PathAnimated animatedProps={animatedProps} />
    </Svg>
  );
};

export default MiniLineChart;
