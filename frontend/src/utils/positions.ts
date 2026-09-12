const POSITION_SUFFIXES = ['DEL', 'GND', 'TWR', 'APP', 'DEP', 'CTR'];

/**
 * Once the user has typed a full 4-letter ICAO code (e.g. "LFLL"),
 * suggest the standard ATC position suffixes for that airport.
 */
export function suggestPositions(value: string): string[] {
  const prefix = value.split('_')[0].trim().toUpperCase();
  if (prefix.length !== 4) {
    return [];
  }
  return POSITION_SUFFIXES.map((suffix) => `${prefix}_${suffix}`);
}
