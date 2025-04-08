import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';

const subjects = [
  { id: '1', name: 'Mathematics', color: '#FF6B6B' },
  { id: '2', name: 'Physics', color: '#4ECDC4' },
  { id: '3', name: 'Chemistry', color: '#45B7D1' },
  { id: '4', name: 'Biology', color: '#96CEB4' },
];

const studySchedule = [
  {
    id: '1',
    subject: 'Mathematics',
    topic: 'Calculus',
    time: '2:00 PM - 3:30 PM',
    date: 'Today',
  },
  {
    id: '2',
    subject: 'Physics',
    topic: 'Mechanics',
    time: '4:00 PM - 5:30 PM',
    date: 'Today',
  },
];

export default function StudyScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Study Hub</Text>
        <Text style={styles.subtitle}>Manage your study materials</Text>
      </View>

      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={20} color={COLORS.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search study materials..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={COLORS.textLight}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Your Subjects</Text>
        <View style={styles.subjectsContainer}>
          {subjects.map((subject) => (
            <TouchableOpacity
              key={subject.id}
              style={[styles.subjectCard, { backgroundColor: subject.color }]}
            >
              <Text style={styles.subjectName}>{subject.name}</Text>
              <FontAwesome name="book" size={24} color={COLORS.white} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Today's Schedule</Text>
        <View style={styles.scheduleContainer}>
          {studySchedule.map((session) => (
            <View key={session.id} style={styles.scheduleCard}>
              <View style={styles.scheduleHeader}>
                <Text style={styles.scheduleSubject}>{session.subject}</Text>
                <Text style={styles.scheduleTime}>{session.time}</Text>
              </View>
              <Text style={styles.scheduleTopic}>{session.topic}</Text>
              <View style={styles.scheduleFooter}>
                <Text style={styles.scheduleDate}>{session.date}</Text>
                <TouchableOpacity style={styles.startButton}>
                  <Text style={styles.startButtonText}>Start Session</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.addButton}>
          <FontAwesome name="plus" size={20} color={COLORS.white} />
          <Text style={styles.addButtonText}>Add Study Session</Text>
        </TouchableOpacity>
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
    padding: SIZES.base * 2,
    paddingTop: SIZES.base * 4,
    backgroundColor: COLORS.primary,
  },
  title: {
    fontSize: SIZES.extraLarge,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  subtitle: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.white,
    opacity: 0.8,
    marginTop: SIZES.base / 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    margin: SIZES.base * 2,
    padding: SIZES.base * 2,
    borderRadius: SIZES.base,
  },
  searchInput: {
    flex: 1,
    marginLeft: SIZES.base,
    fontFamily: FONTS.regular,
    fontSize: SIZES.font,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    padding: SIZES.base * 2,
  },
  subjectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SIZES.base,
  },
  subjectCard: {
    width: '45%',
    padding: SIZES.base * 2,
    borderRadius: SIZES.base,
    margin: SIZES.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  subjectName: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.white,
  },
  scheduleContainer: {
    padding: SIZES.base,
  },
  scheduleCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.base * 2,
    borderRadius: SIZES.base,
    marginBottom: SIZES.base * 2,
    ...SHADOWS.small,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  scheduleSubject: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.text,
  },
  scheduleTime: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
  scheduleTopic: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginBottom: SIZES.base,
  },
  scheduleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduleDate: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.base * 2,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.base,
  },
  startButtonText: {
    color: COLORS.white,
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    margin: SIZES.base * 2,
    padding: SIZES.base * 2,
    borderRadius: SIZES.base,
    ...SHADOWS.small,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    marginLeft: SIZES.base,
  },
}); 