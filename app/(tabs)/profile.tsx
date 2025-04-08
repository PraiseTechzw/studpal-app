import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';

const stats = [
  { id: '1', label: 'Study Hours', value: '24', icon: 'clock-o' },
  { id: '2', label: 'Subjects', value: '6', icon: 'book' },
  { id: '3', label: 'Tasks Completed', value: '12', icon: 'check-circle' },
  { id: '4', label: 'Quiz Score', value: '85%', icon: 'star' },
];

const settings = [
  { id: '1', title: 'Notifications', icon: 'bell' },
  { id: '2', title: 'Dark Mode', icon: 'moon-o' },
  { id: '3', title: 'Study Reminders', icon: 'calendar' },
  { id: '4', title: 'Language', icon: 'language' },
  { id: '5', title: 'Help & Support', icon: 'question-circle' },
  { id: '6', title: 'Privacy Policy', icon: 'shield' },
  { id: '7', title: 'Terms of Service', icon: 'file-text-o' },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.profileIconContainer}>
            <FontAwesome name="user-circle" size={80} color={COLORS.primary} />
          </View>
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.email}>john.doe@example.com</Text>
        </View>

        <View style={styles.statsContainer}>
          {stats.map((stat) => (
            <View key={stat.id} style={styles.statCard}>
              <FontAwesome name={stat.icon} size={24} color={COLORS.primary} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.settingsContainer}>
          {settings.map((setting) => (
            <TouchableOpacity key={setting.id} style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <FontAwesome name={setting.icon} size={20} color={COLORS.text} />
                <Text style={styles.settingTitle}>{setting.title}</Text>
              </View>
              <FontAwesome name="chevron-right" size={16} color={COLORS.textLight} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <FontAwesome name="sign-out" size={20} color={COLORS.white} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    padding: SIZES.base * 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  profileIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  name: {
    fontSize: SIZES.large,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SIZES.base / 2,
  },
  email: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SIZES.base,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    padding: SIZES.base * 2,
    borderRadius: SIZES.base,
    alignItems: 'center',
    marginBottom: SIZES.base,
    ...SHADOWS.small,
  },
  statValue: {
    fontSize: SIZES.large,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginVertical: SIZES.base / 2,
  },
  statLabel: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  settingsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    margin: SIZES.base,
    ...SHADOWS.small,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.base * 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginLeft: SIZES.base,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.error,
    margin: SIZES.base * 2,
    padding: SIZES.base * 2,
    borderRadius: SIZES.base,
    ...SHADOWS.small,
  },
  logoutText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    marginLeft: SIZES.base,
  },
}); 