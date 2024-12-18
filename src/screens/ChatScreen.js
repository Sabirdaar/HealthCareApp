import React, { useState } from 'react';
import { View, StyleSheet, TextInput, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView } from 'react-native';
import { Text, Button } from 'react-native-paper';

const ChatScreen = () => {
  const [messages, setMessages] = useState([
    { sender: 'AI', text: 'Hello, how can I assist you today?' }, // Initial message from AI
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user message to chat
    const userMessage = { sender: 'User', text: inputText };
    setMessages((prev) => [...prev, userMessage]);
    setInputText(''); // Clear input field

    // Call the RapidAPI ChatGPT API
    try {
      setLoading(true);
      const response = await fetch('https://chatgpt4-api.p.rapidapi.com/ping', {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'chatgpt4-api.p.rapidapi.com',
          'x-rapidapi-key': 'd78dbb7df5msh3afc05a178f554dp1c631cjsn90b44ed97cb5',
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      // Assuming the API responds with a JSON object containing a "reply" property
      const aiMessage = {
        sender: 'AI',
        text: data.reply || 'Sorry, I could not process your request.',
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error communicating with AI:', error);
      Alert.alert('Error', 'Failed to fetch AI response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text variant="headlineMedium" style={styles.header}>
        Chat with Dr. GPT
      </Text>

      <ScrollView style={styles.chatContainer} contentContainerStyle={styles.chatContent}>
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              message.sender === 'User' ? styles.userBubble : styles.aiBubble,
            ]}
          >
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
        {loading && <ActivityIndicator size="small" color="#2260FF" />}
      </ScrollView>

      <TextInput
        value={inputText}
        onChangeText={setInputText}
        placeholder="Ask Your Doctor GPT..."
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handleSendMessage}
        style={styles.sendButton}
        disabled={loading}
      >
        Send
      </Button>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontWeight: 'bold',
    color: '#2260FF',
    marginBottom: 20,
    textAlign: 'center',
  },
  chatContainer: {
    flex: 1,
    marginBottom: 10,
  },
  chatContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageBubble: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 15,
    maxWidth: '80%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#2260FF',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0E0E0',
  },
  messageText: {
    color: '#FFF',
  },
  input: {
    marginBottom: 10,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
  },
  sendButton: {
    backgroundColor: '#2260FF',
    borderRadius: 25,
    marginBottom: 50,
  },
});

export default ChatScreen;
