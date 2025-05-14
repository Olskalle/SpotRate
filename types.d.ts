import { LatLng } from "react-native-maps";

export interface Marker {
    id: number;
    coordinate: LatLng;
    title?: string;
    description?: string;
    images?: Image[];
  }
  
  export interface MarkerImage {
    id: number;
    uri: string;
    markerId: number;
  }