// import React from 'react';
// import { FlatList, StyleSheet, View } from 'react-native';
// import { Card, Text, Avatar } from 'react-native-paper';

// const doctors = [
//   { id: '1', name: 'Dr. John Smith', specialty: 'Cardiologist', photo: 'https://via.placeholder.com/50' },
//   { id: '2', name: 'Dr. Emily Brown', specialty: 'Pediatrician', photo: 'https://via.placeholder.com/50' },
//   // Add more doctor profiles here
// ];

// const FindDoctorScreen = () => { 
//   const renderItem = ({ item }) => (
//     <Card style={styles.card}>
//       <View style={styles.row}>
//         <Avatar.Image size={50} source={{ uri: item.photo }} />
//         <View style={styles.info}>
//           <Text variant="titleMedium">{item.name}</Text>
//           <Text>{item.specialty}</Text>
//         </View>
//       </View>
//     </Card>
//   );

//   return (
//     <FlatList
//       data={doctors}
//       renderItem={renderItem}
//       keyExtractor={(item) => item.id}
//       contentContainerStyle={styles.container}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//   },
//   card: {
//     marginVertical: 10,
//     padding: 15,
//     borderRadius: 10,
//     elevation: 3,
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   info: {
//     marginLeft: 10,
//   },
// });

// export default FindDoctorScreen;


import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Card } from 'react-native-paper'; 

const FindDoctorScreen = () => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
       <Text style={styles.H}>Dummy Text</Text>
        <Text style={styles.cardText}>Find Nearby Hospitals and Doctors; Issue of dispute in doctors me to don't know don't ask mee!</Text>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
  },
  card: {
    width: 300,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cardText: {
    fontSize: 18,
    color: '#333',
  },
  H:{
    fontSize: 25,
    color: '#2260FF',
    fontWeight: 'bold',
  }
});

export default FindDoctorScreen;
