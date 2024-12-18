import React, { useState, useEffect } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, Animated, ActivityIndicator, StyleSheet } from 'react-native';
import { Text, IconButton, Card, FAB, Menu, Divider } from 'react-native-paper';
import Colors from '../constants/Colors';
import { getHealthTips, fetchDocumentById } from '../constants/firebaseFunctions'; // Import your Firestore functions
import { auth, onAuthStateChanged } from '../constants/FireBaseConfig';  // Firebase auth
import generateHealthTips from '../constants/utils/generateHealthTips'; // Import the generateHealthTips function

const HomeScreen = ({ navigation }) => {
  const [quoteVisible, setQuoteVisible] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1)); // Animation for fading out
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArticles, setFilteredArticles] = useState(["Healthy Eating", "Stress Management", "Benefits of Yoga"]);
  const [healthTipsData, setHealthTipsData] = useState([]); // For health tips
  const [loadingHealthTips, setLoadingHealthTips] = useState(true); // Loading state for health tips
  const [userName, setUserName] = useState('');  // Store the user's name here

  // Fetch user data and health tips when the component mounts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("Auth state changed, user:", firebaseUser);
      if (firebaseUser) {
        fetchUserData(firebaseUser.uid); // Fetch user data and health tips
      } else {
        setUserName(''); // Clear user name if no user is logged in
      }
    });

    return () => unsubscribe(); // Unsubscribe from auth state on component unmount
  }, []);

  // Function to fetch user data and health tips
  const fetchUserData = async (userId) => {
    try {
      const userData = await fetchDocumentById('users', userId); // Fetch user data from Firestore
      if (userData && userData.name) {
        setUserName(userData.name); // Set the user name from Firestore
        // Proceed to fetch health tips
        fetchHealthTips(userId);
      } else {
        console.error('No user data found for the provided userId');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Function to fetch or generate health tips
  const fetchHealthTips = async (userId) => {
    setLoadingHealthTips(true);
    try {
      // Check if health tips exist for the user
      const tips = await getHealthTips(userId);
      if (tips && tips.healthTips) {
        // Health tips already exist
        setHealthTipsData(tips.healthTips);
      } else {
        // Generate new tips if none exist
        const newTips = await generateHealthTips(userId);
        if (newTips && newTips.tips) {
          setHealthTipsData(newTips.tips);
        } else {
          console.error('Error: No health tips generated');
        }
      }
    } catch (error) {
      console.error('Error fetching or generating health tips:', error);
    } finally {
      setLoadingHealthTips(false);
    }
  };

  // Function to handle search input
  const handleSearchChange = (text) => {
    setSearchQuery(text);
    const filtered = ["Healthy Eating", "Stress Management", "Benefits of Yoga"].filter(article =>
      article.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredArticles(filtered);
  };

  // Function to toggle menu visibility
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  // Function to navigate to a different screen
  const handleNavigation = (screen) => {
    navigation.navigate(screen);
    closeMenu(); // Close the menu after navigation
  };

  // Function to navigate to the Emergency screen
  const handleEmergency = () => {
    navigation.navigate('EmergencyScreen');
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          {/* Profile Icon */}
          <IconButton
            icon="account"
            size={60}  // Increased size for profile icon
            style={styles.profileIcon}
            onPress={() => navigation.navigate('ProfileScreen')}
          />
          
          {/* Search Bar */}
          <TextInput
            style={styles.searchBar}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={handleSearchChange}
          />

          {/* Notification Icon */}
          <IconButton
            icon="bell"
            size={25}
            style={styles.notificationIcon}
            onPress={() => navigation.navigate('NotificationScreen')}
          />
          
          {/* Menu Button */}
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={<IconButton icon="dots-vertical" size={30} onPress={openMenu} />}
            style={styles.menu}
          >
            <Menu.Item onPress={() => handleNavigation('SettingsScreen')} title="Settings" />
            <Menu.Item onPress={() => handleNavigation('ProfileScreen')} title="Profile" />
            <Menu.Item onPress={() => handleNavigation('MedicalLibraryScreen')} title="Medical Library" />
            <Menu.Item onPress={() => handleNavigation('FirstAidScreen')} title="First Aid" />
            <Menu.Item onPress={() => handleNavigation('NotificationScreen')} title="Notifications" />
            <Divider />
            <Menu.Item onPress={() => handleNavigation('EmergencyScreen')} title="Emergency" />
          </Menu>
        </View>
        {/* Dynamic greeting */}
        <Text variant="headlineLarge" style={styles.headerText}>
          Good Morning, {userName || 'User'}!
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>Let’s prioritize your health today.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}> 
        {/* Animated Quote Section */}
        {quoteVisible && (
          <Animated.View style={[styles.quoteCard, { opacity: fadeAnim }]} >
            <Text style={styles.quoteText}>"The greatest wealth is health." – Virgil</Text>
          </Animated.View>
        )}

        {/* Quick Links */}
        <Text variant="headlineSmall" style={styles.sectionHeader}>Healthcare Services</Text>
        <View style={styles.quickLinksContainer}>
           {[ 
            { icon: 'chat', title: 'Dr.GPT', screen: 'DR.GPT' },
            { icon: 'heart', title: 'Health Records', screen: 'HealthTipsScreen' },
            { icon: 'hospital-building', title: 'Nearby Hospitals', screen: 'Nearby Hospitals' },
          ].map((item, index) => (
            <Card key={index} style={styles.quickLinkCard} onPress={() => navigation.navigate(item.screen)}>
              <IconButton icon={item.icon} size={40} style={styles.quickLinkIcon} />
              <Text style={styles.quickLinkText}>{item.title}</Text>
            </Card>
          ))} 
        </View>

        {/* Health Tips Section */}
        <Text variant="headlineSmall" style={styles.sectionHeader}>Health Tips</Text>
        {loadingHealthTips ? (
          <ActivityIndicator size="large" color={Colors.primary} style={styles.loadingIndicator} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.healthTipsContainer}>
            {healthTipsData.length > 0 ? (
              healthTipsData.map((tip, index) => (
                <TouchableOpacity key={index} onPress={() => console.log(tip)}>
                  <Card style={styles.healthTipCard}>
                    <Text style={styles.healthTipTitle}>{tip.title}</Text>
                    <Text style={styles.healthTipDescription}>{tip.content}</Text>
                    <Text style={styles.healthTipCategory}>{tip.category}</Text>
                  </Card>
                </TouchableOpacity>
              ))
            ) : (
              <Text>No health tips available</Text>
            )}
          </ScrollView>
        )}

        {/* Trending Articles Section */}
        <Text variant="headlineSmall" style={styles.sectionHeader}>Trending Articles</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.articlesContainer}>
          {filteredArticles.map((article, index) => (
            <TouchableOpacity key={index}>
              <Card style={styles.articleCard}>
                <Text style={styles.articleText}>{article}</Text>
                <Text style={styles.articleDescription}>Read more about {article}</Text>
              </Card>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>

      {/* Emergency Button */}
      <FAB
        style={styles.emergencyButton}
        icon="phone"
        label="Emergency"
        color="#FFF"
        onPress={handleEmergency}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  header: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: 65,
    paddingHorizontal: 20,
    paddingRight: 10,
    paddingLeft: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menu: {
    position: 'absolute',
    top: 125, // Adjusted for better positioning
    right: 15, // Ensures it's well placed at the top right
    left: 125,
  },
  headerText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 32,
  },
  subtitle: {
    color: '#D0D9FF',
    fontSize: 16,
    marginTop: 5,
  },
  profileIcon: {
    backgroundColor: '#FFFFFF33',
  },
  notificationIcon: {
    backgroundColor: '#FFFFFF33',
  },
  searchBar: {
    height: 40,
    marginHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    fontSize: 16,
    marginTop: 5,
    width: '45%',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 170,
  },
  quoteCard: {
    backgroundColor: '#F9FAF8',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  quoteText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#2D5C2E',
    textAlign: 'center',
  },
  sectionHeader: {
    fontWeight: '700',
    fontSize: 22,
    color: '#333',
    marginBottom: 10,
  },
  quickLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  quickLinkCard: {
    width: 110,
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E9F5FF',
    borderRadius: 15,
    padding: 10,
  },
  quickLinkIcon: {
    backgroundColor: '#D7E9F7',
    marginBottom: 10,
  },
  quickLinkText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  healthTipsContainer: {
    marginTop: 20,
  },
  healthTipCard: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginRight: 10,
    backgroundColor: '#E1F5FE',
    borderRadius: 15,
  },
  healthTipTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#01579B',
  },
  healthTipDescription: {
    fontSize: 14,
    color: '#01579B',
    marginTop: 5,
  },
  healthTipCategory: {
    fontSize: 12,
    color: '#01579B',
    marginTop: 10,
  },
  articlesContainer: {
    marginTop: 20,
  },
  articleCard: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginRight: 10,
    backgroundColor: '#E1F5FE',
    borderRadius: 15,
  },
  articleText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#01579B',
  },
  articleDescription: {
    fontSize: 14,
    color: '#01579B',
    marginTop: 5,
  },
  emergencyButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: Colors.primaryColor,
  },
});

export default HomeScreen;
