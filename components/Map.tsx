import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { LatLng, Marker, Region } from 'react-native-maps';

interface MapProps {
  markers: { id: string; coordinate: LatLng }[];
  onMarkerPress: (id: string) => void;
  onMarkerAdded: (coordinate: LatLng) => void;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

export default function Map({
  markers,
  onMarkerPress,
  onMarkerAdded,
  initialRegion,
}: MapProps) {
  const mapRef = React.useRef<MapView>(null);
  const [currentRegion, setCurrentRegion] = React.useState<Region | undefined>(initialRegion);
  
  return (
    <View style={styles.container}>
      <MapView
      ref={mapRef}
        style={styles.map}
        onLongPress={(event) => {
          const { coordinate } = event.nativeEvent;
          onMarkerAdded(coordinate);
        }}
        initialRegion={initialRegion}
        region={currentRegion}
        onRegionChangeComplete={() => {
          setCurrentRegion(initialRegion)
        }}
        showsMyLocationButton={true}
        showsUserLocation={true}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            onPress={() => onMarkerPress(marker.id)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});