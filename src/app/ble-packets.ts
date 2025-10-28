export enum DeviceFamily {
  Sanso,
  Grasse,
}

function additiveChecksum(bytes: number[]): number {
  const sum = bytes.reduce((a, b) => a + b, 0);
  return (256 - (sum % 256)) & 0xff;
}

export function buildFrame(family: DeviceFamily, body: number[]): Uint8Array {
  if (family === DeviceFamily.Sanso) {
    const len = body.length + 1;
    const base = [0x55, 0xaa, len, 0x07, ...body];
    const framed = [...base, additiveChecksum(base), 0x5a];
    return new Uint8Array(framed);
  }

  const xor = body.reduce((acc, b) => acc ^ b, 0);
  const framed = [0xa5, 0xaa, 0xac, xor, ...body, 0xc5, 0xcc, 0xca];
  return new Uint8Array(framed);
}
