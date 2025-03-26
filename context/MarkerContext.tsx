import { Marker } from '@/types';
import React, { createContext, useState, useContext } from 'react';

type MarkerImageContextType = {
  markers: Record<string, Marker>;
  addMarker: (marker: Marker) => void;
  removeMarker: (id: string) => void;
  getMarkerById: (id: string) => Marker | undefined;
  getAllMarkers: () => Marker[];
};

const MarkerContext = createContext<MarkerImageContextType>({
  markers: {},
  addMarker: () => {},
  removeMarker: () => {},
  getMarkerById: () => undefined,
  getAllMarkers: () => []
});

export const useMarkerContext = () => useContext(MarkerContext);

export const MarkerProvider = ({ children }: { children: React.ReactNode }) => {
  const [markers, setMarkers] = useState<Record<string, Marker>>({});

  const addMarker = (marker: Marker) => {
    setMarkers((prev) => ({
      ...prev,
      [marker.id]: marker,
    }));
  };

  const removeMarker = (id: string) => {
    setMarkers((prev) => {
      const newMarkers = { ...prev };
      delete newMarkers[id];
      return newMarkers;
    });
  };

  const getMarkerById = (id: string) => {
    return markers[id] || undefined;
  };

  const getAllMarkers = () => {
    return Object.values(markers);
  };

  return (
    <MarkerContext.Provider value={{ markers, addMarker, removeMarker, getMarkerById, getAllMarkers }}>
      {children}
    </MarkerContext.Provider>
  );
};