import React, { useState, useRef, useEffect } from 'react';
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
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  ActionSheetIOS,
  ActionSheetAndroid,
  Linking,
  Share,
} from 'react-native';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';
import { router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { format } from 'date-fns';

// Mock data for study groups
const initialGroups = [
  {
    id: '1',
    name: 'Biology Study Group',
    subject: 'Biology',
    memberCount: 5,
    lastActive: new Date('2023-05-15'),
    members: [
      { id: '1', name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      { id: '2', name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
      { id: '3', name: 'Mike Johnson', avatar: 'https://randomuser.me/api/portraits/men/67.jpg' },
      { id: '4', name: 'Sarah Williams', avatar: 'https://randomuser.me/api/portraits/women/22.jpg' },
      { id: '5', name: 'David Brown', avatar: 'https://randomuser.me/api/portraits/men/89.jpg' },
    ],
  },
  {
    id: '2',
    name: 'Chemistry Lab Partners',
    subject: 'Chemistry',
    memberCount: 3,
    lastActive: new Date('2023-05-10'),
    members: [
      { id: '1', name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      { id: '2', name: 'Emily Davis', avatar: 'https://randomuser.me/api/portraits/women/33.jpg' },
      { id: '3', name: 'Robert Wilson', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
    ],
  },
  {
    id: '3',
    name: 'Physics Problem Solvers',
    subject: 'Physics',
    memberCount: 4,
    lastActive: new Date('2023-05-05'),
    members: [
      { id: '1', name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      { id: '2', name: 'Lisa Anderson', avatar: 'https://randomuser.me/api/portraits/women/55.jpg' },
      { id: '3', name: 'Tom Martinez', avatar: 'https://randomuser.me/api/portraits/men/78.jpg' },
      { id: '4', name: 'Rachel Taylor', avatar: 'https://randomuser.me/api/portraits/women/66.jpg' },
    ],
  },
];

// Mock data for chat messages
const mockMessages = [
  {
    id: '1',
    text: 'Hey everyone! Ready for our study session?',
    sender: { id: '1', name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    timestamp: new Date('2023-05-15T10:00:00'),
  },
  {
    id: '2',
    text: 'Yes, I\'m ready! What topic are we covering today?',
    sender: { id: '2', name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    timestamp: new Date('2023-05-15T10:05:00'),
  },
  {
    id: '3',
    text: 'I think we should focus on cell structure and function.',
    sender: { id: '1', name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    timestamp: new Date('2023-05-15T10:10:00'),
  },
  {
    id: '4',
    text: 'That sounds good. I have some notes I can share.',
    sender: { id: '3', name: 'Mike Johnson', avatar: 'https://randomuser.me/api/portraits/men/67.jpg' },
    timestamp: new Date('2023-05-15T10:15:00'),
  },
  {
    id: '5',
    text: 'Great! I\'ll create a shared document for our notes.',
    sender: { id: '4', name: 'Sarah Williams', avatar: 'https://randomuser.me/api/portraits/women/22.jpg' },
    timestamp: new Date('2023-05-15T10:20:00'),
  },
];

// Mock data for study sessions
const mockStudySessions = [
  {
    id: '1',
    title: 'Cell Structure Review',
    date: new Date('2023-05-20T15:00:00'),
    duration: 60, // in minutes
    participants: ['1', '2', '3'],
    description: 'Review of cell organelles and their functions',
  },
  {
    id: '2',
    title: 'Photosynthesis Quiz',
    date: new Date('2023-05-22T18:00:00'),
    duration: 45,
    participants: ['1', '2', '4', '5'],
    description: 'Practice quiz on photosynthesis process',
  },
];

type Member = {
  id: string;
  name: string;
  avatar: string;
};

type StudyGroup = {
  id: string;
  name: string;
  subject: string;
  memberCount: number;
  lastActive: Date;
  members: Member[];
};

type Message = {
  id: string;
  text: string;
  sender: Member;
  timestamp: Date;
  attachment?: {
    name: string;
    type: string;
    uri: string;
  };
};

type StudySession = {
  id: string;
  title: string;
  date: Date;
  duration: number;
  participants: string[];
  description: string;
};

export default function GroupStudyScreen() {
  const [groups, setGroups] = useState<StudyGroup[]>(initialGroups);
  const [modalVisible, setModalVisible] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    subject: '',
  });
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [flatListRef, setFlatListRef] = useState<FlatList | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [studySessions, setStudySessions] = useState<StudySession[]>(mockStudySessions);
  const [sessionModalVisible, setSessionModalVisible] = useState(false);
  const [newSession, setNewSession] = useState({
    title: '',
    date: new Date(),
    duration: 60,
    description: '',
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [durationOptions] = useState([30, 45, 60, 90, 120]);
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    if (selectedGroup) {
      const interval = setInterval(() => {
        // Simulate new messages from other users
        if (Math.random() > 0.7) {
          const randomMember = selectedGroup.members.find(m => m.id !== '1');
          if (randomMember) {
            const newMessage: Message = {
              id: Date.now().toString(),
              text: `Random message at ${new Date().toLocaleTimeString()}`,
              sender: randomMember,
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, newMessage]);
          }
        }
      }, 10000); // Check every 10 seconds

      return () => clearInterval(interval);
    }
  }, [selectedGroup]);

  const handleAddGroup = () => {
    if (!newGroup.name || !newGroup.subject) {
      Alert.alert('Error', 'Name and subject are required');
      return;
    }

    const group: StudyGroup = {
      id: Date.now().toString(),
      name: newGroup.name,
      subject: newGroup.subject,
      memberCount: 1,
      lastActive: new Date(),
      members: [
        { id: '1', name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      ],
    };

    setGroups([group, ...groups]);
    setModalVisible(false);
    setNewGroup({
      name: '',
      subject: '',
    });
  };

  const handleJoinGroup = (group: StudyGroup) => {
    setSelectedGroup(group);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: { id: '1', name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
    
    // Scroll to bottom
    setTimeout(() => {
      flatListRef?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleAttachFile = async () => {
    try {
      setIsUploading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        // In a real app, you would upload the file to a server
        // For now, we'll just simulate the upload
        setTimeout(() => {
          const message: Message = {
            id: Date.now().toString(),
            text: `Shared file: ${result.name}`,
            sender: { id: '1', name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
            timestamp: new Date(),
            attachment: {
              name: result.name,
              type: result.mimeType || 'application/octet-stream',
              uri: result.uri,
            },
          };
          setMessages([...messages, message]);
          setIsUploading(false);
          
          // Scroll to bottom
          setTimeout(() => {
            flatListRef?.scrollToEnd({ animated: true });
          }, 100);
        }, 1000);
      } else {
        setIsUploading(false);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      setIsUploading(false);
      Alert.alert('Error', 'Failed to attach file');
    }
  };

  const handleOpenAttachment = async (attachment: Message['attachment']) => {
    if (!attachment) return;
    
    try {
      const supported = await Linking.canOpenURL(attachment.uri);
      if (supported) {
        await Linking.openURL(attachment.uri);
      } else {
        Alert.alert('Error', 'Cannot open this file type');
      }
    } catch (error) {
      console.error('Error opening attachment:', error);
      Alert.alert('Error', 'Failed to open attachment');
    }
  };

  const handleShareAttachment = async (attachment: Message['attachment']) => {
    if (!attachment) return;
    
    try {
      await Share.share({
        url: attachment.uri,
        title: attachment.name,
      });
    } catch (error) {
      console.error('Error sharing attachment:', error);
      Alert.alert('Error', 'Failed to share attachment');
    }
  };

  const handleShowMenu = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Invite Members', 'Schedule Study Session', 'Leave Group', 'Cancel'],
          destructiveButtonIndex: 2,
          cancelButtonIndex: 3,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            setInviteModalVisible(true);
          } else if (buttonIndex === 1) {
            setSessionModalVisible(true);
          } else if (buttonIndex === 2) {
            handleLeaveGroup();
          }
        }
      );
    } else {
      ActionSheetAndroid.show(
        (buttonIndex) => {
          if (buttonIndex === 0) {
            setInviteModalVisible(true);
          } else if (buttonIndex === 1) {
            setSessionModalVisible(true);
          } else if (buttonIndex === 2) {
            handleLeaveGroup();
          }
        },
        {
          title: 'Group Options',
          options: ['Invite Members', 'Schedule Study Session', 'Leave Group', 'Cancel'],
          cancelButtonIndex: 3,
        }
      );
    }
  };

  const handleLeaveGroup = () => {
    Alert.alert(
      'Leave Group',
      'Are you sure you want to leave this group?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Leave', 
          style: 'destructive',
          onPress: () => {
            setSelectedGroup(null);
            Alert.alert('Success', 'You have left the group');
          }
        },
      ]
    );
  };

  const handleInviteMember = () => {
    if (!inviteEmail.trim()) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }

    // In a real app, this would send an invitation email
    Alert.alert(
      'Invitation Sent',
      `Invitation sent to ${inviteEmail}`,
      [{ text: 'OK' }]
    );
    setInviteModalVisible(false);
    setInviteEmail('');
  };

  const handleCreateSession = () => {
    if (!newSession.title.trim()) {
      Alert.alert('Error', 'Please enter a session title');
      return;
    }

    const session: StudySession = {
      id: Date.now().toString(),
      title: newSession.title,
      date: new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes()
      ),
      duration: selectedDuration,
      participants: ['1', ...selectedGroup?.members.slice(0, 2).map(m => m.id) || []],
      description: newSession.description,
    };

    setStudySessions([session, ...studySessions]);
    setSessionModalVisible(false);
    setNewSession({
      title: '',
      date: new Date(),
      duration: 60,
      description: '',
    });
    setSelectedDuration(60);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return format(date, 'MMM dd, yyyy');
  };

  const renderGroupItem = ({ item }: { item: StudyGroup }) => (
    <TouchableOpacity
      style={styles.groupCard}
      onPress={() => handleJoinGroup(item)}
    >
      <View style={styles.groupHeader}>
        <Text style={styles.groupName}>{item.name}</Text>
        <View style={styles.subjectContainer}>
          <FontAwesome name="book" size={16} color={COLORS.primary} />
          <Text style={styles.subjectText}>{item.subject}</Text>
        </View>
      </View>
      <View style={styles.groupFooter}>
        <View style={styles.memberContainer}>
          <View style={styles.avatarContainer}>
            {item.members.slice(0, 3).map((member, index) => (
              <Image
                key={member.id}
                source={{ uri: member.avatar }}
                style={[
                  styles.memberAvatar,
                  { marginLeft: index > 0 ? -10 : 0 },
                ]}
              />
            ))}
            {item.memberCount > 3 && (
              <View style={[styles.memberAvatar, styles.extraMembers]}>
                <Text style={styles.extraMembersText}>+{item.memberCount - 3}</Text>
              </View>
            )}
          </View>
          <Text style={styles.memberCountText}>{item.memberCount} members</Text>
        </View>
        <Text style={styles.lastActiveText}>
          Last active: {item.lastActive.toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderMessageItem = ({ item }: { item: Message }) => {
    const isCurrentUser = item.sender.id === '1';

    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
        ]}
      >
        {!isCurrentUser && (
          <Image source={{ uri: item.sender.avatar }} style={styles.messageAvatar} />
        )}
        <View
          style={[
            styles.messageBubble,
            isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
          ]}
        >
          {!isCurrentUser && (
            <Text style={styles.messageSender}>{item.sender.name}</Text>
          )}
          <Text
            style={[
              styles.messageText,
              isCurrentUser ? styles.currentUserMessageText : styles.otherUserMessageText,
            ]}
          >
            {item.text}
          </Text>
          {item.attachment && (
            <TouchableOpacity
              style={styles.attachmentContainer}
              onPress={() => handleOpenAttachment(item.attachment)}
              onLongPress={() => handleShareAttachment(item.attachment)}
            >
              <FontAwesome name="file" size={16} color={isCurrentUser ? COLORS.white : COLORS.primary} />
              <Text
                style={[
                  styles.attachmentText,
                  isCurrentUser ? styles.currentUserAttachmentText : styles.otherUserAttachmentText,
                ]}
                numberOfLines={1}
              >
                {item.attachment.name}
              </Text>
            </TouchableOpacity>
          )}
          <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
        </View>
      </View>
    );
  };

  const renderSessionItem = ({ item }: { item: StudySession }) => (
    <View style={styles.sessionCard}>
      <View style={styles.sessionHeader}>
        <Text style={styles.sessionTitle}>{item.title}</Text>
        <View style={styles.sessionDateTime}>
          <FontAwesome name="calendar" size={14} color={COLORS.primary} />
          <Text style={styles.sessionDateText}>{formatDate(item.date)}</Text>
          <FontAwesome name="clock-o" size={14} color={COLORS.primary} style={{ marginLeft: 8 }} />
          <Text style={styles.sessionTimeText}>
            {formatTime(item.date)} ({item.duration} min)
          </Text>
        </View>
      </View>
      <Text style={styles.sessionDescription}>{item.description}</Text>
      <View style={styles.sessionFooter}>
        <View style={styles.participantsContainer}>
          {item.participants.slice(0, 3).map((participantId, index) => {
            const participant = selectedGroup?.members.find(m => m.id === participantId);
            if (!participant) return null;
            
            return (
              <Image
                key={participantId}
                source={{ uri: participant.avatar }}
                style={[
                  styles.participantAvatar,
                  { marginLeft: index > 0 ? -10 : 0 },
                ]}
              />
            );
          })}
          {item.participants.length > 3 && (
            <View style={[styles.participantAvatar, styles.extraParticipants]}>
              <Text style={styles.extraParticipantsText}>+{item.participants.length - 3}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (selectedGroup) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedGroup(null)}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <View style={styles.groupInfo}>
            <Text style={styles.headerTitle}>{selectedGroup.name}</Text>
            <Text style={styles.headerSubtitle}>{selectedGroup.subject}</Text>
          </View>
          <TouchableOpacity style={styles.menuButton} onPress={handleShowMenu}>
            <Ionicons name="ellipsis-vertical" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.membersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {selectedGroup.members.map((member) => (
              <View key={member.id} style={styles.memberItem}>
                <Image source={{ uri: member.avatar }} style={styles.memberImage} />
                <Text style={styles.memberName}>{member.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={[styles.tabText, styles.activeTabText]}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Study Sessions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Resources</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          ref={(ref) => setFlatListRef(ref)}
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View style={styles.inputContainer}>
            <TouchableOpacity 
              style={styles.attachButton}
              onPress={() => setShowAttachmentOptions(true)}
              disabled={isUploading}
            >
              {isUploading ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <FontAwesome name="paperclip" size={20} color={COLORS.primary} />
              )}
            </TouchableOpacity>
            <TextInput
              style={styles.messageInput}
              placeholder="Type a message..."
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <Ionicons
                name="send"
                size={20}
                color={newMessage.trim() ? COLORS.primary : COLORS.textLight}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        {/* Invite Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={inviteModalVisible}
          onRequestClose={() => setInviteModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Invite Members</Text>
                <TouchableOpacity
                  onPress={() => setInviteModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color={COLORS.text} />
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Email Address"
                value={inviteEmail}
                onChangeText={setInviteEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleInviteMember}
              >
                <Text style={styles.saveButtonText}>Send Invitation</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Study Session Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={sessionModalVisible}
          onRequestClose={() => setSessionModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Schedule Study Session</Text>
                <TouchableOpacity
                  onPress={() => setSessionModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color={COLORS.text} />
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Session Title"
                value={newSession.title}
                onChangeText={(text) => setNewSession({ ...newSession, title: text })}
              />

              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowDatePicker(true)}
              >
                <FontAwesome name="calendar" size={16} color={COLORS.primary} />
                <Text style={styles.dateTimeButtonText}>
                  {formatDate(selectedDate)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <FontAwesome name="clock-o" size={16} color={COLORS.primary} />
                <Text style={styles.dateTimeButtonText}>
                  {formatTime(selectedTime)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowDurationPicker(true)}
              >
                <FontAwesome name="hourglass-half" size={16} color={COLORS.primary} />
                <Text style={styles.dateTimeButtonText}>
                  Duration: {selectedDuration} minutes
                </Text>
              </TouchableOpacity>

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Session Description"
                value={newSession.description}
                onChangeText={(text) => setNewSession({ ...newSession, description: text })}
                multiline
                numberOfLines={4}
              />

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleCreateSession}
              >
                <Text style={styles.saveButtonText}>Schedule Session</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Attachment Options Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showAttachmentOptions}
          onRequestClose={() => setShowAttachmentOptions(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Attach File</Text>
                <TouchableOpacity
                  onPress={() => setShowAttachmentOptions(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color={COLORS.text} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.attachmentOption}
                onPress={() => {
                  setShowAttachmentOptions(false);
                  handleAttachFile();
                }}
              >
                <FontAwesome name="file" size={20} color={COLORS.primary} />
                <Text style={styles.attachmentOptionText}>Document</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.attachmentOption}
                onPress={() => {
                  setShowAttachmentOptions(false);
                  // Handle image attachment
                  Alert.alert('Coming Soon', 'Image attachment will be available soon');
                }}
              >
                <FontAwesome name="image" size={20} color={COLORS.primary} />
                <Text style={styles.attachmentOptionText}>Image</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.attachmentOption}
                onPress={() => {
                  setShowAttachmentOptions(false);
                  // Handle camera
                  Alert.alert('Coming Soon', 'Camera capture will be available soon');
                }}
              >
                <FontAwesome name="camera" size={20} color={COLORS.primary} />
                <Text style={styles.attachmentOptionText}>Camera</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Study Groups</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <FontAwesome name="plus" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={groups}
        renderItem={renderGroupItem}
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
              <Text style={styles.modalTitle}>Create New Group</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Group Name"
              value={newGroup.name}
              onChangeText={(text) => setNewGroup({ ...newGroup, name: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Subject"
              value={newGroup.subject}
              onChangeText={(text) => setNewGroup({ ...newGroup, subject: text })}
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleAddGroup}
            >
              <Text style={styles.saveButtonText}>Create Group</Text>
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
  headerSubtitle: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupInfo: {
    flex: 1,
    marginLeft: SIZES.base,
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
  groupCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    padding: SIZES.base * 2,
    marginBottom: SIZES.base * 2,
    ...SHADOWS.small,
  },
  groupHeader: {
    marginBottom: SIZES.base,
  },
  groupName: {
    fontSize: SIZES.large,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 4,
  },
  subjectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subjectText: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    marginLeft: 4,
  },
  groupFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    flexDirection: 'row',
    marginRight: SIZES.base,
  },
  memberAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  extraMembers: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  extraMembersText: {
    fontSize: SIZES.small,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  memberCountText: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    color: COLORS.text,
  },
  lastActiveText: {
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
  membersContainer: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  memberItem: {
    alignItems: 'center',
    marginRight: SIZES.base * 2,
  },
  memberImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 4,
  },
  memberName: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    color: COLORS.text,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: SIZES.base,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.textLight,
  },
  activeTabText: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
  },
  messagesContainer: {
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding,
    paddingBottom: SIZES.base,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: SIZES.base * 2,
  },
  currentUserMessage: {
    justifyContent: 'flex-end',
  },
  otherUserMessage: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: SIZES.base,
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: SIZES.base,
    padding: SIZES.base * 1.5,
  },
  currentUserBubble: {
    backgroundColor: COLORS.primary,
    borderTopRightRadius: 0,
  },
  otherUserBubble: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 0,
    ...SHADOWS.small,
  },
  messageSender: {
    fontSize: SIZES.small,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    marginBottom: 2,
  },
  messageText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
  },
  currentUserMessageText: {
    color: COLORS.white,
  },
  otherUserMessageText: {
    color: COLORS.text,
  },
  messageTime: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  attachmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: SIZES.base / 2,
    padding: SIZES.base,
    marginTop: SIZES.base,
  },
  attachmentText: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    marginLeft: SIZES.base,
    flex: 1,
  },
  currentUserAttachmentText: {
    color: COLORS.white,
  },
  otherUserAttachmentText: {
    color: COLORS.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.base,
  },
  messageInput: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: SIZES.base,
    paddingHorizontal: SIZES.base * 2,
    paddingVertical: SIZES.base,
    maxHeight: 100,
    fontFamily: FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.text,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SIZES.base,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: SIZES.base,
    padding: SIZES.base * 2,
    marginBottom: SIZES.base * 2,
  },
  dateTimeButtonText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginLeft: SIZES.base,
  },
  attachmentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.base * 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  attachmentOptionText: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginLeft: SIZES.base,
  },
  sessionCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    padding: SIZES.base * 2,
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.base * 2,
    ...SHADOWS.small,
  },
  sessionHeader: {
    marginBottom: SIZES.base,
  },
  sessionTitle: {
    fontSize: SIZES.large,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 4,
  },
  sessionDateTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionDateText: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    marginLeft: 4,
  },
  sessionTimeText: {
    fontSize: SIZES.small,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    marginLeft: 4,
  },
  sessionDescription: {
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginBottom: SIZES.base,
  },
  sessionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantsContainer: {
    flexDirection: 'row',
  },
  participantAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  extraParticipants: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  extraParticipantsText: {
    fontSize: SIZES.small,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  joinButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.base,
    paddingHorizontal: SIZES.base * 2,
    paddingVertical: SIZES.base,
  },
  joinButtonText: {
    fontSize: SIZES.small,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
}); 