/**
 * This file contains the color palette for the app.
 * It's organized by theme (light and dark) to make it easy to manage and apply.
 */

const accentColor = '#00E6A4'; // A vibrant, modern teal/neon green

export const Colors = {
  light: {
    text: '#1C1C1E',
    subtleText: '#6E6E73',
    background: '#F2F2F7',
    cardBackground: '#FFFFFF',
    inputBackground: '#FFFFFF',
    inputPlaceholder: '#6E6E73',
    buttonText: '#FFFFFF',
    messageBubble: '#E5E5EA',
    accent: accentColor,
    border: '#D1D1D6',
  },
  dark: {
    text: '#E5E5E7',
    subtleText: '#8E8E93',
    background: '#000000',
    cardBackground: '#1C1C1E',
    inputBackground: '#1C1C1E',
    inputPlaceholder: '#8E8E93',
    buttonText: '#000000', // Black text on the vibrant accent
    messageBubble: '#2C2C2E',
    accent: accentColor,
    border: '#38383A',
  },
};