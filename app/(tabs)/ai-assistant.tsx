import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';

const messages = [
  {
    id: '1',
    text: 'Hello! I'm your AI study assistant. How can I help you today?',
    isAI: true,
  },
];

export default function AIAssistantScreen() {
  const [input, setInput] = useState('');
  const [chatMessages, setChatMessages] = useState(messages);

  const handleSend = () => {
    if (input.trim() === '') return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: input,
      isAI: false,
    };

    // Add AI response (mock for now)
    const aiResponse = {
      id: (Date.now() + 1).toString(),
      text: 'I'm processing your question. This is a mock response for now.',
      isAI: true,
    };

    setChatMessages([...chatMessages, userMessage, aiResponse]);
    setInput('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>AI Study Assistant</Text>
        <Text style={styles.subtitle}>Ask me anything about your studies</Text>
      </View>

      <ScrollView
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
      >
        {chatMessages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.isAI ? styles.aiMessage : styles.userMessage,
            ]}
          >
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your question..."
          value={input}
          onChangeText={setInput}
          multiline
          placeholderTextColor={COLORS.textLight}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <FontAwesome name="send" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  chatContainer: {
    flex: 1,
    padding: SIZES.base * 2,
  },
  chatContent: {
    paddingBottom: SIZES.base * 2,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: SIZES.base * 2,
    borderRadius: SIZES.base,
    marginBottom: SIZES.base * 2,
  },
  aiMessage: {
    backgroundColor: COLORS.lightGray,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  userMessage: {
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  messageText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: SIZES.base * 2,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.base,
    padding: SIZES.base * 2,
    marginRight: SIZES.base,
    fontFamily: FONTS.regular,
    fontSize: SIZES.font,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
}); 