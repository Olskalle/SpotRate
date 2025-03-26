import React, { useRef } from 'react';
import { StyleSheet, View, Text, Button, Modal, PanResponder } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import ImageListView from '@/components/ImageListView';
import { useMarkerImageContext } from '@/context/MarkerImageContext';
import { useMarkerContext } from '@/context/MarkerContext';

export default function MarkerModal() {
  const { id } = useLocalSearchParams();
  const { addImage, removeImage, getImagesByMarkerId } = useMarkerImageContext();
  const { getMarkerById } = useMarkerContext();
  
  const router = useRouter();
  const navigation = useNavigation();
  const images = getImagesByMarkerId(id as string);
  const marker = getMarkerById(id as string);

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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      addImage(id as string, { id: '0', uri: result.assets[0].uri, markerId: id as string }); 
    }
  };

  const handleRemoveImage = (uri: string) => {
    removeImage(id as string, uri);
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
          <Button title="Закрыть" onPress={() => router.back()} color="#ffd33d" />
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