/**
 * LRC Parser Utility
 * Parses LRC (Lyric) format and provides sync functionality
 */

export interface LyricLine {
  time: number; // Time in milliseconds
  text: string;
}

/**
 * Parse LRC format string to array of LyricLine
 * LRC format: [mm:ss.xx] Lyric text
 */
export function parseLRC(lrcString: string): LyricLine[] {
  if (!lrcString) return [];

  const lines = lrcString.split('\n');
  const lyrics: LyricLine[] = [];

  // Regex to match LRC timestamp: [mm:ss.xx] or [mm:ss]
  const timeRegex = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/g;

  for (const line of lines) {
    const matches = Array.from(line.matchAll(timeRegex));
    if (matches.length === 0) continue;

    // Get the text after all timestamps
    const text = line.replace(timeRegex, '').trim();
    if (!text) continue;

    // Each timestamp creates a separate lyric line
    for (const match of matches) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const milliseconds = match[3] ? parseInt(match[3].padEnd(3, '0'), 10) : 0;

      const time = (minutes * 60 + seconds) * 1000 + milliseconds;
      lyrics.push({ time, text });
    }
  }

  // Sort by time
  return lyrics.sort((a, b) => a.time - b.time);
}

/**
 * Find the current lyric line index based on progress
 */
export function findCurrentLineIndex(lyrics: LyricLine[], progressMs: number): number {
  if (lyrics.length === 0) return -1;

  // Find the last line that has started
  for (let i = lyrics.length - 1; i >= 0; i--) {
    if (lyrics[i].time <= progressMs) {
      return i;
    }
  }

  return -1; // No line has started yet
}

/**
 * Get surrounding lyrics for display (before and after current line)
 */
export function getSurroundingLyrics(
  lyrics: LyricLine[],
  currentIndex: number,
  beforeCount: number = 2,
  afterCount: number = 3
): { lyrics: LyricLine[]; currentIndexInSlice: number } {
  if (lyrics.length === 0 || currentIndex < 0) {
    return { lyrics: [], currentIndexInSlice: -1 };
  }

  const startIndex = Math.max(0, currentIndex - beforeCount);
  const endIndex = Math.min(lyrics.length, currentIndex + afterCount + 1);

  return {
    lyrics: lyrics.slice(startIndex, endIndex),
    currentIndexInSlice: currentIndex - startIndex,
  };
}
