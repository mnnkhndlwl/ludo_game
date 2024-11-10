import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {fs} from '../utils/util.style';
import {playSound} from '../utils/SoundUtils';
import LinearGradient from 'react-native-linear-gradient';
import {
  ComputerDesktopIcon,
  HomeIcon,
  PlayCircleIcon,
  PlayPauseIcon,
  UsersIcon,
} from 'react-native-heroicons/outline';

const iconSize = fs(20);

const GradientButton = ({title, onPress, iconColor = '#d5be3e'}) => {
  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          playSound('ui');
          onPress();
        }}
        style={styles.btnContainer}>
        <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']}
          style={styles.button}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}>
          {title === 'RESUME' ? (
            <PlayPauseIcon size={iconSize} color={iconColor} />
          ) : title === 'NEW GAME' ? (
            <PlayCircleIcon size={iconSize} color={iconColor} />
          ) : title === 'VS CPU' ? (
            <ComputerDesktopIcon size={iconSize} color={iconColor} />
          ) : title === 'HOME' ? (
            <HomeIcon size={iconSize} color={iconColor} />
          ) : (
            <UsersIcon size={iconSize} color={iconColor} />
          )}
          <Text style={styles.buttonText}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    borderRadius: fs(10),
    borderWidth: fs(2),
    borderColor: '#000',
    marginVertical: fs(10),
  },
  btnContainer: {
    borderWidth: fs(2),
    borderRadius: fs(10),
    elevation: 5,
    backgroundColor: 'white',
    shadowColor: '#d5be3e',
    shadowOpacity: 0.5,
    shadowOffset: {width: 1, height: 1},
    shadowRadius: fs(10),
    borderColor: '#d5be3e',
    width: fs(220),
  },
  button: {
    paddingVertical: fs(10),
    borderRadius: fs(5),
    borderWidth: fs(2),
    borderColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: fs(20),
    paddingHorizontal: fs(20),
  },
  buttonText: {
    color: 'white',
    fontSize: fs(20),
    width: '70%',
    textAlign: 'left',
    fontFamily: 'Philosopher-Bold',
  },
});

export default GradientButton;
