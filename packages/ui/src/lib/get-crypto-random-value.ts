/** Random value for ids / skeleton widths — uses crypto when available. */
export function getCryptoRandomValue(): number {
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const buffer = new Uint32Array(1);
    crypto.getRandomValues(buffer);
    return buffer[0] ?? 0;
  }
  return Math.floor(Math.random() * 2 ** 32);
}
