// ZzFXM (Zuper Zmall Zound Zynth Music)
const zzfxM = (instruments, patterns, sequence, BPM = 125) => {
    let sampleRate = 44100;
    let beat = sampleRate / (BPM / 60) / 4;
    let fullAudio = [];

    for (let trackIdx = 0; trackIdx < sequence.length; trackIdx++) {
        let curSeq = sequence[trackIdx];
        let patternIdx = 0;
        for (let patId of curSeq) {
            let pat = patterns[patId];
            if (pat) {
                let instr = instruments[pat[0]];
                for (let step = 1; step < pat.length; step++) {
                    let note = pat[step];
                    if (note) {
                        let freq = 440 * 2 ** ((note - 69) / 12);
                        let instrParams = [...instr];
                        instrParams[2] = freq;
                        let samples = zzfxG(...instrParams);
                        let startSample = Math.floor((patternIdx * (pat.length - 1) + step - 1) * beat);
                        for (let s = 0; s < samples.length; s++) {
                            fullAudio[startSample + s] = (fullAudio[startSample + s] || 0) + samples[s];
                        }
                    }
                }
            }
            patternIdx++;
        }
    }
    return fullAudio;
};

// Chill Assamese Bihu Folk Chiptune Song Data (Bahi Bamboo Flute, Mellow Dhol, Soft Toka, Warm Ektara)
const SONG_INSTRUMENTS = [
    [0.22, 0, 440, 0.02, 0.08, 0.14, 1, 1.0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.75], // 0: Bahi (Warm Bamboo Flute / Melodic Lead)
    [0.32, 0, 82, 0.008, 0.05, 0.16, 0, 1.2, -3],                              // 1: Mellow Dhol (Deep Warm Folk Bass Drum)
    [0.12, 0, 260, 0.005, 0.015, 0.03, 4, 1.4, -10],                           // 2: Soft Toka / Shaker Percussion
    [0.22, 0, 220, 0.015, 0.08, 0.15, 0, 1.0]                                  // 3: Warm Ektara / Plucked Folk Bass
];

// 16-step patterns: [InstrumentIndex, ...16 note MIDI values (0 = rest)]
// A-Major Bihu Pentatonic: 69=A4, 71=B4, 73=C#5, 76=E5, 78=F#5, 81=A5
const SONG_PATTERNS = [
    // 0: Relaxed Pastoral Flute Melody A
    [0, 69, 0, 0, 73, 0, 76, 0, 78, 0, 76, 0, 73, 0, 69, 0, 0],
    // 1: Flowing Bihu Flute Melody B
    [0, 76, 0, 78, 0, 81, 0, 78, 0, 76, 0, 73, 0, 76, 0, 69, 0],
    // 2: Gentle High Air C
    [0, 81, 0, 0, 78, 0, 76, 0, 78, 0, 76, 0, 73, 0, 71, 0, 0],
    // 3: Warm Cadence D
    [0, 69, 0, 73, 0, 76, 0, 78, 0, 76, 0, 73, 0, 71, 0, 69, 0],

    // 4: Laid-back Dhol Thump A
    [1, 45, 0, 0, 0, 45, 0, 0, 45, 0, 0, 45, 0, 0, 45, 0, 0],
    // 5: Laid-back Dhol Thump B
    [1, 45, 0, 0, 45, 0, 0, 45, 0, 45, 0, 0, 45, 0, 0, 45, 0],

    // 6: Gentle Toka Offbeats
    [2, 0, 0, 60, 0, 0, 0, 60, 0, 0, 0, 60, 0, 0, 60, 0, 0],
    // 7: Toka Shaker Pulse
    [2, 0, 60, 0, 60, 0, 60, 0, 60, 0, 60, 0, 60, 0, 60, 60, 0],

    // 8: Warm Ektara Bass A
    [3, 45, 0, 0, 0, 49, 0, 0, 0, 45, 0, 0, 0, 52, 0, 0, 0],
    // 9: Warm Ektara Bass B
    [3, 45, 0, 0, 0, 54, 0, 0, 0, 52, 0, 0, 0, 45, 0, 49, 0]
];

const SONG_SEQUENCE = [
    [0, 1, 2, 3, 0, 1, 2, 3], // Flute / Lead
    [8, 9, 8, 9, 8, 9, 8, 9], // Bass
    [4, 5, 4, 5, 4, 5, 4, 5], // Dhol
    [6, 7, 6, 7, 6, 7, 6, 7]  // Shaker
];

let songGainNode;

playSong = () => {
    if (!zzfxX || songGainNode) return;
    try {
        const samples = zzfxM(SONG_INSTRUMENTS, SONG_PATTERNS, SONG_SEQUENCE, 112);
        const buffer = zzfxX.createBuffer(1, samples.length, 44100);
        buffer.getChannelData(0).set(samples);
        const source = zzfxX.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        songGainNode = zzfxX.createGain();
        songGainNode.gain.value = SONG_VOLUME;
        source.connect(songGainNode);
        songGainNode.connect(zzfxX.destination);
        source.start();
        setSongVolume = (x) => { if (songGainNode) songGainNode.gain.value = x * SONG_VOLUME; };
    } catch {}
};

setSongVolume = () => 0;
