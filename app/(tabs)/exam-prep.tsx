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
  ScrollView,
  Switch,
} from 'react-native';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';
import { router } from 'expo-router';

// Mock data for exam subjects
const initialSubjects = [
  {
    id: '1',
    title: 'Biology',
    description: 'Cell structure, genetics, and ecosystems',
    questionCount: 50,
    lastPracticed: new Date('2023-05-15'),
  },
  {
    id: '2',
    title: 'Chemistry',
    description: 'Atomic structure, chemical bonds, and reactions',
    questionCount: 45,
    lastPracticed: new Date('2023-05-10'),
  },
  {
    id: '3',
    title: 'Physics',
    description: 'Mechanics, thermodynamics, and waves',
    questionCount: 40,
    lastPracticed: new Date('2023-05-05'),
  },
];

// Mock data for practice questions
const mockQuestions = [
  {
    id: '1',
    question: 'What is the function of the cell membrane?',
    options: [
      'To protect the cell from external threats',
      'To regulate what enters and exits the cell',
      'To produce energy for the cell',
      'To store genetic material',
    ],
    correctAnswer: 1,
    explanation:
      'The cell membrane regulates what enters and exits the cell, providing protection and structure.',
  },
  {
    id: '2',
    question: 'Which organelle is known as the powerhouse of the cell?',
    options: ['Nucleus', 'Mitochondria', 'Golgi apparatus', 'Endoplasmic reticulum'],
    correctAnswer: 1,
    explanation:
      'Mitochondria are known as the powerhouse of the cell because they produce energy through cellular respiration.',
  },
  {
    id: '3',
    question: 'What is the function of the nucleus?',
    options: [
      'To produce proteins',
      'To control and regulate cell activities',
      'To transport materials within the cell',
      'To break down waste materials',
    ],
    correctAnswer: 1,
    explanation:
      'The nucleus controls and regulates cell activities and contains genetic material (DNA).',
  },
];

type Subject = {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  lastPracticed: Date;
};

type Question = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

export default function ExamPrepScreen() {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [modalVisible, setModalVisible] = useState(false);
  const [newSubject, setNewSubject] = useState({
    title: '',
    description: '',
  });
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState(10);

  const handleAddSubject = () => {
    if (!newSubject.title) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    const subject: Subject = {
      id: Date.now().toString(),
      title: newSubject.title,
      description: newSubject.description,
      questionCount: 0,
      lastPracticed: new Date(),
    };

    setSubjects([subject, ...subjects]);
    setModalVisible(false);
    setNewSubject({
      title: '',
      description: '',
    });
  };

  const handleGenerateQuestions = (subject: Subject) => {
    // In a real app, this would call an API to generate questions
    Alert.alert(
      'Generate Questions',
      `Generating ${questionCount} ${difficulty} difficulty questions for "${subject.title}"...`,
      [{ text: 'OK' }]
    );
  };

  const handleStartPractice = (subject: Subject) => {
    setSelectedSubject(subject);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      Alert.alert('Complete', 'You have completed all questions!');
      setSelectedSubject(null);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const renderSubjectItem = ({ item }: { item: Subject }) => (
    <View style={styles.subjectCard}>
      <View style={styles.subjectHeader}>
        <Text style={styles.subjectTitle}>{item.title}</Text>
        <TouchableOpacity
          style={styles.generateButton}
          onPress={() => handleGenerateQuestions(item)}
        >
          <MaterialIcons name="auto-awesome" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      <Text style={styles.subjectDescription}>{item.description}</Text>
      <View style={styles.subjectFooter}>
        <View style={styles.questionCountContainer}>
          <FontAwesome name="question-circle" size={16} color={COLORS.primary} />
          <Text style={styles.questionCountText}>
            {item.questionCount} questions
          </Text>
        </View>
        <Text style={styles.lastPracticedText}>
          Last practiced: {item.lastPracticed.toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.practiceButton}
        onPress={() => handleStartPractice(item)}
      >
        <Text style={styles.practiceButtonText}>Start Practice</Text>
      </TouchableOpacity>
    </View>
  );

  if (selectedSubject) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedSubject(null)}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{selectedSubject.title}</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            {questions[currentQuestionIndex].question}
          </Text>

          <View style={styles.optionsContainer}>
            {questions[currentQuestionIndex].options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswer === index && styles.selectedOption,
                  selectedAnswer !== null &&
                    index === questions[currentQuestionIndex].correctAnswer &&
                    styles.correctOption,
                ]}
                onPress={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedAnswer === index && styles.selectedOptionText,
                    selectedAnswer !== null &&
                      index === questions[currentQuestionIndex].correctAnswer &&
                      styles.correctOptionText,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {showExplanation && (
            <View style={styles.explanationContainer}>
              <Text style={styles.explanationTitle}>Explanation:</Text>
              <Text style={styles.explanationText}>
                {questions[currentQuestionIndex].explanation}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentQuestionIndex === 0 && styles.navButtonDisabled,
            ]}
            onPress={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={currentQuestionIndex === 0 ? COLORS.textLight : COLORS.text}
            />
          </TouchableOpacity>
          <Text style={styles.questionCounter}>
            {currentQuestionIndex + 1} / {questions.length}
          </Text>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentQuestionIndex === questions.length - 1 &&
                styles.navButtonDisabled,
            ]}
            onPress={handleNextQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            <Ionicons
              name="chevron-forward"
              size={24}
              color={
                currentQuestionIndex === questions.length - 1
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
        <Text style={styles.headerTitle}>Exam Preparation</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <FontAwesome name="plus" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.settingsContainer}>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Practice Mode</Text>
          <Switch
            value={practiceMode}
            onValueChange={setPracticeMode}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={COLORS.white}
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Difficulty</Text>
          <View style={styles.difficultyButtons}>
            <TouchableOpacity
              style={[
                styles.difficultyButton,
                difficulty === 'easy' && styles.selectedDifficulty,
              ]}
              onPress={() => setDifficulty('easy')}
            >
              <Text
                style={[
                  styles.difficultyText,
                  difficulty === 'easy' && styles.selectedDifficultyText,
                ]}
              >
                Easy
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.difficultyButton,
                difficulty === 'medium' && styles.selectedDifficulty,
              ]}
              onPress={() => setDifficulty('medium')}
            >
              <Text
                style={[
                  styles.difficultyText,
                  difficulty === 'medium' && styles.selectedDifficultyText,
                ]}
              >
                Medium
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.difficultyButton,
                difficulty === 'hard' && styles.selectedDifficulty,
              ]}
              onPress={() => setDifficulty('hard')}
            >
              <Text
                style={[
                  styles.difficultyText,
                  difficulty === 'hard' && styles.selectedDifficultyText,
                ]}
              >
                Hard
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Question Count</Text>
          <View style={styles.questionCountButtons}>
            <TouchableOpacity
              style={[
                styles.questionCountButton,
                questionCount === 5 && styles.selectedQuestionCount,
              ]}
              onPress={() => setQuestionCount(5)}
            >
              <Text
                style={[
                  styles.questionCountButtonText,
                  questionCount === 5 && styles.selectedQuestionCountText,
                ]}
              >
                5
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.questionCountButton,
                questionCount === 10 && styles.selectedQuestionCount,
              ]}
              onPress={() => setQuestionCount(10)}
            >
              <Text
                style={[
                  styles.questionCountButtonText,
                  questionCount === 10 && styles.selectedQuestionCountText,
                ]}
              >
                10
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.questionCountButton,
                questionCount === 20 && styles.selectedQuestionCount,
              ]}
              onPress={() => setQuestionCount(20)}
            >
              <Text
                style={[
                  styles.questionCountButtonText,
                  questionCount === 20 && styles.selectedQuestionCountText,
                ]}
              >
                20
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FlatList
        data={subjects}
        renderItem={renderSubjectItem}
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
              <Text style={styles.modalTitle}>Add New Subject</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Subject Title"
              value={newSubject.title}
              onChangeText={(text) => setNewSubject({ ...newSubject, title: text })}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              value={newSubject.description}
              onChangeText={(text) =>
                setNewSubject({ ...newSubject, description: text })
              }
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleAddSubject}
            >
              <Text style={styles.saveButtonText}>Add Subject</Text>
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
  settingsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
    padding: SIZES.base * 2,
    ...SHADOWS.small,
  },
  settingItem: {
    marginBottom: SIZES.base * 2,
  },
  settingLabel: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  difficultyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyButton: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: SIZES.base,
    padding: SIZES.base,
    marginHorizontal: SIZES.base / 2,
    alignItems: 'center',
  },
  selectedDifficulty: {
    backgroundColor: COLORS.primary,
  },
  difficultyText: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    color: COLORS.text,
  },
  selectedDifficultyText: {
    color: COLORS.white,
  },
  questionCountButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  questionCountButton: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: SIZES.base,
    padding: SIZES.base,
    marginHorizontal: SIZES.base / 2,
    alignItems: 'center',
  },
  selectedQuestionCount: {
    backgroundColor: COLORS.primary,
  },
  questionCountButtonText: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    color: COLORS.text,
  },
  selectedQuestionCountText: {
    color: COLORS.white,
  },
  listContainer: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding * 2,
  },
  subjectCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    padding: SIZES.base * 2,
    marginBottom: SIZES.base * 2,
    ...SHADOWS.small,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  subjectTitle: {
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
  subjectDescription: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginBottom: SIZES.base,
  },
  subjectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  questionCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questionCountText: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    marginLeft: 4,
  },
  lastPracticedText: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
  practiceButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.base,
    padding: SIZES.base,
    alignItems: 'center',
  },
  practiceButtonText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.bold,
    color: COLORS.white,
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
  questionContainer: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding,
  },
  questionText: {
    fontSize: SIZES.large,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SIZES.base * 2,
  },
  optionsContainer: {
    marginBottom: SIZES.base * 2,
  },
  optionButton: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    padding: SIZES.base * 2,
    marginBottom: SIZES.base,
    ...SHADOWS.small,
  },
  selectedOption: {
    backgroundColor: COLORS.error,
  },
  correctOption: {
    backgroundColor: COLORS.success,
  },
  optionText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.text,
  },
  selectedOptionText: {
    color: COLORS.white,
  },
  correctOptionText: {
    color: COLORS.white,
  },
  explanationContainer: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.base,
    padding: SIZES.base * 2,
    marginTop: SIZES.base,
  },
  explanationTitle: {
    fontSize: SIZES.font,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  explanationText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
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
  questionCounter: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.text,
  },
}); 