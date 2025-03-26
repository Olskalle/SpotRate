import { MarkerImage } from '@/types';
import React, { createContext, useState, useContext } from 'react';

type MarkerImageContextType = {
  images: Record<string, MarkerImage[]>; // Объект, где ключ — id маркера, значение — массив изображений
  addImage: (markerId: string, image: MarkerImage) => void;
  removeImage: (markerId: string, uri: string) => void;
  getImagesByMarkerId: (markerId: string) => MarkerImage[]; // Функция для получения изображений по markerId
};

const MarkerImageContext = createContext<MarkerImageContextType>({
  images: {},
  addImage: () => {},
  removeImage: () => {},
  getImagesByMarkerId: () => [],
});

export const useMarkerImageContext = () => useContext(MarkerImageContext);

export const MarkerImageProvider = ({ children }: { children: React.ReactNode }) => {
  const [images, setImages] = useState<Record<string, MarkerImage[]>>({});

  const addImage = (markerId: string, image: MarkerImage) => {
    setImages((prev) => ({
      ...prev,
      [markerId]: [...(prev[markerId] || []), image], // Если массив для markerId не существует, создаем его
    }));
  };

  const removeImage = (markerId: string, uri: string) => {
    setImages((prev) => ({
      ...prev,
      [markerId]: prev[markerId].filter((img) => img.uri !== uri), // Фильтруем массив изображений
    }));
  };

  const getImagesByMarkerId = (markerId: string) => {
    return images[markerId] || []; // Если изображений для markerId нет, возвращаем пустой массив
  };

  return (
    <MarkerImageContext.Provider value={{ images, addImage, removeImage, getImagesByMarkerId }}>
      {children}
    </MarkerImageContext.Provider>
  );
};