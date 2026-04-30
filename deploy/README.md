# Music Theory Map

A lightweight, static web tool for exploring major keys, diatonic chords, chord functions, common progressions, instrument layouts, and basic playback.

## What is included

- Major key selector with correctly spelled scales.
- Diatonic chord map for I, ii, iii, IV, V, vi, and vii diminished.
- Triads, seventh chords, and upper-extension views.
- Functional harmony grouping for tonic, subdominant, and dominant chords.
- Common and random progression generator with lock-key behavior.
- Piano, guitar, and banjo note visualizations.
- Click-to-hear chords and looped progression playback.
- Short “Why it works” explanations for practical songwriting use.

## Run locally

Open `index.html` through any static file server.

Example:

```sh
python3 -m http.server 4173
```

Then visit `http://localhost:4173`.

## Future hooks

These are intentionally planned but not built into the first version:

- Modal interchange and borrowed chords.
- Secondary dominants.
- User-saved progressions.
- MIDI export.
