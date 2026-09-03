// ZzFX - Zuper Zmall Zound Zynth - Micro Edition
// MIT License - Copyright 2019 Frank Force
// https://github.com/KilledByAPixel/ZzFX

const zzfx = (...z)=> zzfxP(zzfxG(...z));
const zzfxV = .3;
const zzfxR = 44100;
const zzfxX = typeof AudioContext !== 'undefined' ? new AudioContext : null;
const zzfxP = (...samples)=>
{
    if (!zzfxX) return;
    let buffer = zzfxX.createBuffer(samples.length, samples[0].length, zzfxR),
        source = zzfxX.createBufferSource();

    samples.map((d,i)=> buffer.getChannelData(i).set(d));
    source.buffer = buffer;
    source.connect(zzfxX.destination);
    source.start();
    return source;
}
const zzfxG =
(
    volume = 1, randomness = .05, frequency = 220, attack = 0, sustain = 0,
    release = .1, shape = 0, shapeCurve = 1, slide = 0, deltaSlide = 0,
    pitchJump = 0, pitchJumpTime = 0, repeatTime = 0, noise = 0, modulation = 0,
    bitCrush = 0, delay = 0, sustainVolume = 1, decay = 0, tremolo = 0, filter = 0
)=>
{
    let PI2 = Math.PI*2, sign = v => v<0?-1:1,
        startSlide = slide *= 500 * PI2 / zzfxR / zzfxR,
        startFrequency = frequency *=
            (1 + randomness*2*Math.random() - randomness) * PI2 / zzfxR,
        b=[], t=0, tm=0, i=0, j=1, r=0, c=0, s=0, f, length,

        quality = 2, w = PI2 * Math.abs(filter) * 2 / zzfxR,
        cos = Math.cos(w), alpha = Math.sin(w) / 2 / quality,
        a0 = 1 + alpha, a1 = -2*cos / a0, a2 = (1 - alpha) / a0,
        b0 = (1 + sign(filter) * cos) / 2 / a0,
        b1 = -(sign(filter) + cos) / a0, b2 = b0,
        x2 = 0, x1 = 0, y2 = 0, y1 = 0;

    attack = attack * zzfxR + 9;
    decay *= zzfxR;
    sustain *= zzfxR;
    release *= zzfxR;
    delay *= zzfxR;
    deltaSlide *= 500 * PI2 / zzfxR**3;
    modulation *= PI2 / zzfxR;
    pitchJump *= PI2 / zzfxR;
    pitchJumpTime *= zzfxR;
    repeatTime = repeatTime * zzfxR | 0;
    volume *= zzfxV;

    for(length = attack + decay + sustain + release + delay | 0;
        i < length; b[i++] = s * volume)
    {
        if (!(++c%(bitCrush*100|0)))
        {
            s = shape? shape>1? shape>2? shape>3?
                Math.sin(t**3) :
                Math.max(Math.min(Math.tan(t),1),-1):
                1-(2*t/PI2%2+2)%2:
                1-4*Math.abs(Math.round(t/PI2)-t/PI2):
                Math.sin(t);

            s = (repeatTime ?
                    1 - tremolo + tremolo*Math.sin(PI2*i/repeatTime)
                    : 1) *
                sign(s)*(Math.abs(s)**shapeCurve) *
                (i < attack ? i/attack :
                i < attack + decay ?
                1-((i-attack)/decay)*(1-sustainVolume) :
                i < attack  + decay + sustain ?
                sustainVolume :
                i < length - delay ?
                (length - i - delay)/release *
                sustainVolume :
                0);

            s = delay ? s/2 + (delay > i ? 0 :
                (i<length-delay? 1 : (length-i)/delay) *
                b[i-delay|0]/2/volume) : s;

            if (filter)
                s = y1 = b2*x2 + b1*(x2=x1) + b0*(x1=s) - a2*y2 - a1*(y2=y1);
        }

        f = (frequency += slide += deltaSlide) *
            Math.cos(modulation*tm++);
        t += f + f*noise*Math.sin(i**5);

        if (j && ++j > pitchJumpTime)
        {
            frequency += pitchJump;
            startFrequency += pitchJump;
            j = 0;
        }

        if (repeatTime && !(++r % repeatTime))
        {
            frequency = startFrequency;
            slide = startSlide;
            j = j || 1;
        }
    }

    return b;
}
