import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Switch,
  SafeAreaView,
  Alert,
} from 'react-native';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';
import { router } from 'expo-router';

// Mock data for study materials
const initialMaterials = [
  {
    id: '1',
    title: 'Biology Chapter 5 Notes',
    description: 'Notes on cell structure and function',
    category: 'Biology',
    isPublic: true,
    createdAt: new Date('2023-05-15'),
    author: 'John Doe',
  },
  {
    id: '2',
    title: 'Chemistry Formula Sheet',
    description: 'Common formulas for organic chemistry',
    category: 'Chemistry',
    isPublic: false,
    createdAt: new Date('2023-05-10'),
    author: 'John Doe',
  },
  {
    id: '3',
    title: 'Physics Laws Summary',
    description: 'Key physics laws and equations',
    category: 'Physics',
    isPublic: true,
    createdAt: new Date('2023-05-05'),
    author: 'John Doe',
  },
];

type StudyMaterial = {
  id: string;
  title: string;
  description: string;
  category: string;
  isPublic: boolean;
  createdAt: Date;
  author: string;
};

export default function StudyMaterialsScreen() {
  const [materials, setMaterials] = useState<StudyMaterial[]>(initialMaterials);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    description: '',
    category: '',
    isPublic: false,
  });

  const filteredMaterials = materials.filter(
    (material) =>
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMaterial = () => {
    if (!newMaterial.title || !newMaterial.category) {
      Alert.alert('Error', 'Title and category are required');
      return;
    }

    const material: StudyMaterial = {
      id: Date.now().toString(),
      title: newMaterial.title,
      description: newMaterial.description,
      category: newMaterial.category,
      isPublic: newMaterial.isPublic,
      createdAt: new Date(),
      author: 'John Doe', // This would come from user context in a real app
    };

    setMaterials([material, ...materials]);
    setModalVisible(false);
    setNewMaterial({
      title: '',
      description: '',
      category: '',
      isPublic: false,
    });
  };

  const handleShareMaterial = (material: StudyMaterial) => {
    // In a real app, this would open a share dialog
    Alert.alert(
      'Share Material',
      `Sharing "${material.title}" with others...`,
      [{ text: 'OK' }]
    );
  };

  const handleTogglePrivacy = (id: string) => {
    setMaterials(
      materials.map((material) =>
        material.id === id
          ? { ...material, isPublic: !material.isPublic }
          : material
      )
    );
  };

  const renderMaterialItem = ({ item }: { item: StudyMaterial }) => (
    <View style={styles.materialCard}>
      <View style={styles.materialHeader}>
        <View style={styles.materialTitleContainer}>
          <Text style={styles.materialTitle}>{item.title}</Text>
          <View style={styles.privacyContainer}>
            <Switch
              value={item.isPublic}
              onValueChange={() => handleTogglePrivacy(item.id)}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
            <Text style={styles.privacyText}>
              {item.isPublic ? 'Public' : 'Private'}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => handleShareMaterial(item)}
        >
          <FontAwesome name="share-alt" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      <Text style={styles.materialDescription}>{item.description}</Text>
      <View style={styles.materialFooter}>
        <View style={styles.categoryContainer}>
          <FontAwesome name="folder" size={16} color={COLORS.primary} />
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <Text style={styles.dateText}>
          {item.createdAt.toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Study Materials</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <FontAwesome name="plus" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={20} color={COLORS.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search materials..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredMaterials}
        renderItem={renderMaterialItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Study Material</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Title"
              value={newMaterial.title}
              onChangeText={(text) =>
                setNewMaterial({ ...newMaterial, title: text })
              }
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              value={newMaterial.description}
              onChangeText={(text) =>
                setNewMaterial({ ...newMaterial, description: text })
              }
              multiline
              numberOfLines={4}
            />

            <TextInput
              style={styles.input}
              placeholder="Category"
              value={newMaterial.category}
              onChangeText={(text) =>
                setNewMaterial({ ...newMaterial, category: text })
              }
            />

            <View style={styles.privacyContainer}>
              <Text style={styles.privacyLabel}>Make Public</Text>
              <Switch
                value={newMaterial.isPublic}
                onValueChange={(value) =>
                  setNewMaterial({ ...newMaterial, isPublic: value })
                }
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={COLORS.white}
              />
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleAddMaterial}
            >
              <Text style={styles.saveButtonText}>Save Material</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: SIZES.padding,
    paddingHorizontal: SIZES.base * 2,
    paddingVertical: SIZES.base,
    ...SHADOWS.small,
  },
  searchInput: {
    flex: 1,
    marginLeft: SIZES.base,
    fontFamily: FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.text,
  },
  listContainer: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding * 2,
  },
  materialCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    padding: SIZES.base * 2,
    marginBottom: SIZES.base * 2,
    ...SHADOWS.small,
  },
  materialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.base,
  },
  materialTitleContainer: {
    flex: 1,
    marginRight: SIZES.base,
  },
  materialTitle: {
    fontSize: SIZES.large,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 4,
  },
  privacyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  privacyText: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginLeft: 4,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  materialDescription: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginBottom: SIZES.base,
  },
  materialFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    marginLeft: 4,
  },
  dateText: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    padding: SIZES.padding,
    ...SHADOWS.medium,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  modalTitle: {
    fontSize: SIZES.large,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.base,
    padding: SIZES.base * 2,
    marginBottom: SIZES.base * 2,
    fontFamily: FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  privacyLabel: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginRight: SIZES.base,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.base,
    padding: SIZES.base * 2,
    alignItems: 'center',
    marginTop: SIZES.base,
  },
  saveButtonText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
}); 