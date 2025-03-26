import { LatLng } from "react-native-maps";

export interface Marker {
    id: string;
    coordinate: LatLng;
    title?: string;
    description?: string;
    images?: Image[];
  }
  
  export interface MarkerImage {
    id: string;
    uri: string;
    markerId: string;
  }