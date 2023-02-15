import React, { useEffect } from 'react';

import BootSplash from 'react-native-bootsplash';
import { useSelector } from 'react-redux';

import { useSocketContext } from '@common';
import { Home } from '@features/authentication/home';
import { Login } from '@features/un-authentication/login';
import { WatchList } from '@features/un-authentication/watch-list';
import { AppModule } from '@native-module';
import { APP_SCREEN, RootStackParamList } from '@navigation/screen-types';
import { createStackNavigator } from '@react-navigation/stack';
import { selectAppToken } from '@redux-selector/app';

const RootStack = createStackNavigator<RootStackParamList>();

export const RootNavigation = () => {
  // state
  const token = useSelector(selectAppToken);
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

  useEffect(() => {
    if (!token) {
      // clean cache when logout
      AppModule.clearCache();
    }
  }, [token]);

  // render
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {token === undefined ? (
        <RootStack.Group
          screenOptions={{
            animationTypeForReplace: 'pop',
            headerBackTitleVisible: false,
          }}>
          <RootStack.Screen name={APP_SCREEN.LOGIN} component={Login} />
          <RootStack.Screen
            options={{ headerShown: true, title: 'Watch List' }}
            name={APP_SCREEN.WATCH_LIST}
            component={WatchList}
          />
        </RootStack.Group>
      ) : (
        <RootStack.Group
          screenOptions={{
            gestureEnabled: false,
          }}>
          <RootStack.Screen name={APP_SCREEN.HOME} component={Home} />
        </RootStack.Group>
      )}
    </RootStack.Navigator>
  );
};
