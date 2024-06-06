import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import axios from 'axios';

const HomeScreen = ({ route, navigation }) => {
  const { token } = route.params;
  const [userName, setUserName] = useState('');

  useEffect(() => {
    axios.post('https://api.munic.io/services/ekko/v2/graphql', {
      query: `
        query {
          account(id: "me") {
            full_name
          }
        }
      `,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      const fullName = response.data.data.account.full_name;
      setUserName(fullName);
    })
    .catch(error => {
      console.error("Error fetching user info", error);
    });
  }, [token]);

  return (
    <View style={styles.container}>
      <Text>Welcome, {userName}!</Text>
      <Button
        title="Decode Plate"
        onPress={() => navigation.navigate('Decode', { token })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
