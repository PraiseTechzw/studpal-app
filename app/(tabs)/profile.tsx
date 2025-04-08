import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';
import { router } from 'expo-router';

// Mock user data
const userData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  studyTime: '24 hours',
  completedCourses: 5,
  achievements: 3,
};

// Mock settings options
const settingsOptions = [
  {
    id: '1',
    title: 'Account Settings',
    icon: 'user',
    iconType: 'FontAwesome',
  },
  {
    id: '2',
    title: 'Notifications',
    icon: 'bell',
    iconType: 'FontAwesome',
  },
  {
    id: '3',
    title: 'Study Preferences',
    icon: 'book',
    iconType: 'FontAwesome',
  },
  {
    id: '4',
    title: 'Privacy',
    icon: 'lock',
    iconType: 'FontAwesome',
  },
  {
    id: '5',
    title: 'Help & Support',
    icon: 'question-circle',
    iconType: 'FontAwesome',
  },
  {
    id: '6',
    title: 'About',
    icon: 'info-circle',
    iconType: 'FontAwesome',
  },
];

export default function ProfileScreen() {
  const handleLogout = () => {
    // TODO: Implement actual logout logic
    router.replace('/');
  };

  const renderSettingItem = (item) => {
    const IconComponent = item.iconType === 'FontAwesome' ? FontAwesome : 
                         item.iconType === 'MaterialIcons' ? MaterialIcons : Ionicons;
    
    return (
      <TouchableOpacity key={item.id} style={styles.settingItem}>
        <View style={styles.settingIconContainer}>
          <IconComponent name={item.icon} size={20} color={COLORS.primary} />
        </View>
        <Text style={styles.settingTitle}>{item.title}</Text>
        <MaterialIcons name="chevron-right" size={24} color={COLORS.textLight} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.editButton}>
            <FontAwesome name="edit" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.profileSection}>
          <Image source={{ uri: userData.avatar }} style={styles.avatar} />
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userData.studyTime}</Text>
            <Text style={styles.statLabel}>Study Time</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userData.completedCourses}</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userData.achievements}</Text>
            <Text style={styles.statLabel}>Achievements</Text>
          </View>
        </View>
        
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {settingsOptions.map(renderSettingItem)}
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <FontAwesome name="sign-out" size={20} color={COLORS.error} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding,
    paddingBottom: SIZES.base,
  },
  headerTitle: {
    fontSize: SIZES.extraLarge,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: SIZES.padding,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: SIZES.base,
    ...SHADOWS.medium,
  },
  userName: {
    fontSize: SIZES.large,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
    padding: SIZES.base * 2,
    ...SHADOWS.small,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: SIZES.large,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },
  settingsSection: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
    padding: SIZES.base,
    ...SHADOWS.small,
  },
  sectionTitle: {
    fontSize: SIZES.font,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SIZES.base,
    paddingHorizontal: SIZES.base,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.base * 2,
  },
  settingTitle: {
    flex: 1,
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.padding * 2,
    padding: SIZES.base * 2,
    ...SHADOWS.small,
  },
  logoutText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.bold,
    color: COLORS.error,
    marginLeft: SIZES.base,
  },
}); 