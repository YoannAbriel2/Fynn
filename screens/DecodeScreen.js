import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';

const DecodeScreen = ({ route }) => {
  const { token } = route.params;
  const [plate, setPlate] = useState('');
  const [country, setCountry] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const decodePlate = () => {
    if (!plate || !country) {
      setError('Please enter both plate and country code');
      return;
    }

    setLoading(true);
    setError('');
    setVehicleInfo(null);

    console.log('Sending request with variables:', { plate, country });

    axios.post('https://cors-anywhere.herokuapp.com/https://api.munic.io/services/ekko/v2/graphql', {
      query: `
        query decodePlate($plate: String!, $country: String!) {
          decodePlate(plate: $plate, country: $country) {
            id
            vin
            make
            model
            yearOfFirstCirculation
            bodyType
            engineFuelType
            gearboxType
            seats
            color
            urlVehicleImage
            co2Emission
            critair
            engineDisplacement
            engineOutputPower
            top_speed
            wheelsDimension
          }
        }
      `,
      variables: {
        plate,
        country,
      },
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      console.log('Response from API:', response.data);
      const data = response.data?.data?.decodePlate;
      if (data && data.length > 0) {
        setVehicleInfo(data[0]);
      } else {
        setError('No vehicle information found.');
      }
    })
    .catch(error => {
      setError('Error decoding the plate');
      console.error("Error decoding plate", error);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>Country Code</Text>
      <TextInput
        style={styles.input}
        value={country}
        onChangeText={setCountry}
      />
      <Text>Plate</Text>
      <TextInput
        style={styles.input}
        value={plate}
        onChangeText={setPlate}
      />
      <Button title="Decode Plate" onPress={decodePlate} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {vehicleInfo && (
        <View style={styles.infoContainer}>
          <Text>ID: {vehicleInfo.id}</Text>
          <Text>VIN: {vehicleInfo.vin}</Text>
          <Text>Make: {vehicleInfo.make}</Text>
          <Text>Model: {vehicleInfo.model}</Text>
          <Text>Year of First Circulation: {vehicleInfo.yearOfFirstCirculation}</Text>
          <Text>Body Type: {vehicleInfo.bodyType}</Text>
          <Text>Engine Fuel Type: {vehicleInfo.engineFuelType}</Text>
          <Text>Gearbox Type: {vehicleInfo.gearboxType}</Text>
          <Text>Seats: {vehicleInfo.seats}</Text>
          <Text>Color: {vehicleInfo.color}</Text>
          <Text>CO2 Emission: {vehicleInfo.co2Emission}</Text>
          <Text>Critair: {vehicleInfo.critair}</Text>
          <Text>Engine Displacement: {vehicleInfo.engineDisplacement}</Text>
          <Text>Engine Output Power: {vehicleInfo.engineOutputPower}</Text>
          <Text>Top Speed: {vehicleInfo.top_speed}</Text>
          <Text>Wheels Dimension: {vehicleInfo.wheelsDimension}</Text>
          <Image
            source={{ uri: vehicleInfo.urlVehicleImage }}
            style={styles.image}
          />
          {/* Affichez les autres champs nécessaires ici */}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  infoContainer: {
    marginTop: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginTop: 20,
  },
});

export default DecodeScreen;
