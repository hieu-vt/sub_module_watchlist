import { StyleSheet } from 'react-native';

import { HEIGHT_COLUM, SPACER_BOTTOM, WIDTH_COLUM } from './constant';

export const styles = StyleSheet.create({
  cell: {
    minWidth: WIDTH_COLUM,
    height: HEIGHT_COLUM,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingBottom: SPACER_BOTTOM,
  },
  name: {
    fontWeight: 'bold',
  },
});