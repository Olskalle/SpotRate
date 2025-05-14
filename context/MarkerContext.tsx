import { Marker } from '@/types';
import React, { createContext, useContext, useEffect } from 'react';
import { db } from '@/database/client';
import { DbMarkerInsert, DbMarkerSelect, markers } from '@/database/schema';
import { count, eq, max } from 'drizzle-orm';

type MarkerImageContextType = {
  addMarker: (marker: Marker) => Promise<void>;
  removeMarker: (id: number) => Promise<void>;
  getMarkerById: (id: number) => Promise<Marker | undefined>;
  getAllMarkers: () => Promise<Marker[]>;
};

const MarkerContext = createContext<MarkerImageContextType>({
  addMarker: async () => {},
  removeMarker: async () => {},
  getMarkerById: async () => undefined,
  getAllMarkers: async () => []
});

export const useMarkerContext = () => useContext(MarkerContext);

export const MarkerProvider = ({ children }: { children: React.ReactNode }) => {

  const markerToDbInsert = (marker: Marker): DbMarkerInsert => {

    const dbMarker = {
      title: marker.title || 'Marker',
      description: marker.description || '',
      latitude: marker.coordinate.latitude,
      longitude: marker.coordinate.longitude,
      created_at: new Date(),
      updated_at: new Date(),
    };
    
    return dbMarker;
  };

  const dbMarkerToMarker = (dbMarker: DbMarkerSelect) : Marker => {
    const coords = {latitude: dbMarker.latitude, longitude: dbMarker.longitude};
    
    const marker = {
      id: dbMarker.id,
      title: dbMarker.title,
      description: dbMarker.description,
      coordinate: coords,

    };

    return marker;
  }

  const addMarker = async (marker: Marker) => {
    const dbMarker = markerToDbInsert(marker);
    await db.insert(markers).values(dbMarker).returning();
  };

  const removeMarker = async (id: number) => {
    await db.delete(markers).where(eq(markers.id, id)).execute();
  };

  const getMarkerById = async (id: number) => {
    const dbMarker = await db.selectDistinct().from(markers).execute();

    return dbMarkerToMarker(dbMarker[0]);
  };

  const getAllMarkers = async () => {
    const allMarkers = await db.select().from(markers);

    return allMarkers.map(marker => dbMarkerToMarker(marker));
  };

  return (
    <MarkerContext.Provider value={{ addMarker, removeMarker, getMarkerById, getAllMarkers }}>
      {children}
    </MarkerContext.Provider>
  );
};