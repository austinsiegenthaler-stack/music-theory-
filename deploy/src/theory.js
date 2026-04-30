export const KEYS = [
  "C",
  "G",
  "D",
  "A",
  "E",
  "B",
  "F#",
  "C#",
  "F",
  "Bb",
  "Eb",
  "Ab",
  "Db",
  "Gb",
  "Cb",
];

const MAJOR_SCALES = {
  C: ["C", "D", "E", "F", "G", "A", "B"],
  G: ["G", "A", "B", "C", "D", "E", "F#"],
  D: ["D", "E", "F#", "G", "A", "B", "C#"],
  A: ["A", "B", "C#", "D", "E", "F#", "G#"],
  E: ["E", "F#", "G#", "A", "B", "C#", "D#"],
  B: ["B", "C#", "D#", "E", "F#", "G#", "A#"],
  "F#": ["F#", "G#", "A#", "B", "C#", "D#", "E#"],
  "C#": ["C#", "D#", "E#", "F#", "G#", "A#", "B#"],
  F: ["F", "G", "A", "Bb", "C", "D", "E"],
  Bb: ["Bb", "C", "D", "Eb", "F", "G", "A"],
  Eb: ["Eb", "F", "G", "Ab", "Bb", "C", "D"],
  Ab: ["Ab", "Bb", "C", "Db", "Eb", "F", "G"],
  Db: ["Db", "Eb", "F", "Gb", "Ab", "Bb", "C"],
  Gb: ["Gb", "Ab", "Bb", "Cb", "Db", "Eb", "F"],
  Cb: ["Cb", "Db", "Eb", "Fb", "Gb", "Ab", "Bb"],
};

const DEGREE_META = [
  { roman: "I", quality: "major", suffix: "", seventh: "maj7", upper: "maj13", functionName: "tonic" },
  { roman: "ii", quality: "minor", suffix: "m", seventh: "m7", upper: "m11", functionName: "subdominant" },
  { roman: "iii", quality: "minor", suffix: "m", seventh: "m7", upper: "m7(11)", functionName: "tonic" },
  { roman: "IV", quality: "major", suffix: "", seventh: "maj7", upper: "maj9", functionName: "subdominant" },
  { roman: "V", quality: "major", suffix: "", seventh: "7", upper: "13", functionName: "dominant" },
  { roman: "vi", quality: "minor", suffix: "m", seventh: "m7", upper: "m9", functionName: "tonic" },
  { roman: "vii°", quality: "diminished", suffix: "dim", seventh: "m7b5", upper: "m7b5(11)", functionName: "dominant" },
];

export const PROGRESSIONS = [
  {
    name: "Axis",
    degrees: [1, 5, 6, 4],
    feel: "steady, open, familiar",
    why: "Tonic gives you home, V adds pull, vi softens the landing, and IV opens the door back around.",
    examples: "Heard in countless pop and folk songs, including the family of songs around “Let It Be” and “No Woman, No Cry.”",
  },
  {
    name: "Doo-wop",
    degrees: [1, 6, 4, 5],
    feel: "nostalgic, circular, singable",
    why: "I and vi share two notes, so the first move feels gentle. IV broadens the harmony before V points back home.",
    examples: "A classic 1950s and early rock movement used across ballads and standards.",
  },
  {
    name: "Jazz Cadence",
    degrees: [2, 5, 1],
    feel: "polished, resolved, conversational",
    why: "ii prepares the dominant. V creates the strongest tension. I releases it cleanly.",
    examples: "The backbone of jazz standards, turnarounds, and many bridge sections.",
  },
  {
    name: "Folk Lift",
    degrees: [1, 4, 5, 1],
    feel: "plainspoken, bright, grounded",
    why: "It moves from home to lift, then tension, then home again. Simple, useful, and sturdy.",
    examples: "A foundation for country, gospel, bluegrass, folk, and early rock writing.",
  },
  {
    name: "Minor Color",
    degrees: [6, 4, 1, 5],
    feel: "reflective, cinematic, hopeful",
    why: "Starting on vi makes the key feel more vulnerable, while IV, I, and V keep it anchored in major.",
    examples: "Common in modern pop, worship, film cues, and emotional singer-songwriter choruses.",
  },
];

export function getScale(key) {
  return MAJOR_SCALES[key] || MAJOR_SCALES.C;
}

export function buildChords(key) {
  const scale = getScale(key);

  return DEGREE_META.map((meta, index) => {
    const triad = [scale[index], scale[(index + 2) % 7], scale[(index + 4) % 7]];
    const seventh = [...triad, scale[(index + 6) % 7]];
    const upper = [...seventh, scale[(index + 1) % 7], scale[(index + 3) % 7], scale[(index + 5) % 7]];

    return {
      degree: index + 1,
      root: scale[index],
      name: `${scale[index]}${meta.suffix}`,
      seventhName: `${scale[index]}${meta.seventh}`,
      upperName: `${scale[index]}${meta.upper}`,
      tones: { triads: triad, sevenths: seventh, upper },
      ...meta,
    };
  });
}

export function chordForDegree(chords, degree) {
  return chords[(degree - 1 + 7) % 7];
}

export function randomProgression() {
  const starts = [1, 6];
  const middles = [
    [4, 5],
    [2, 5],
    [4, 1],
    [6, 4],
    [3, 6],
  ];
  const start = starts[Math.floor(Math.random() * starts.length)];
  const middle = middles[Math.floor(Math.random() * middles.length)];
  const end = Math.random() > 0.45 ? 1 : 5;
  return {
    name: "Fresh Draw",
    degrees: [start, ...middle, end],
    feel: "musical, usable, slightly less expected",
    why: "The progression keeps a clear major-key center while mixing stable chords with pre-dominant and dominant movement.",
    examples: "Good raw material for verses, bridges, and writing-room experiments.",
  };
}
