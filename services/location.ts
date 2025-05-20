// services/locationService.ts
import * as Location from 'expo-location';

export const requestLocationPermission = async (): Promise<boolean> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
};

export const getCurrentLocation = async (): Promise<{
  latitude: number;
  longitude: number;
} | null> => {
  const permissionGranted = await requestLocationPermission();

  if (!permissionGranted) {
    console.log('Permission to access location was denied');
    return null;
  }

  console.log('Permission to access location was granted');
  const location = await Location.getCurrentPositionAsync({});
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
};

export const startLocationUpdates = async (
  callback: (location: { latitude: number; longitude: number }) => void,
  options: Location.LocationOptions = {}
) => {
  return await Location.watchPositionAsync(
    { 
      accuracy: Location.Accuracy.High, 
      distanceInterval: 10,
      timeInterval: 5000,
      ...options
    },
    (location) => {
      callback({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
  );
};