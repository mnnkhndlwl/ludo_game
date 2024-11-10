import {View, Text, StyleSheet} from 'react-native';
import React, {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {announceWinner, resetGame} from '../redux/reducers/gameSlice';
import {playSound} from '../utils/SoundUtils';
import {goBack} from '../utils/NavigationUtil';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import GradientButton from './GradientButton';
import {fs} from '../utils/util.style';

const MenuModal = ({visible, onPressHide}) => {
  const dispatch = useDispatch();
  const handleNewGame = useCallback(() => {
    dispatch(resetGame());
    playSound('game_start');
    dispatch(announceWinner(null));
    onPressHide();
  }, [dispatch, onPressHide]);

  const handleHome = useCallback(() => {
    goBack();
  }, []);

  return (
    <Modal
      style={styles.bottomModalView}
      isVisible={visible}
      backdropColor="black"
      backdropOpacity={0.8}
      onBackdropPress={onPressHide}
      animationIn={'zoomIn'}
      animationOut={'zoomOut'}
      onBackButtonPress={onPressHide}>
      <View style={styles.modalContainer}>
        <LinearGradient
          style={styles.gradientContainer}
          colors={['#0f0c29', '#303b63', '#24243e']}>
          <View style={styles.subView}>
            <GradientButton title={'RESUME'} onPress={onPressHide} />
            <GradientButton title={'NEW GAME'} onPress={handleNewGame} />
            <GradientButton title={'HOME'} onPress={handleHome} />
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  bottomModalView: {
    justifyContent: 'center',
    width: '95%',
    alignSelf: 'center',
  },
  modalContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientContainer: {
    borderRadius: fs(20),
    overflow: 'hidden',
    padding: fs(20),
    paddingVertical: fs(40),
    width: '96%',
    borderWidth: fs(2),
    borderColor: 'gold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subView: {
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MenuModal;
