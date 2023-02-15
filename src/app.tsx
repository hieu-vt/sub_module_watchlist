import React, { Suspense } from 'react';
import { LogBox, StyleSheet } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { PortalProvider } from '@gorhom/portal';

import { SocketProvider, useSocket } from './app/common/socketIo';
import { TestWatchList } from './test-watch-list';

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/ban-types
  function forwardRef<T, P = {}>(
    render: (
      props: P,
      ref: import('react').ForwardedRef<T>,
    ) => import('react').ReactElement | null,
  ): (
    props: P & import('react').RefAttributes<T>,
  ) => import('react').ReactElement | null;
}

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);
/**
 * get icon name by file json
 * const json = require('./app/assets/vector-icon/selection.json');
 * const key = json.icons.reduce((pv, curr) => {
 *   pv[replaceAll(curr.properties.name, '-', '_')] = curr.properties.name;
 *   return pv;
 * }, {});
 * console.log(
 * Object.entries(key)
 *    .sort(([, a], [, b]) => a - b)
 *     .reduce((r, [k, v]) => ({ ...r, [k]: v }), {}),
 * )
 */

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export const MyApp = () => {
  // state
  const socket = useSocket();

  // render
  return (
    <SafeAreaProvider>
      <Suspense fallback={null}>
        <PortalProvider>
          <GestureHandlerRootView style={styles.root}>
            <SocketProvider value={socket}>
              <TestWatchList />
            </SocketProvider>
          </GestureHandlerRootView>
        </PortalProvider>
      </Suspense>
    </SafeAreaProvider>
  );
};
