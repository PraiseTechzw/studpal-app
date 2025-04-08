import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  primary: '#4A90E2',
  secondary: '#6C63FF',
  accent: '#FF6B6B',
  background: '#FFFFFF',
  text: '#333333',
  textLight: '#666666',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FFC107',
  info: '#2196F3',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#9E9E9E',
  lightGray: '#F5F5F5',
  darkGray: '#424242',
};

export const SIZES = {
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  extraLarge: 24,
  xxl: 32,
  width,
  height,
};

export const FONTS = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
};

export const SHADOWS = {
  small: {
    boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
    elevation: 2,
  },
  medium: {
    boxShadow: '0px 4px 4.65px rgba(0, 0, 0, 0.30)',
    elevation: 4,
  },
  large: {
    boxShadow: '0px 6px 7.49px rgba(0, 0, 0, 0.37)',
    elevation: 6,
  },
}; 