/**
 * Utility functions for working with MIDI pitches and note names
 */

/**
 * Convert MIDI pitch number to note name (e.g., 60 -> "C4")
 */
export function getPitchName(pitch: number): string {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(pitch / 12) - 1;
  const noteName = noteNames[pitch % 12];
  return `${noteName}${octave}`;
}

/**
 * Convert note name to MIDI pitch number (e.g., "C4" -> 60)
 */
export function getMidiPitch(noteName: string): number | null {
  // Normalize the note name to uppercase for the note part
  const normalizedNote = noteName.replace(/[^a-zA-Z0-9#]/g, '');

  // Match the note pattern: a letter (A-G), optional #, and a number
  const notePattern = /^([a-gA-G])(#?)(-?\d+)$/;
  const match = normalizedNote.match(notePattern);

  if (!match) return null;

  const [, note, accidental, octaveStr] = match;
  const octave = parseInt(octaveStr);

  // Convert note to index in the noteNames array
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  let noteIndex = noteNames.findIndex(n => n.toUpperCase() === (note.toUpperCase() + accidental));

  if (noteIndex === -1) return null;

  // Calculate MIDI pitch: (octave + 1) * 12 + noteIndex
  return (octave + 1) * 12 + noteIndex;
}

/**
 * Extract pitch information from filename
 */
export function extractPitchFromFilename(filename: string): number | null {
  // Remove file extension and path
  const baseName = filename.split('/').pop()?.split('.')[0].toLowerCase() || '';

  // Try to match common patterns for note names in filenames
  // Pattern 1: note directly in filename (e.g., "a4.wav", "c#3.mp3")
  const directMatch = baseName.match(/^([a-g][#b]?-?\d+)/i);
  if (directMatch) {
    return getMidiPitch(directMatch[1]);
  }

  // Pattern 2: note with separators (e.g., "note_a4.wav", "sample-c#3.mp3")
  const separatorMatch = baseName.match(/[_\-\s]([a-g][#b]?-?\d+)(?:[_\-\s]|$)/i);
  if (separatorMatch) {
    return getMidiPitch(separatorMatch[1]);
  }

  // Pattern 3: note at the end (e.g., "meow_a4.wav", "cat-c#3.mp3")
  const endMatch = baseName.match(/([a-g][#b]?-?\d+)$/i);
  if (endMatch) {
    return getMidiPitch(endMatch[1]);
  }

  return null;
}

/**
 * Generate an array of all 128 MIDI pitches (0-127)
 */
export function getAllMidiPitches(): number[] {
  return Array.from({ length: 128 }, (_, i) => i);
}