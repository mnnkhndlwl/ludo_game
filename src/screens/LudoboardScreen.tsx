import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import Wrapper from '../components/Wrapper';
import MenuIcon from '../assets/images/menu.png';
import {fs} from '../utils/util.style';
import {deviceHeight, deviceWidth} from '../constants/Scaling';
import Dice from '../components/Dice';
import Pocket from '../components/Pocket';
import VerticalPath from '../components/VerticalPath';
import {plot1Data, plot2Data, plot3Data, plot4Data} from '../helpers/PlotData';
import HorizontalPath from '../components/HorizontalPath';
import FourTraingles from '../components/FourTraingles';

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
            <VerticalPath color={'yellow'} cells={plot2Data} />
            <Pocket color={'yellow'} player={3} />
          </View>
          <View style={styles.pathContainer}>
            <HorizontalPath color={'green'} cells={plot1Data} />
            <FourTraingles />
            <HorizontalPath color={'blue'} cells={plot3Data} />
          </View>
          <View style={styles.plotContainer}>
            <Pocket color={'red'} player={1} />
            <VerticalPath color={'red'} cells={plot4Data} />
            <Pocket color={'blue'} player={4} />
          </View>
        </View>
        <View style={styles.flexRow}>
          <Dice color={'red'} />
          <Dice color={'blue'} rotate={true} />
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
  },
  plotContainer: {
    width: '100%',
    height: '40%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: '#ccc',
  },
  pathContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '20%',
    justifyContent: 'space-between',
    backgroundColor: '#1E5162',
  },
});

export default LudoboardScreen;
