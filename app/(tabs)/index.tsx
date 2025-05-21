import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import Map from '@/components/Map';
import { Marker } from '@/types';
import { useMarkerContext } from '@/context/MarkerContext';
import { getCurrentLocation, startLocationUpdates } from '@/services/location';
import { NotificationManager } from '@/services/notifications';
import { calculateDistance } from '@/utils/distance';

export default function MapScreen() {
  const { addMarker, getAllMarkers } = useMarkerContext();

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [markers, setMarkers] = useState<Marker[]>([]);
  const router = useRouter();
  const notificationManager = new NotificationManager();  // Создаем экземпляр NotificationManager
  const [isPermissionGranted, setIsPermissionGranted] = useState<boolean>(false);

  // Эффект для отправки уведомлений при приближении к маркеру
  useEffect(() => {

    console.log(`UserLocation: ${userLocation}`);
    console.log(`Permission: ${isPermissionGranted}`);

    if (!isPermissionGranted || !userLocation) return;

    markers.forEach((marker) => {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        marker.coordinate.latitude,
        marker.coordinate.longitude
      );

      // Если расстояние меньше 100 метров, отправляем уведомление
      if (distance <= 100) {
        console.log(`Show notification for marker ${marker.id}`);
        notificationManager.showNotification(marker);  // Показываем уведомление
      }
      else {
        console.log(`Remove notification for marker ${marker.id}`);
        notificationManager.removeNotification(marker.id);
      }
    });
  }, [userLocation, markers, isPermissionGranted]);

  // Проверка разрешений на уведомления при монтировании компонента
  useEffect(() => {
    const checkNotificationPermissions = async () => {
      const hasPermission = await notificationManager.requestNotificationPermissions();
      console.log(hasPermission);
      setIsPermissionGranted(hasPermission);
    };
    checkNotificationPermissions();
  }, []);

  // Загрузка начальной геолокации
  useEffect(() => {

    const fetchLocation = async () => {
      const location = await getCurrentLocation();
      if (location) {
        setUserLocation(location);
      }
    };

    fetchLocation();

    startLocationUpdates((location) => {
      console.log('Updated location:', location);
      setUserLocation(location);
    }).then((locationSubscription) => {
      return () => {
        locationSubscription.remove();
      };
    });

  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadMarkers();
    }, [])
  );

  const handleMarkerAdded = async (coordinate: { latitude: number; longitude: number }) => {
    const newMarker: Marker = {
      id: 0,
      title: 'Маркер',
      coordinate,
    };

    await addMarker(newMarker).then(loadMarkers);
  };

  const loadMarkers = async () => {
    try {
      const loadedMarkers = await getAllMarkers();
      setMarkers(loadedMarkers);
      console.log('Effect load markers triggered');
    } catch (error) {
      console.error('Failed to load markers:', error);
    }
  };

  const handleMarkerPress = (id: number) => {
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
