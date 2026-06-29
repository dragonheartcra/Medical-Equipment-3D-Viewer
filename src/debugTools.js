export function roundCoordinate(value) {
  return Number(value.toFixed(3));
}

export function formatPosition(position) {
  return `[${position.map((value) => roundCoordinate(value).toFixed(3)).join(", ")}]`;
}

export function formatNormal(normal) {
  if (!normal) return "null";
  return formatPosition(normal);
}

export function setPartSurfacePoint(device, partId, position, normal) {
  const part = device.parts.find((item) => item.id === partId);
  if (!part) return null;
  part.position = position.map(roundCoordinate);
  if (normal) part.normal = normal.map(roundCoordinate);
  return part;
}

export function setPartPosition(device, partId, position) {
  return setPartSurfacePoint(device, partId, position);
}

export function exportDevicePositions(device) {
  return device.parts
    .map((part) => {
      const lines = [
        `// ${part.name}`,
        `id: "${part.id}",`,
        `position: ${formatPosition(part.position)},`,
      ];
      if (part.normal) lines.push(`normal: ${formatNormal(part.normal)},`);
      return lines.map((line) => `  ${line}`).join("\n");
    })
    .join("\n");
}
