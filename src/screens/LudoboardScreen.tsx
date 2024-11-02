import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import Wrapper from '../components/Wrapper';
import MenuIcon from '../assets/images/menu.png';
import {fs} from '../utils/util.style';
import {deviceHeight, deviceWidth} from '../constants/Scaling';
import Dice from '../components/Dice';
import Pocket from '../components/Pocket';
import VerticalPath from '../components/VerticalPath';

const LudoboardScreen = () => {
  return (
    <Wrapper>
      <TouchableOpacity style={styles.menuIconButton}>
        <Image source={MenuIcon} style={styles.menuIcon} />
      </TouchableOpacity>
      <View style={styles.container}>
        <View style={styles.flexRow}>
          <Dice color={'green'} />
          <Dice color={'yellow'} rotate={true} />
        </View>
        <View style={styles.ludoBoard}>
          <View style={styles.plotContainer}>
            <Pocket color={'green'} player={2} />
            <VerticalPath color={'yellow'} />
            <Pocket color={'yellow'} player={3} />
          </View>
        </View>
        <View style={styles.flexRow}>
          <Dice color={'blue'} />
          <Dice color={'red'} rotate={true} />
        </View>
      </View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  menuIcon: {
    width: fs(30),
    height: fs(30),
  },
  menuIconButton: {
    position: 'absolute',
    top: fs(60),
    left: fs(20),
  },
  container: {
    alignSelf: 'center',
    justifyContent: 'center',
    height: deviceHeight * 0.5,
    width: deviceWidth,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: fs(30),
    justifyContent: 'space-between',
  },
  ludoBoard: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    padding: fs(10),
    backgroundColor: 'red',
  },
  plotContainer: {
    width: '100%',
    height: '40%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: '#ccc',
  },
});

export default LudoboardScreen;
