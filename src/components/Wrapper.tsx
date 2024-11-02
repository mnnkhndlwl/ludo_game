import React, {ReactNode} from 'react';
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import BG from '../assets/images/bg.jpg';
import {deviceHeight, deviceWidth} from '../constants/Scaling';

interface WrapperProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const Wrapper: React.FC<WrapperProps> = ({children, style}) => {
  return (
    <ImageBackground source={BG} resizeMode="cover" style={styles.container}>
      <SafeAreaView style={[styles.safeArea, style]}>{children}</SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    width: deviceWidth,
    height: deviceHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Wrapper;
