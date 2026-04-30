const NOTE_TO_SEMITONE = {
  C: 0,
  "B#": 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  Fb: 4,
  "E#": 5,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
  Cb: 11,
};

let audioContext;
let loopTimers = [];

function getContext() {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

function noteFrequency(note, octave = 4) {
  const semitone = NOTE_TO_SEMITONE[note];
  const midi = (octave + 1) * 12 + semitone;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function scheduleTone(context, frequency, start, duration, gainValue) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(frequency, start);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1300, start);

  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.05);
}

export function stopLoop() {
  loopTimers.forEach((timer) => clearTimeout(timer));
  loopTimers = [];
}

export function playChord(notes, duration = 1.25, when = 0) {
  const context = getContext();
  const start = context.currentTime + when;
  const sortedNotes = notes.map((note, index) => {
    const semitone = NOTE_TO_SEMITONE[note];
    const octave = index > 2 ? 5 : 4;
    return { note, semitone, octave };
  });

  sortedNotes.forEach(({ note, octave }, index) => {
    scheduleTone(context, noteFrequency(note, octave), start + index * 0.018, duration, 0.13);
  });
}

export function playProgression(chords, layer) {
  stopLoop();
  const beat = 1.35;
  const cycle = () => {
    chords.forEach((chord, index) => {
      playChord(chord.tones[layer], 1.15, index * beat);
    });
    const timer = setTimeout(cycle, chords.length * beat * 1000);
    loopTimers.push(timer);
  };

  cycle();
}
