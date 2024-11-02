import {Dimensions, PixelRatio, Platform, StatusBar} from 'react-native';

export const PlatformOS = Platform.OS;
export const pixelRatio = PixelRatio.get();
export const STATUS_BAR_HEIGHT = getStatusBarHeight();

export const height = Dimensions.get('window').height - STATUS_BAR_HEIGHT;
export const {width} = Dimensions.get('window');

export const w = percent => (width * percent) / 100;
export const h = percent => (height * percent) / 100;
export const totalSize = num => (Math.sqrt(height + width) * num) / 100;

//Font size use iPhone6 as base size which is 375 x 667
const baseWidth = 375;
const baseHeight = 667;

const scaleWidth = width / baseWidth;
const scaleHeight = height / baseHeight;
const scale = Math.min(scaleWidth, scaleHeight);

export const fs = size => Math.ceil(size * scale);

/*
 * Get Status Bar Height
 */

const X_WIDTH = 375;
const X_HEIGHT = 812;

const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;

const {height: W_HEIGHT, width: W_WIDTH} = Dimensions.get('window');

let isIPhoneX = false;

if (Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS) {
  isIPhoneX =
    (W_WIDTH === X_WIDTH && W_HEIGHT === X_HEIGHT) ||
    (W_WIDTH === XSMAX_WIDTH && W_HEIGHT === XSMAX_HEIGHT);
}

export function getStatusBarHeight() {
  return Platform.select({
    ios: isIPhoneX ? 44 : 20,
    android: StatusBar.currentHeight,
    default: 0,
  });
}

export const isObjectEmpty = obj => {
  for (var x in obj) {
    return false;
  }
  return true;
};

export const appInfo = {
  appName: '', //need to write app name
  appURL:
    Platform.OS === 'android'
      ? 'https://play.google.com/store?hl=en_IN'
      : 'https://www.apple.com/app-store/',
};

export const regx = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  password: /^(?=.[\d])(?=.[A-Z])(?=.[a-z])(?=.[!@#$%^&])[\w!@#$%^&]{8,16}$/,
  fullName: /^(?=.[A-Za-z ])[A-Za-z ]{1,}$/,
  otp: /^(?=.[0-9])[0-9]{6}$/,
  url: /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%.\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%\+.~#?&//=])/g,
  month: /^(0?[1-9]|1[012])$/,
  year: /(?:(?:20)[0-9]{2})/,
  cvv: /^[0-9]{3,4}$/,
  cardNumber: /^[0-9]{13,16}$/,
  phoneWithCountryCode:
    /^(?=.[+])[+]{1}?([91]{2})\)?[-. ]?([0-9]{5})[-. ]?([0-9]{5})$/,
  phoneFirstThree: /^(?=.[+])[+]{1}?([0-9]{2})$/,
  phoneLastTen: /^(?=.*[0-9])[0-9]{10}$/,
  htmlTags: /<\/?[^>]+(>|$)/g,
  removeSpaces: /\s/g,
  gst: /^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/,
  pan: /[A-Z]{5}[0-9]{4}[A-Z]{1}/,
  // phoneOnlyLastTen: /^\d{10}$/,
  // phoneWithCountryCode: /^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{8,16})$/,
};

//Image Resize M-1
let maxCanvasWidth1600 = 1600;
let maxCanvasHeight2560 = 2560;

let maxCanvasWidth1536 = 1536;
let maxCanvasHeight2048 = 2048;

export const getHeight = imgHeight => {
  if (getCurrentDeviceAspectRadio() === get2048DeviceAspectRatio()) {
    return (imgHeight / maxCanvasHeight2048) * (height + STATUS_BAR_HEIGHT);
  } else {
    return (imgHeight / maxCanvasHeight2560) * (height + STATUS_BAR_HEIGHT);
  }
};

export const getWidth = imgWidth => {
  if (getCurrentDeviceAspectRadio() === get2048DeviceAspectRatio()) {
    return (imgWidth / maxCanvasWidth1536) * width;
  } else {
    return (imgWidth / maxCanvasWidth1600) * width;
  }
};

const getCurrentDeviceAspectRadio = () => {
  return width / (height + STATUS_BAR_HEIGHT);
};

const get2048DeviceAspectRatio = () => {
  return maxCanvasHeight2048 / maxCanvasWidth1536;
};

//Image Resize M-2
export function actuatedNormalize(size) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

export const padding = {
  sm: 10,
  md: 20,
  lg: 30,
  xl: 40,
};

export const fontsSize = {
  sm: 12,
  md: 18,
  lg: 28,
};

/**
 * These Function are for scaling the size of the component
 *
 * Documentation available in doc folder
 */

export const horizontalScale = (size: number) => {
  const scaledWidth = (width / baseWidth) * size;
  return scaledWidth < 1 ? scaledWidth : Math.floor(scaledWidth);
};
export const verticalScale = (size: number) => {
  const scaledHeight = (height / baseHeight) * size;
  return scaledHeight < 1 ? scaledHeight : Math.floor(scaledHeight);
};
export const moderateScale = (size: number, factor = 0.5) => {
  const moderatedScale = size + (horizontalScale(size) - size) * factor;
  return moderatedScale < 1 ? moderatedScale : Math.floor(moderatedScale);
};
