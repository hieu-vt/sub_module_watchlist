import React from 'react';
import { Text, View } from 'react-native';

import { styles } from '../styles';

export const Header = () => {
  // render
  return (
    <View style={[styles.headerContainer]}>
      <View style={styles.cell}>
        <Text>Biến động giá</Text>
      </View>
      <View style={styles.cell}>
        <Text>Hôm nay</Text>
      </View>
      <View style={styles.cell}>
        <Text>Giá</Text>
      </View>
    </View>
  );
};
