import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { FontAwesome, MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';

const { width } = Dimensions.get('window');

interface OnboardingItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const onboardingData: OnboardingItem[] = [
  {
    id: '1',
    title: 'AI-Powered Study Assistant',
    description: 'Get instant help with your studies using advanced AI technology',
    icon: <MaterialIcons name="psychology" size={120} color={COLORS.primary} />,
  },
  {
    id: '2',
    title: 'Smart Note Taking',
    description: 'Organize your notes efficiently with AI-powered categorization',
    icon: <Ionicons name="document-text" size={120} color={COLORS.secondary} />,
  },
  {
    id: '3',
    title: 'Study Schedule',
    description: 'Create personalized study schedules that adapt to your learning style',
    icon: <MaterialCommunityIcons name="calendar-clock" size={120} color={COLORS.accent} />,
  },
  {
    id: '4',
    title: 'Progress Tracking',
    description: 'Monitor your learning progress with detailed analytics',
    icon: <FontAwesome name="line-chart" size={120} color={COLORS.success} />,
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const renderItem = ({ item }: { item: OnboardingItem }) => (
    <View style={styles.slide}>
      <View style={styles.iconContainer}>
        {item.icon}
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      router.replace('/auth');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />
      
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                currentIndex === index && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
        
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.base * 2,
  },
  iconContainer: {
    width: width * 0.8,
    height: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.base * 2,
  },
  title: {
    fontSize: SIZES.extraLarge,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginTop: SIZES.base * 2,
  },
  description: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SIZES.base,
    paddingHorizontal: SIZES.base * 2,
  },
  footer: {
    padding: SIZES.base * 2,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SIZES.base * 2,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.lightGray,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: COLORS.primary,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SIZES.base * 2,
    borderRadius: SIZES.base,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
  },
}); 