import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import Map from '@/components/Map';
import { Marker } from '@/types';
import { useMarkerContext } from '@/context/MarkerContext';

export default function MapScreen() {
  const {addMarker, getAllMarkers} = useMarkerContext();

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  
  const router = useRouter();
  const markers = getAllMarkers();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      console.log('Permission to access location was granted');
      
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const handleMarkerAdded = (coordinate: { latitude: number; longitude: number }) => {
    const newMarker: Marker = {
      id: String(markers.length + 1),
      coordinate,
    };
    addMarker(newMarker);
  };

  const handleMarkerPress = (id: string) => {
    router.push(`/marker/${id}`);
  };

  return (
    <View style={styles.container}>
      <Map
        markers={markers}
        onMarkerPress={handleMarkerPress}
        onMarkerAdded={handleMarkerAdded}
        initialRegion={
          userLocation
            ? {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }
            : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});