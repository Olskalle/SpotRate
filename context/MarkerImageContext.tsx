import { MarkerImage } from '@/types';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '@/database/client';
import { DbMarkerImageInsert, DbMarkerImageSelect, markerImages } from '@/database/schema';
import { and, eq } from 'drizzle-orm';

type MarkerImageContextType = {
  addImage: (image: MarkerImage) => Promise<void>;
  removeImage: (markerId: number, uri: string) => Promise<void>;
  getImagesByMarkerId: (markerId: number) => Promise<MarkerImage[]>;
};

const MarkerImageContext = createContext<MarkerImageContextType>({
  addImage: async () => {},
  removeImage: async () => {},
  getImagesByMarkerId: async () => [],
});

export const useMarkerImageContext = () => useContext(MarkerImageContext);

export const MarkerImageProvider = ({ children }: { children: React.ReactNode }) => {

  const imageToDbImage = (image : MarkerImage) : DbMarkerImageInsert => {
    const dbImage = {
      markerId: image.markerId,
      uri: image.uri
    };

    return dbImage;
  }

  const dbImageToImage = (dbImage : DbMarkerImageSelect) : MarkerImage => {
    const image = {
      id: dbImage.id,
      markerId: dbImage.markerId || 0,
      uri: dbImage.uri
    };

    return image;
  }

  const addImage = async (image: MarkerImage) => {
    const dbImage = imageToDbImage(image);
    await db.insert(markerImages).values(dbImage).returning();
  };

  const removeImage = async (markerId: number, uri: string) => {
    await db.delete(markerImages).where(and(eq(markerImages.markerId, markerId), eq(markerImages.uri, uri))).execute();
  };

  const getImagesByMarkerId = async (markerId: number) => {
    const dbImages = await db.select().from(markerImages).where(eq(markerImages.markerId, markerId)).execute();

    return dbImages.map(dbImage => dbImageToImage(dbImage));
  };

  return (
    <MarkerImageContext.Provider value={{ addImage, removeImage, getImagesByMarkerId }}>
      {children}
    </MarkerImageContext.Provider>
  );
};