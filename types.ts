
export interface TherionData {
  thContent: string;
  txtContent: string;
  baseFilename: string;
  width: number;
  height: number;
  debugLog: string;
}

export interface TfwData {
  pixelSizeX: number; // A
  rotationY: number;  // D
  rotationX: number;  // B
  pixelSizeY: number; // E (negative)
  centerX: number;    // C
  centerY: number;    // F
}

export interface ParsedInfo {
  width: number;
  height: number;
  pixelSizeX: number;
  pixelSizeY: number;
  originX: number;
  originY: number;
  elevationData: number[];
  minElevation: number;
  maxElevation: number;
  tfwData: TfwData;
  filename: string;
}