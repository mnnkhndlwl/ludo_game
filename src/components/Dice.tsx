import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {fs} from '../utils/util.style';
import {BackgroundImage} from '../helpers/GetIcons';
import LottieView from 'lottie-react-native';
import DiceRoll from '../assets/animation/diceroll.json';
import {LinearGradient} from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectCurrentPlayerChance,
  selectDiceNo,
  selectDiceRolled,
} from '../redux/reducers/gameSelectors';
import {
  enableCellSelection,
  enablePileSelection,
  updateDiceNo,
  updatePlayerChance,
} from '../redux/reducers/gameSlice';
import {playSound} from '../utils/SoundUtils';
import {sendMessage, isConnected} from '../utils/WebSocketUtil';
import {rollDiceThunk} from '../redux/reducers/gameAction';

const Dice = ({color, rotate, player, data}) => {
  const dispatch = useDispatch();
  const currentPlayerChance = useSelector(selectCurrentPlayerChance);
  const isDiceRolled = useSelector(selectDiceRolled);
  const diceNo = useSelector(selectDiceNo);
  const animationRef = useRef(new Animated.Value(0)).current;
  const pileIcon = BackgroundImage.GetImage(color);
  const diceIcon = BackgroundImage.GetImage(diceNo);

  const playerPieces = useSelector(
    state => state.game[`player${currentPlayerChance}`],
  );

  const [diceRolling, setDiceRolling] = useState<boolean>(false);

  const delay = (ms: number | undefined) =>
    new Promise(resolve => setTimeout(resolve, ms));

  const handleDicePress = async () => {
    const newDiceNo = Math.floor(Math.random() * 6) + 1;
    playSound('dice_roll');
    setDiceRolling(true);
    await delay(800);

    // Use the rollDiceThunk action which handles WebSocket communication
    dispatch(rollDiceThunk(newDiceNo));

    setDiceRolling(false);

    const isAnyPieceAlive = data?.findIndex(i => i.pos != 0 && i.pos != 57); // the piece is not alive it been into the triangle and in sqaure
    const isAnyPieceLocked = data?.findIndex(i => i.pos == 0); //  the piece which is present in the square

    if (isAnyPieceAlive === -1) {
      if (newDiceNo === 6) {
        dispatch(enablePileSelection({playerNo: player}));
      } else {
        let chancePlayer = player + 1;
        if (chancePlayer > 4) {
          chancePlayer = 1;
        }
        await delay(600);
        dispatch(
          updatePlayerChance({
            chancePlayer: chancePlayer,
          }),
        );

        // Send player chance update via WebSocket
        if (isConnected()) {
          sendMessage('player_chance', {chancePlayer});
        }
      }
    } else {
      const canMove = playerPieces.some(
        pile => pile.travelCount + newDiceNo <= 57 && pile.pos != 0,
      );
      if (
        (!canMove && newDiceNo == 6 && isAnyPieceLocked == -1) ||
        (!canMove && newDiceNo != 6 && isAnyPieceLocked != -1) ||
        (!canMove && newDiceNo != 6 && isAnyPieceLocked == -1)
      ) {
        let chancePlayer = player + 1;
        if (chancePlayer > 4) {
          chancePlayer = 1;
        }
        await delay(600);
        dispatch(
          updatePlayerChance({
            chancePlayer: chancePlayer,
          }),
        );

        // Send player chance update via WebSocket
        if (isConnected()) {
          sendMessage('player_chance', {chancePlayer});
        }
      }

      if (newDiceNo == 6) {
        dispatch(enablePileSelection({playerNo: player}));
      }

      dispatch(
        enableCellSelection({
          playerNo: player,
        }),
      );
    }
  };

  useEffect(() => {
    const animateArrow = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animationRef, {
            toValue: 10,
            duration: 600,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(animationRef, {
            toValue: -10,
            duration: 600,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };
    animateArrow();
  }, []);

  return (
    <View
      style={StyleSheet.compose(styles.flexRow, {
        transform: [{scaleX: rotate ? -1 : 1}],
      })}>
      <View style={styles.border1}>
        <View style={styles.pileIconContainer}>
          <Image source={pileIcon} style={styles.pileIcon} />
        </View>
      </View>
      <View style={styles.border2}>
        <LinearGradient
          style={styles.diceGradient}
          colors={['#aac8ab', '#aac8ab', '#aac8ab']}
          start={{
            x: 0,
            y: 0.5,
          }}
          end={{
            x: 1,
            y: 0.5,
          }}>
          <View style={styles.diceContainer}>
            {currentPlayerChance === player && (
              <>
                {diceRolling ? null : (
                  <TouchableOpacity
                    disabled={isDiceRolled}
                    activeOpacity={0.4}
                    onPress={handleDicePress}>
                    <Image source={diceIcon} style={styles.dice} />
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </LinearGradient>
      </View>

      {currentPlayerChance === player && !isDiceRolled && (
        <Animated.View style={{transform: [{translateX: animationRef}]}}>
          <Image
            source={require('../assets/images/arrow.png')}
            style={{
              width: fs(50),
              height: fs(30),
            }}
          />
        </Animated.View>
      )}

      {currentPlayerChance === player && diceRolling && (
        <LottieView
          source={DiceRoll}
          style={styles.rollingDice}
          loop={false}
          autoPlay
          cacheComposition={true}
          hardwareAccelerationAndroid
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  diceGradient: {
    borderWidth: fs(3),
    borderLeftWidth: fs(3),
    borderColor: '#f0ce2c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rollingDice: {
    height: fs(80),
    width: fs(80),
    zIndex: 99,
    left: fs(45),
    top: fs(-20),
    position: 'absolute',
  },
  flexRow: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  diceContainer: {
    backgroundColor: '#e8c0c1',
    borderWidth: fs(1),
    borderRadius: fs(5),
    width: fs(60),
    height: fs(60),
    paddingHorizontal: fs(8),
    paddingVertical: fs(8),
    padding: fs(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  dice: {
    height: fs(45),
    width: fs(45),
  },
  border1: {
    borderWidth: fs(3),
    borderRightWidth: 0,
    borderColor: '#f0ce2c',
  },
  border2: {
    borderWidth: fs(3),
    padding: fs(1),
    backgroundColor: '#aac8ab',
    //borderRadius: fs(100),
    borderLeftWidth: fs(3),
    borderColor: '#aac8ab',
  },
  linearGradient: {},
  pileIcon: {
    width: fs(35),
    height: fs(35),
  },
  pileIconContainer: {
    paddingHorizontal: fs(3),
  },
});

export default React.memo(Dice);
