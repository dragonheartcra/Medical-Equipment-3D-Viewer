export function getInitialLayerIndex() {
  return 0;
}

export function getNextLayerIndex(part, currentIndex) {
  const maxIndex = Math.max(0, (part.layers?.length ?? 1) - 1);
  return Math.min(currentIndex + 1, maxIndex);
}
