import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LudoboardScreen from '../screens/LudoboardScreen';
import HomeScreen from '../screens/HomeScreen';
import SplashScreen from '../screens/SplashScreen';
import {navigationRef} from '../utils/NavigationUtil';

const Stack = createNativeStackNavigator();

function Navigation() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="LudoBoardScreen"
          options={{
            animation: 'fade',
            headerShown: false,
          }}
          component={LudoboardScreen}
        />

        <Stack.Screen
          name="HomeScreen"
          options={{
            animation: 'fade',
            headerShown: false,
          }}
          component={HomeScreen}
        />
        <Stack.Screen
          name="SplashScreen"
          options={{
            animation: 'fade',
            headerShown: false,
          }}
          component={SplashScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
