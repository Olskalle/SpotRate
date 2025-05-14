import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Button, Modal, PanResponder } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import ImageListView from '@/components/ImageListView';
import { useMarkerImageContext } from '@/context/MarkerImageContext';
import { useMarkerContext } from '@/context/MarkerContext';
import { Marker, MarkerImage } from '@/types';

export default function MarkerModal() {
  const { id } = useLocalSearchParams();
  const { addImage, removeImage, getImagesByMarkerId } = useMarkerImageContext();
  const { getMarkerById, removeMarker } = useMarkerContext();
  
  const router = useRouter();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [marker, setMarker] = useState<Marker | undefined>(undefined);
  const [images, setImages] = useState<MarkerImage[]>([]);

  const numericId = typeof id === 'string' ? parseInt(id, 10) : 0;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        
        if (gestureState.dy > 200) {
          router.back();
        }
      },
    })
  ).current;

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [markerData, imagesData] = await Promise.all([
        getMarkerById(numericId),
        getImagesByMarkerId(numericId)
      ]);
      setMarker(markerData);
      setImages(imagesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [numericId, getMarkerById, getImagesByMarkerId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await addImage({ id: 0, uri: result.assets[0].uri, markerId: numericId });
        await loadData();
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleRemoveImage = async (uri: string) => {
    try {
      console.log(uri);
      await removeImage(numericId, uri);
      console.log('removeImage ended');
      await loadData();
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  const handleRemoveMarker = async () => {
    try {
      await removeMarker(numericId);
      router.back();
    }
    catch (error) {
      console.error("Error removing marker:", error);
    }
  };

  useFocusEffect(() => {
    navigation.setOptions({
      title: `Marker ${id}`,
      headerStyle: {
        backgroundColor: '#25292e',
      },
      headerTintColor: '#fff',
      headerShadowVisible: false,
    });
  });
  
  return (
    <Modal animationType="slide" transparent={true}>
      <View style={styles.container} {...panResponder.panHandlers}>
        <View style={styles.swipeIndicator} />
          <Text style={styles.title}>ID Маркера: {id}</Text>
          <Text style={styles.text}>Широта: {marker?.coordinate.latitude}</Text>
          <Text style={styles.text}>Долгота: {marker?.coordinate.longitude}</Text>
          <Button title="Добавить изображение" onPress={pickImage} color="#ffd33d" />
          <ImageListView images={images} onRemoveImage={handleRemoveImage} />
          <Button title="Удалить" onPress={handleRemoveMarker} color="#91150c" />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#25292e',
  },
  swipeIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
  },
});