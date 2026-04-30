import { KEYS, PROGRESSIONS, buildChords, chordForDegree, getScale, randomProgression } from "./theory.js";
import { playChord, playProgression, stopLoop } from "./audio.js";

const state = {
  key: "C",
  layer: "triads",
  instrument: "piano",
  selectedChord: null,
  progression: PROGRESSIONS[0],
};

const $ = (selector) => document.querySelector(selector);

const keySelect = $("#keySelect");
const scaleTitle = $("#scaleTitle");
const scaleNotes = $("#scaleNotes");
const chordGrid = $("#chordGrid");
const instrumentTitle = $("#instrument-title");
const selectedChordLabel = $("#selectedChordLabel");
const instrumentView = $("#instrumentView");
const progressionStrip = $("#progressionStrip");
const whyBox = $("#whyBox");
const lockKey = $("#lockKey");

KEYS.forEach((key) => {
  const option = document.createElement("option");
  option.value = key;
  option.textContent = key;
  keySelect.append(option);
});

function activeChords() {
  return buildChords(state.key);
}

function chordDisplayName(chord) {
  if (state.layer === "sevenths") return chord.seventhName;
  if (state.layer === "upper") return chord.upperName;
  return chord.name;
}

function renderScale() {
  const scale = getScale(state.key);
  scaleTitle.textContent = `${state.key} major`;
  scaleNotes.innerHTML = scale.map((note, index) => `<span><strong>${index + 1}</strong>${note}</span>`).join("");
}

function renderChords() {
  const chords = activeChords();
  chordGrid.innerHTML = "";

  chords.forEach((chord) => {
    const card = document.createElement("button");
    card.className = "chord-card";
    if (state.selectedChord?.degree === chord.degree) card.classList.add("selected");
    card.type = "button";
    card.innerHTML = `
      <span class="roman">${chord.roman}</span>
      <strong>${chordDisplayName(chord)}</strong>
      <span class="quality">${chord.quality}</span>
      <span class="tones">${chord.tones[state.layer].join(" · ")}</span>
    `;
    card.addEventListener("click", () => {
      state.selectedChord = chord;
      playChord(chord.tones[state.layer]);
      renderAll();
    });
    chordGrid.append(card);
  });

  renderFunctionGroups(chords);
}

function renderFunctionGroups(chords) {
  ["tonic", "subdominant", "dominant"].forEach((functionName) => {
    const container = $(`#${functionName}Group`);
    container.innerHTML = chords
      .filter((chord) => chord.functionName === functionName)
      .map((chord) => `<span>${chord.roman} ${chord.name}</span>`)
      .join("");
  });
}

function renderProgression() {
  const chords = state.progression.degrees.map((degree) => chordForDegree(activeChords(), degree));
  progressionStrip.innerHTML = "";

  chords.forEach((chord) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "progression-chord";
    item.innerHTML = `<span>${chord.roman}</span><strong>${chordDisplayName(chord)}</strong>`;
    item.addEventListener("click", () => {
      state.selectedChord = chord;
      playChord(chord.tones[state.layer]);
      renderAll();
    });
    progressionStrip.append(item);
  });

  whyBox.innerHTML = `
    <div>
      <p class="progression-name">${state.progression.name}</p>
      <p><strong>Feel:</strong> ${state.progression.feel}</p>
      <p><strong>Why it works:</strong> ${state.progression.why}</p>
      <p><strong>Where you hear it:</strong> ${state.progression.examples}</p>
    </div>
  `;
}

function renderInstrument() {
  const notes = state.selectedChord ? state.selectedChord.tones[state.layer] : getScale(state.key);
  instrumentTitle.textContent = state.instrument[0].toUpperCase() + state.instrument.slice(1);
  selectedChordLabel.textContent = state.selectedChord
    ? `${chordDisplayName(state.selectedChord)}: ${notes.join(" · ")}`
    : `Showing ${state.key} major.`;

  if (state.instrument === "piano") {
    renderPiano(notes);
  } else {
    renderFretboard(notes, state.instrument);
  }
}

function normalize(note) {
  const equivalents = {
    "B#": "C",
    Db: "C#",
    Eb: "D#",
    Fb: "E",
    "E#": "F",
    Gb: "F#",
    Ab: "G#",
    Bb: "A#",
    Cb: "B",
  };
  return equivalents[note] || note;
}

function noteMatches(note, notes) {
  return notes.map(normalize).includes(normalize(note));
}

function renderPiano(notes) {
  const white = ["C", "D", "E", "F", "G", "A", "B"];
  const black = [
    { note: "C#", pos: 0 },
    { note: "D#", pos: 1 },
    { note: "F#", pos: 3 },
    { note: "G#", pos: 4 },
    { note: "A#", pos: 5 },
  ];
  instrumentView.innerHTML = `
    <div class="piano">
      <div class="white-keys">
        ${white
          .map((note) => `<div class="white-key ${noteMatches(note, notes) ? "lit" : ""}"><span>${note}</span></div>`)
          .join("")}
      </div>
      <div class="black-keys">
        ${black
          .map(
            ({ note, pos }) =>
              `<div class="black-key ${noteMatches(note, notes) ? "lit" : ""}" style="left: calc(${pos} * (100% / 7) + 9.7%);"><span>${note}</span></div>`,
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderFretboard(notes, instrument) {
  const tunings = {
    guitar: ["E", "B", "G", "D", "A", "E"],
    banjo: ["D", "B", "G", "D", "G"],
  };
  const chromatic = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const strings = tunings[instrument];
  const frets = Array.from({ length: 13 }, (_, index) => index);

  instrumentView.innerHTML = `
    <div class="fretboard ${instrument}">
      <div class="fret-numbers">${frets.map((fret) => `<span>${fret}</span>`).join("")}</div>
      ${strings
        .map((openNote) => {
          const openIndex = chromatic.indexOf(normalize(openNote));
          return `
            <div class="string-row">
              ${frets
                .map((fret) => {
                  const note = chromatic[(openIndex + fret) % 12];
                  const lit = noteMatches(note, notes);
                  return `<span class="fret ${lit ? "lit" : ""}">${lit ? note : ""}</span>`;
                })
                .join("")}
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderAll() {
  renderScale();
  renderChords();
  renderProgression();
  renderInstrument();
}

keySelect.addEventListener("change", (event) => {
  state.key = event.target.value;
  state.selectedChord = null;
  stopLoop();
  renderAll();
});

document.querySelectorAll("[data-extension]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-extension]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    state.layer = button.dataset.extension;
    stopLoop();
    renderAll();
  });
});

document.querySelectorAll("[data-instrument]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-instrument]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    state.instrument = button.dataset.instrument;
    renderInstrument();
  });
});

$("#commonProgression").addEventListener("click", () => {
  state.progression = PROGRESSIONS[Math.floor(Math.random() * PROGRESSIONS.length)];
  stopLoop();
  renderAll();
});

$("#randomProgression").addEventListener("click", () => {
  if (!lockKey.checked) {
    state.key = KEYS[Math.floor(Math.random() * KEYS.length)];
    keySelect.value = state.key;
  }
  state.progression = randomProgression();
  state.selectedChord = null;
  stopLoop();
  renderAll();
});

$("#playProgression").addEventListener("click", () => {
  const chords = state.progression.degrees.map((degree) => chordForDegree(activeChords(), degree));
  playProgression(chords, state.layer);
});

$("#stopProgression").addEventListener("click", stopLoop);

renderAll();
