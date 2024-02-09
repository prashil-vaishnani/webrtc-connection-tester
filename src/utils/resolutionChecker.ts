const resolutionArray = [
  [160, 120],
  [320, 180],
  [320, 240],
  [640, 360],
  [640, 480],
  [768, 576],
  [1024, 576],
  [1280, 720],
  [1280, 768],
  [1280, 800],
  [1920, 1080],
  [1920, 1200],
  [3840, 2160],
  [4096, 2160],
];
export const isMeaningfulResolution = (
  width: number,
  height: number
): boolean => {
  // Aspect ratio between 4:3 and 16:9, width and height greater than 100
  return resolutionArray.some(([w, h]) => w === width && h === height);
};
