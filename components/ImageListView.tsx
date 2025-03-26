import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Dimensions, Platform, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

interface ImageListProps {
  images: { uri: string }[];
  onRemoveImage: (uri: string) => void;
}

export default function ImageListView({ images, onRemoveImage }: ImageListProps) {
  const screenWidth = 200;
  const imageSize = Platform.OS === 'web' ? 300 : screenWidth;

  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
      {images.map((image, index) => (
        <View key={index} style={[styles.imageContainer, { width: imageSize, height: imageSize }]}>
          <Image source={{ uri: image.uri }} style={styles.image} />
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onRemoveImage(image.uri)}>
            <Ionicons name="close-circle" size={24} color="#ffd33d" />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
    </SafeAreaView>
  </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25292e',
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    backgroundColor: '#25292e',
  },
  imageContainer: {
    position: 'relative',
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ffd33d',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(37, 41, 46, 0.8)',
    borderRadius: 12,
    padding: 4,
  },
});