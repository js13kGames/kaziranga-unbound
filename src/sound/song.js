// Minimal starter chiptune song generated for Sonant-X
SONG = {
  "rowLen": 5513,
  "endPattern": 4,
  "songData": [
    {
      "osc1_oct": 7,
      "osc1_det": 0,
      "osc1_detune": 0,
      "osc1_xenv": 0,
      "osc1_vol": 160,
      "osc1_waveform": 1,
      "osc2_oct": 7,
      "osc2_det": 0,
      "osc2_detune": 5,
      "osc2_xenv": 0,
      "osc2_vol": 100,
      "osc2_waveform": 1,
      "noise_fader": 0,
      "env_attack": 50,
      "env_sustain": 200,
      "env_release": 400,
      "env_master": 180,
      "fx_filter": 2,
      "fx_freq": 3500,
      "fx_resonance": 100,
      "fx_delay_time": 4,
      "fx_delay_amt": 80,
      "fx_pan_freq": 2,
      "fx_pan_amt": 50,
      "lfo_osc1_freq": 0,
      "lfo_fx_freq": 0,
      "lfo_freq": 4,
      "lfo_amt": 15,
      "lfo_waveform": 0,
      "p": [1, 2, 1, 3],
      "c": [
        {
          "n": [140, 0, 144, 0, 147, 0, 144, 0, 152, 0, 147, 0, 144, 0, 140, 0]
        },
        {
          "n": [138, 0, 142, 0, 145, 0, 142, 0, 150, 0, 145, 0, 142, 0, 138, 0]
        },
        {
          "n": [143, 0, 147, 0, 150, 0, 147, 0, 155, 0, 150, 0, 147, 0, 143, 0]
        }
      ]
    },
    {
      "osc1_oct": 5,
      "osc1_det": 0,
      "osc1_detune": 0,
      "osc1_xenv": 0,
      "osc1_vol": 180,
      "osc1_waveform": 2,
      "osc2_oct": 5,
      "osc2_det": 0,
      "osc2_detune": 4,
      "osc2_xenv": 0,
      "osc2_vol": 80,
      "osc2_waveform": 0,
      "noise_fader": 0,
      "env_attack": 10,
      "env_sustain": 400,
      "env_release": 400,
      "env_master": 180,
      "fx_filter": 1,
      "fx_freq": 900,
      "fx_resonance": 80,
      "fx_delay_time": 0,
      "fx_delay_amt": 0,
      "fx_pan_freq": 0,
      "fx_pan_amt": 0,
      "lfo_osc1_freq": 0,
      "lfo_fx_freq": 0,
      "lfo_freq": 0,
      "lfo_amt": 0,
      "lfo_waveform": 0,
      "p": [1, 2, 1, 3],
      "c": [
        {
          "n": [116, 0, 0, 0, 116, 0, 0, 0, 116, 0, 0, 0, 116, 0, 0, 0]
        },
        {
          "n": [114, 0, 0, 0, 114, 0, 0, 0, 114, 0, 0, 0, 114, 0, 0, 0]
        },
        {
          "n": [119, 0, 0, 0, 119, 0, 0, 0, 119, 0, 0, 0, 119, 0, 0, 0]
        }
      ]
    }
  ],
  "songLen": 4
};

playSong = () => {
    try {
        new MusicGenerator(SONG).createAudioBuffer(buffer => {
            if (!audioCtx) return;
            const source = audioCtx.createBufferSource();
            source.buffer = buffer;
            source.loop = true;

            const gainNode = audioCtx.createGain();
            gainNode.connect(audioCtx.destination);
            source.connect(gainNode);
            source.nomangle(start)();

            playSong = () => 0;
            setSongVolume = (x) => gainNode.gain.value = x * SONG_VOLUME;
            setSongVolume(1);
        });
    } catch {
        // Audio playback fallback
    }
};

setSongVolume = () => 0;
