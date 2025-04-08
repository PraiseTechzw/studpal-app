import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';

// Mock data for study materials
const studyMaterials = [
  {
    id: '1',
    title: 'Introduction to React Native',
    subject: 'Mobile Development',
    duration: '2 hours',
    progress: 75,
    icon: 'mobile',
  },
  {
    id: '2',
    title: 'Advanced JavaScript Concepts',
    subject: 'Programming',
    duration: '3 hours',
    progress: 30,
    icon: 'code',
  },
  {
    id: '3',
    title: 'UI/UX Design Principles',
    subject: 'Design',
    duration: '1.5 hours',
    progress: 100,
    icon: 'paint-brush',
  },
  {
    id: '4',
    title: 'Data Structures and Algorithms',
    subject: 'Computer Science',
    duration: '4 hours',
    progress: 50,
    icon: 'database',
  },
  {
    id: '5',
    title: 'Machine Learning Basics',
    subject: 'Artificial Intelligence',
    duration: '3.5 hours',
    progress: 0,
    icon: 'brain',
  },
];

export default function StudyScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredMaterials = studyMaterials.filter(material => 
    material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStudyItem = ({ item }) => (
    <TouchableOpacity style={styles.studyCard}>
      <View style={styles.iconContainer}>
        <FontAwesome name={item.icon} size={24} color={COLORS.primary} />
      </View>
      <View style={styles.studyInfo}>
        <Text style={styles.studyTitle}>{item.title}</Text>
        <Text style={styles.studySubject}>{item.subject}</Text>
        <View style={styles.studyMeta}>
          <Text style={styles.studyDuration}>{item.duration}</Text>
          <View style={styles.progressContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${item.progress}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{item.progress}%</Text>
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={24} color={COLORS.textLight} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Study Materials</Text>
        <TouchableOpacity style={styles.addButton}>
          <FontAwesome name="plus" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={20} color={COLORS.textLight} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search study materials..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <FlatList
        data={filteredMaterials}
        renderItem={renderStudyItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.base * 2,
    paddingHorizontal: SIZES.base,
    ...SHADOWS.small,
  },
  searchIcon: {
    marginRight: SIZES.base,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  listContainer: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding * 2,
  },
  studyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    padding: SIZES.base * 2,
    marginBottom: SIZES.base * 2,
    ...SHADOWS.small,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.base * 2,
  },
  studyInfo: {
    flex: 1,
  },
  studyTitle: {
    fontSize: SIZES.font,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 2,
  },
  studySubject: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginBottom: SIZES.base,
  },
  studyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studyDuration: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    color: COLORS.textLight,
    marginRight: SIZES.base,
  },
  progressContainer: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    marginRight: SIZES.base,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    width: 40,
    textAlign: 'right',
  },
}); 