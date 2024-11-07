import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Button, IconButton, Divider, Card } from 'react-native-paper';

const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Welcome Section */}
      <View style={styles.header}>
        <Text variant="headlineLarge" style={styles.welcomeText}>Welcome to Dr.GPT!</Text>
        <Text style={styles.subtitle}>Your Virtual Health Companion</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionRow}>
        <Card style={styles.actionCard} onPress={() => navigation.navigate('ChatScreen')}>
          <IconButton icon="chat" size={30} color="#2260FF" />
          <Text style={styles.cardText}>Chat with Dr.GPT</Text>
        </Card>
        <Card style={styles.actionCard} onPress={() => navigation.navigate('HealthTipsScreen')}>
          <IconButton icon="heart" size={30} color="#2260FF" />
          <Text style={styles.cardText}>Health Tips</Text>
        </Card>
      </View>

      <View style={styles.actionRow}>
        <Card style={styles.actionCard} onPress={() => navigation.navigate('HealthHistoryScreen')}>
          <IconButton icon="history" size={30} color="#2260FF" />
          <Text style={styles.cardText}>Health History</Text>
        </Card>
        <Card style={styles.actionCard} onPress={() => navigation.navigate('SettingsScreen')}>
          <IconButton icon="cog" size={30} color="#2260FF" />
          <Text style={styles.cardText}>Settings</Text>
        </Card>
      </View>

      <Divider style={styles.divider} />

      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }}
          style={styles.profileImage}
        />
        <View style={styles.profileTextContainer}>
          <Text style={styles.profileName}>Dr. GPT</Text>
          <Text style={styles.profileSpecialty}>Virtual Healthcare Assistant</Text>
        </View>
      </View>

      {/* Additional Actions */}
      <Button 
        mode="outlined" 
        onPress={() => navigation.navigate('AppointmentsScreen')} 
        style={styles.outlinedButton}
      >
        Manage Appointments
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  header: {
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2260FF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardText: {
    fontSize: 14,
    color: '#2260FF',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 5,
  },
  divider: {
    marginVertical: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  profileTextContainer: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  profileSpecialty: {
    fontSize: 14,
    color: '#888',
  },
  outlinedButton: {
    marginTop: 20,
    borderColor: '#2260FF',
    borderWidth: 1,
  },
});

export default HomeScreen;
