import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  Alert,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';
import { router } from 'expo-router';

// Mock data for flashcard decks
const initialDecks = [
  {
    id: '1',
    title: 'Biology Cell Structure',
    description: 'Flashcards about cell organelles and their functions',
    cardCount: 12,
    lastStudied: new Date('2023-05-15'),
  },
  {
    id: '2',
    title: 'Chemistry Elements',
    description: 'Common elements and their properties',
    cardCount: 20,
    lastStudied: new Date('2023-05-10'),
  },
  {
    id: '3',
    title: 'Physics Forces',
    description: 'Different types of forces and their applications',
    cardCount: 15,
    lastStudied: new Date('2023-05-05'),
  },
];

// Mock data for flashcards in a deck
const mockCards = [
  {
    id: '1',
    front: 'What is the function of the nucleus?',
    back: 'The nucleus controls and regulates cell activities and contains genetic material (DNA).',
  },
  {
    id: '2',
    front: 'What is the function of mitochondria?',
    back: 'Mitochondria are the powerhouse of the cell, producing energy through cellular respiration.',
  },
  {
    id: '3',
    front: 'What is the function of the cell membrane?',
    back: 'The cell membrane regulates what enters and exits the cell, providing protection and structure.',
  },
];

type FlashcardDeck = {
  id: string;
  title: string;
  description: string;
  cardCount: number;
  lastStudied: Date;
};

type Flashcard = {
  id: string;
  front: string;
  back: string;
};

export default function FlashcardsScreen() {
  const [decks, setDecks] = useState<FlashcardDeck[]>(initialDecks);
  const [modalVisible, setModalVisible] = useState(false);
  const [newDeck, setNewDeck] = useState({
    title: '',
    description: '',
  });
  const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(null);
  const [cards, setCards] = useState<Flashcard[]>(mockCards);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnimation = new Animated.Value(0);

  const flipCard = () => {
    setIsFlipped(!isFlipped);
    Animated.spring(flipAnimation, {
      toValue: isFlipped ? 0 : 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  const handleAddDeck = () => {
    if (!newDeck.title) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    const deck: FlashcardDeck = {
      id: Date.now().toString(),
      title: newDeck.title,
      description: newDeck.description,
      cardCount: 0,
      lastStudied: new Date(),
    };

    setDecks([deck, ...decks]);
    setModalVisible(false);
    setNewDeck({
      title: '',
      description: '',
    });
  };

  const handleGenerateCards = (deck: FlashcardDeck) => {
    // In a real app, this would call an API to generate flashcards
    Alert.alert(
      'Generate Flashcards',
      `Generating flashcards for "${deck.title}"...`,
      [{ text: 'OK' }]
    );
  };

  const handleStudyDeck = (deck: FlashcardDeck) => {
    setSelectedDeck(deck);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    flipAnimation.setValue(0);
  };

  const handleNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
      flipAnimation.setValue(0);
    } else {
      Alert.alert('Complete', 'You have completed all cards in this deck!');
      setSelectedDeck(null);
    }
  };

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
      flipAnimation.setValue(0);
    }
  };

  const renderDeckItem = ({ item }: { item: FlashcardDeck }) => (
    <TouchableOpacity
      style={styles.deckCard}
      onPress={() => handleStudyDeck(item)}
    >
      <View style={styles.deckHeader}>
        <Text style={styles.deckTitle}>{item.title}</Text>
        <TouchableOpacity
          style={styles.generateButton}
          onPress={() => handleGenerateCards(item)}
        >
          <MaterialIcons name="auto-awesome" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      <Text style={styles.deckDescription}>{item.description}</Text>
      <View style={styles.deckFooter}>
        <View style={styles.cardCountContainer}>
          <FontAwesome name="file-text-o" size={16} color={COLORS.primary} />
          <Text style={styles.cardCountText}>{item.cardCount} cards</Text>
        </View>
        <Text style={styles.lastStudiedText}>
          Last studied: {item.lastStudied.toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (selectedDeck) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedDeck(null)}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{selectedDeck.title}</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.cardContainer}>
          <TouchableOpacity onPress={flipCard} activeOpacity={0.9}>
            <Animated.View
              style={[styles.card, styles.cardFront, frontAnimatedStyle]}
            >
              <Text style={styles.cardText}>
                {cards[currentCardIndex].front}
              </Text>
              <Text style={styles.flipHint}>Tap to flip</Text>
            </Animated.View>
            <Animated.View
              style={[styles.card, styles.cardBack, backAnimatedStyle]}
            >
              <Text style={styles.cardText}>
                {cards[currentCardIndex].back}
              </Text>
              <Text style={styles.flipHint}>Tap to flip</Text>
            </Animated.View>
          </TouchableOpacity>
        </View>

        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentCardIndex === 0 && styles.navButtonDisabled,
            ]}
            onPress={handlePreviousCard}
            disabled={currentCardIndex === 0}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={currentCardIndex === 0 ? COLORS.textLight : COLORS.text}
            />
          </TouchableOpacity>
          <Text style={styles.cardCounter}>
            {currentCardIndex + 1} / {cards.length}
          </Text>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentCardIndex === cards.length - 1 && styles.navButtonDisabled,
            ]}
            onPress={handleNextCard}
            disabled={currentCardIndex === cards.length - 1}
          >
            <Ionicons
              name="chevron-forward"
              size={24}
              color={
                currentCardIndex === cards.length - 1
                  ? COLORS.textLight
                  : COLORS.text
              }
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Flashcards</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <FontAwesome name="plus" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={decks}
        renderItem={renderDeckItem}
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
              <Text style={styles.modalTitle}>Create New Deck</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Deck Title"
              value={newDeck.title}
              onChangeText={(text) => setNewDeck({ ...newDeck, title: text })}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              value={newDeck.description}
              onChangeText={(text) =>
                setNewDeck({ ...newDeck, description: text })
              }
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleAddDeck}
            >
              <Text style={styles.saveButtonText}>Create Deck</Text>
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
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
  listContainer: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding * 2,
  },
  deckCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    padding: SIZES.base * 2,
    marginBottom: SIZES.base * 2,
    ...SHADOWS.small,
  },
  deckHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  deckTitle: {
    fontSize: SIZES.large,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    flex: 1,
  },
  generateButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deckDescription: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginBottom: SIZES.base,
  },
  deckFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardCountText: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    marginLeft: 4,
  },
  lastStudiedText: {
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
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
  },
  card: {
    width: Dimensions.get('window').width - SIZES.padding * 4,
    height: 200,
    borderRadius: SIZES.base,
    padding: SIZES.base * 2,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    position: 'absolute',
  },
  cardFront: {
    backgroundColor: COLORS.primary,
  },
  cardBack: {
    backgroundColor: COLORS.secondary,
    transform: [{ rotateY: '180deg' }],
  },
  cardText: {
    fontSize: SIZES.large,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    textAlign: 'center',
  },
  flipHint: {
    position: 'absolute',
    bottom: SIZES.base,
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.white,
    opacity: 0.7,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding * 2,
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  cardCounter: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.text,
  },
}); 