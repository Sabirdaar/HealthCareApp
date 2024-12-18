import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card } from 'react-native-paper';



const HealthTipsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>Health Tips</Text>

      <Card style={styles.card}>
        <Text variant="titleMedium" style={styles.cardTitle}>Stay Hydrated</Text>
        <Text variant="bodyMedium">Drink plenty of water throughout the day to stay hydrated and healthy.</Text>
      </Card>

      <Card style={styles.card}>
        <Text variant="titleMedium" style={styles.cardTitle}>Exercise Regularly</Text>
        <Text variant="bodyMedium">Engage in at least 30 minutes of physical activity every day to maintain good health.</Text>
      </Card>

      <Card style={styles.card}>
        <Text variant="titleMedium" style={styles.cardTitle}>Eat a Balanced Diet</Text>
        <Text variant="bodyMedium">Include a variety of fruits, vegetables, and whole grains in your daily meals.</Text>
      </Card>
    </ScrollView>
  );
  <BottomNavigation navigation={navigation} />

};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  header: {
    color: '#2260FF',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    marginBottom: 15,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    color: '#2260FF',
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default HealthTipsScreen;
