import { StyleSheet } from 'react-native';

import { HEIGHT_COLUM, WIDTH_COLUM } from './constant';

export const styles = StyleSheet.create({
  cell: {
    width: WIDTH_COLUM / 1.5,
    height: HEIGHT_COLUM,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#DFD3C3',
  },
  itemListContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#DFD3C3',
  },
  name: {
    fontWeight: 'bold',
  },
});
