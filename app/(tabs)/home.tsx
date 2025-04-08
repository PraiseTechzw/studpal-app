import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';
import { FontAwesome } from '@expo/vector-icons';

const features = [
  {
    id: '1',
    title: 'AI Study Assistant',
    description: 'Get help with your studies using AI',
    icon: '🤖',
  },
  {
    id: '2',
    title: 'Smart Notes',
    description: 'Organize and review your notes',
    icon: '📝',
  },
  {
    id: '3',
    title: 'Study Schedule',
    description: 'Plan your study sessions',
    icon: '📅',
  },
  {
    id: '4',
    title: 'Progress Tracking',
    description: 'Monitor your learning progress',
    icon: '📊',
  },
  {
    id: '5',
    title: 'Quiz Generator',
    description: 'Create practice quizzes',
    icon: '❓',
  },
  {
    id: '6',
    title: 'Resource Library',
    description: 'Access study materials',
    icon: '📚',
  },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, Student!</Text>
          <Text style={styles.subtitle}>Ready to learn something new?</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <FontAwesome name="user-circle" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Study Hours</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Tasks Due</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>85%</Text>
            <Text style={styles.statLabel}>Progress</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature) => (
            <TouchableOpacity key={feature.id} style={styles.featureCard}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>
                {feature.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.aiAssistantCard}>
          <Text style={styles.aiTitle}>AI Study Assistant</Text>
          <Text style={styles.aiDescription}>
            Need help with your studies? Ask me anything!
          </Text>
          <TouchableOpacity style={styles.aiButton}>
            <Text style={styles.aiButtonText}>Ask AI Assistant</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.base * 2,
    paddingTop: SIZES.base * 4,
  },
  greeting: {
    fontSize: SIZES.extraLarge,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  subtitle: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginTop: SIZES.base / 2,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SIZES.base * 2,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SIZES.base * 2,
    borderRadius: SIZES.base,
    marginHorizontal: SIZES.base,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  statNumber: {
    fontSize: SIZES.extraLarge,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginTop: SIZES.base / 2,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    padding: SIZES.base * 2,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SIZES.base,
  },
  featureCard: {
    width: '45%',
    backgroundColor: COLORS.white,
    padding: SIZES.base * 2,
    borderRadius: SIZES.base,
    margin: SIZES.base,
    ...SHADOWS.small,
  },
  featureIcon: {
    fontSize: SIZES.extraLarge,
    marginBottom: SIZES.base,
  },
  featureTitle: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginBottom: SIZES.base / 2,
  },
  featureDescription: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
  aiAssistantCard: {
    backgroundColor: COLORS.primary,
    margin: SIZES.base * 2,
    padding: SIZES.base * 2,
    borderRadius: SIZES.base,
    ...SHADOWS.medium,
  },
  aiTitle: {
    fontSize: SIZES.large,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: SIZES.base,
  },
  aiDescription: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.white,
    marginBottom: SIZES.base * 2,
  },
  aiButton: {
    backgroundColor: COLORS.white,
    padding: SIZES.base * 2,
    borderRadius: SIZES.base,
    alignItems: 'center',
  },
  aiButtonText: {
    color: COLORS.primary,
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
  },
}); 