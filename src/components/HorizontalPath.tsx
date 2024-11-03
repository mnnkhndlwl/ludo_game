import {View, Text} from 'react-native';
import React, {useMemo} from 'react';
import Cell from './Cell';

const HorizontalPath = ({cells, color}) => {
  const groupedCells = useMemo(() => {
    const groups = [];
    for (let i = 0; i < cells?.length; i += 6) {
      groups.push(cells.slice(i, i + 6));
    }
    return groups;
  }, [cells]);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        width: '40%',
        height: '100%',
      }}>
      <View
        style={{
          flexDirection: 'column',
          width: '100%',
          height: '100%',
        }}>
        {groupedCells.map((group, groupIndex) => (
          <View
            key={`group=${groupIndex}`}
            style={{
              flexDirection: 'row',
              width: '16.7%',
              height: '33.3%',
            }}>
            {group.map(id => {
              return (
                <Cell key={`Cell=${id}`} cell={true} color={color} id={id} />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

export default React.memo(HorizontalPath);