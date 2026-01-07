
import React from 'react';
import { Camera, Palette, RefreshCw } from 'lucide-react';
import { AppMode, Language } from './types';

export const TRANSLATIONS = {
  [Language.EN]: {
    appName: 'MAGIC CLIK',
    tagline: 'Universal Prompt Architect',
    photography: 'Photography',
    digitalArt: 'Digital Art',
    restoration: 'Restoration',
    uploadImage: 'Upload Image',
    changeImage: 'Change Image',
    generate: 'Generate Prompt',
    copy: 'Copy to Clipboard',
    copied: 'Copied!',
    outputPlaceholder: 'Your generated prompt will appear here...',
    identity: 'Identity',
    cinematography: 'Cinematography',
    objectType: 'Object Type',
    single: 'Single',
    couple: 'Couple',
    gender: 'Gender',
    hijab: 'Wearing Hijab',
    outfit: 'Outfit',
    pose: 'Pose / Style',
    background: 'Background & Atmosphere',
    automatic: 'Automatic',
    manual: 'Manual',
    manualPlaceholder: 'Enter custom details...',
    timeOfDay: 'Time of Day',
    expression: 'Expression / Mood',
    camera: 'Camera Type',
    lens: 'Lens Type',
    filter: 'Filter',
    sceneMood: 'Scene Mood',
    aspectRatio: 'Aspect Ratio',
    angle: 'Camera Angle',
    shotSize: 'Shot Size',
    processing: 'Analyzing visual data...',
  },
  [Language.ID]: {
    appName: 'MAGIC CLIK',
    tagline: 'Arsitek Prompt Universal',
    photography: 'Fotografi',
    digitalArt: 'Seni Digital',
    restoration: 'Restorasi',
    uploadImage: 'Unggah Gambar',
    changeImage: 'Ganti Gambar',
    generate: 'Buat Prompt',
    copy: 'Salin ke Papan Klip',
    copied: 'Tersalin!',
    outputPlaceholder: 'Prompt yang dihasilkan akan muncul di sini...',
    identity: 'Identitas',
    cinematography: 'Sinematografi',
    objectType: 'Tipe Objek',
    single: 'Tunggal',
    couple: 'Pasangan',
    gender: 'Jenis Kelamin',
    hijab: 'Memakai Hijab',
    outfit: 'Pakaian',
    pose: 'Pose / Gaya',
    background: 'Latar Belakang & Suasana',
    automatic: 'Otomatis',
    manual: 'Manual',
    manualPlaceholder: 'Masukkan detail khusus...',
    timeOfDay: 'Waktu Hari',
    expression: 'Ekspresi / Mood',
    camera: 'Tipe Kamera',
    lens: 'Tipe Lensa',
    filter: 'Filter',
    sceneMood: 'Mood Adegan',
    aspectRatio: 'Rasio Aspek',
    angle: 'Sudut Kamera',
    shotSize: 'Ukuran Bidikan',
    processing: 'Menganalisis data visual...',
  }
};

export const MENU_ICONS = {
  [AppMode.PHOTOGRAPHY]: <Camera size={20} />,
  [AppMode.DIGITAL_ART]: <Palette size={20} />,
  [AppMode.RESTORATION]: <RefreshCw size={20} />,
};

export const CAMERA_OPTIONS = ['iPhone 17 Pro', 'Canon EOS R5', 'Sony A7R IV', 'Nikon Z9', 'Fujifilm GFX 100S', 'Leica M11'];
export const LENS_OPTIONS = ['35mm Prime f/1.4', '50mm Prime f/1.2', '85mm Portrait f/1.8', '24-70mm Zoom', '16-35mm Wide Angle'];
export const FILTER_OPTIONS = ['None', 'Kodak Portra 400', 'Fujifilm Velvia', 'Black & White Noir', 'Vintage Sepia'];
export const MOOD_OPTIONS = ['Natural', 'Cinematic', 'Hyperrealistic', 'Cozy', 'Romantic', 'Dark'];
export const ASPECT_RATIOS = ['1:1', '3:4', '4:3', '9:16', '16:9', '2.35:1', '4:5'];
export const ANGLES = ['Eye Level', 'High Angle', 'Low Angle', 'Bird\'s Eye', 'Worm\'s Eye', 'Side View', 'Dutch Angle'];
export const SHOT_SIZES = ['Close-up', 'Medium Shot', 'Full Shot', 'Wide Shot', 'Extreme Close-up', 'Medium Full', 'Long Shot'];
export const TIMES_OF_DAY = ['Morning', 'Afternoon', 'Evening', 'Night'];
export const EXPRESSIONS = ['Neutral', 'Happy', 'Sad', 'Angry', 'Surprised'];
