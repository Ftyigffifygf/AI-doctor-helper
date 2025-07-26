import Icon from '../components/Icon';
import { commonStyles, colors } from '../styles/commonStyles';
import Button from '../components/Button';
import { openaiService } from '../services/openaiService';
import { router } from 'expo-router';
import { Text, View, ScrollView, SafeAreaView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { StyleSheet } from 'react-native';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'analysis' | 'recommendation';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.white,
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.9,
  },
  enhancementBanner: {
    backgroundColor: colors.success,
    borderRadius: 12,
    padding: 12,
    margin: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  enhancementText: {
    flex: 1,
    marginLeft: 10,
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  chatContainer: {
    flex: 1,
    padding: 20,
  },
  messagesList: {
    flex: 1,
    marginBottom: 20,
  },
  messageContainer: {
    marginBottom: 15,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  aiMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 15,
    borderRadius: 18,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 5,
  },
  aiBubble: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: colors.white,
  },
  aiText: {
    color: colors.text,
  },
  messageTime: {
    fontSize: 12,
    marginTop: 5,
    opacity: 0.7,
  },
  userTime: {
    color: colors.white,
    textAlign: 'right',
  },
  aiTime: {
    color: colors.textSecondary,
  },
  enhancementFooter: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 8,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.white,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  welcomeCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 15,
  },
  capabilitiesList: {
    marginTop: 10,
  },
  capabilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  capabilityText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 10,
    flex: 1,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 15,
  },
  quickActionButton: {
    backgroundColor: colors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quickActionText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
});

export default function AgentScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Add welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      text: 'Hello! I\'m your AI medical assistant, enhanced with comprehensive medical training data. I can help you with symptom analysis, medical imaging interpretation, lab results, genomic risk assessment, and more. How can I assist you today?',
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      console.log('Sending message to enhanced AI agent...');
      const response = await openaiService.generateMedicalResponse(
        userMessage.text,
        'Doctor Agent Hub - Enhanced with medical training datasets'
      );

      const aiMessage: Message = {
        id: `ai_${Date.now()}`,
        text: response,
        isUser: false,
        timestamp: new Date(),
        type: 'analysis'
      };

      setMessages(prev => [...prev, aiMessage]);
      console.log('AI response received');
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        text: 'I apologize, but I encountered an error while processing your request. Please try again.',
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    setInputText(action);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageStyle = () => {
    return {
      userContainer: [styles.messageContainer, styles.userMessage],
      aiContainer: [styles.messageContainer, styles.aiMessage],
      userBubble: [styles.messageBubble, styles.userBubble],
      aiBubble: [styles.messageBubble, styles.aiBubble],
      userText: [styles.messageText, styles.userText],
      aiText: [styles.messageText, styles.aiText],
      userTime: [styles.messageTime, styles.userTime],
      aiTime: [styles.messageTime, styles.aiTime],
    };
  };

  const messageStyles = getMessageStyle();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🤖 Doctor Agent Hub</Text>
        <Text style={styles.headerSubtitle}>Multimodal AI Medical Assistant</Text>
      </View>

      {/* Enhancement Banner */}
      <View style={styles.enhancementBanner}>
        <Icon name="checkmark-circle" size={20} style={{ color: colors.white }} />
        <Text style={styles.enhancementText}>
          Enhanced with 5 medical datasets: MIMIC-III, NIH, PhysioNet, TCGA, ISIC
        </Text>
      </View>

      <View style={styles.chatContainer}>
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesList}
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome Card */}
          {messages.length === 1 && (
            <View style={styles.welcomeCard}>
              <Text style={styles.welcomeTitle}>🧠 Enhanced AI Medical Assistant</Text>
              <Text style={styles.welcomeText}>
                I'm trained on comprehensive medical datasets and can assist with:
              </Text>
              <View style={styles.capabilitiesList}>
                <View style={styles.capabilityItem}>
                  <Icon name="medical" size={16} style={{ color: colors.primary }} />
                  <Text style={styles.capabilityText}>Symptom analysis using 58K+ clinical cases</Text>
                </View>
                <View style={styles.capabilityItem}>
                  <Icon name="scan" size={16} style={{ color: colors.primary }} />
                  <Text style={styles.capabilityText}>Medical imaging interpretation (145K+ images)</Text>
                </View>
                <View style={styles.capabilityItem}>
                  <Icon name="flask" size={16} style={{ color: colors.primary }} />
                  <Text style={styles.capabilityText}>Laboratory result analysis</Text>
                </View>
                <View style={styles.capabilityItem}>
                  <Icon name="analytics" size={16} style={{ color: colors.primary }} />
                  <Text style={styles.capabilityText}>Genomic risk assessment (33K+ genomes)</Text>
                </View>
                <View style={styles.capabilityItem}>
                  <Icon name="heart" size={16} style={{ color: colors.primary }} />
                  <Text style={styles.capabilityText}>Cardiac rhythm analysis (43K+ ECGs)</Text>
                </View>
              </View>
              <View style={styles.quickActions}>
                <TouchableOpacity 
                  style={styles.quickActionButton}
                  onPress={() => handleQuickAction('Analyze these symptoms: headache, fever, fatigue')}
                >
                  <Text style={styles.quickActionText}>Symptom Analysis</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.quickActionButton}
                  onPress={() => handleQuickAction('Interpret this chest X-ray finding')}
                >
                  <Text style={styles.quickActionText}>Image Analysis</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.quickActionButton}
                  onPress={() => handleQuickAction('Explain these lab results')}
                >
                  <Text style={styles.quickActionText}>Lab Results</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.quickActionButton}
                  onPress={() => handleQuickAction('What are the latest treatment guidelines for diabetes?')}
                >
                  <Text style={styles.quickActionText}>Treatment Guidelines</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Messages */}
          {messages.map((message) => (
            <View 
              key={message.id} 
              style={message.isUser ? messageStyles.userContainer : messageStyles.aiContainer}
            >
              <View style={message.isUser ? messageStyles.userBubble : messageStyles.aiBubble}>
                <Text style={message.isUser ? messageStyles.userText : messageStyles.aiText}>
                  {message.text}
                </Text>
                <Text style={message.isUser ? messageStyles.userTime : messageStyles.aiTime}>
                  {formatTime(message.timestamp)}
                </Text>
                {!message.isUser && message.text.includes('enhanced with medical') && (
                  <Text style={styles.enhancementFooter}>
                    📊 Response enhanced with medical training data
                  </Text>
                )}
              </View>
            </View>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <View style={messageStyles.aiContainer}>
              <View style={messageStyles.aiBubble}>
                <Text style={messageStyles.aiText}>Analyzing with medical training data...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Container */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask me anything about medical topics..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
            onSubmitEditing={handleSendMessage}
          />
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={handleSendMessage}
            disabled={isLoading || !inputText.trim()}
          >
            <Icon 
              name="send" 
              size={20} 
              style={{ 
                color: colors.white,
                opacity: (isLoading || !inputText.trim()) ? 0.5 : 1 
              }} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}