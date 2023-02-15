import React from 'react';

import { Block, Button, Screen, Text } from '@components';
import { navigate } from '@navigation/navigation-service';
import { APP_SCREEN } from '@navigation/screen-types';
import { Canvas, Rect } from '@shopify/react-native-skia';
export const Login = () => {
  // func
  const navigateWatchList = () => {
    navigate(APP_SCREEN.WATCH_LIST);
  };

  // render
  return (
    <Block block paddingTop={0} paddingHorizontal={15}>
      <Screen
        statusBarStyle="dark-content"
        bottomInsetColor="transparent"
        scroll
        style={{ paddingVertical: 0, paddingHorizontal: 10 }}
        backgroundColor={'transparent'}>
        <Button onPress={navigateWatchList}>
          <Text>Watch List</Text>
        </Button>
        <Canvas style={{ width: 100, height: 100 }}>
          <Rect color={'red'} x={0} y={0} width={100} height={100} />
        </Canvas>
      </Screen>
    </Block>
  );
};
