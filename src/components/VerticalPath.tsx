import {View, Text} from 'react-native';
import React from 'react';

const VerticalPath = ({cells, color}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        width: '20%',
        height: '100%',
      }}></View>
  );
};

export default React.memo(VerticalPath);
