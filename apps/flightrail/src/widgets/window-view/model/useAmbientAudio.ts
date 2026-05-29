import { useEffect, useRef } from "react";

const CROSSFADE = 3;

export function useAmbientAudio(
    running: boolean,
    departing: boolean,
    volume: number,
) {
    const audioCtxRef = useRef<AudioContext | null>(null);
    const gainRef = useRef<GainNode | null>(null);
    const decodedRef = useRef<AudioBuffer | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const startedRef = useRef(false);

    useEffect(() => {
        const ctx = new AudioContext();
        const masterGain = ctx.createGain();
        masterGain.gain.value = 0;
        masterGain.connect(ctx.destination);
        audioCtxRef.current = ctx;
        gainRef.current = masterGain;

        fetch("/audios/cabin.mp3")
            .then((r) => r.arrayBuffer())
            .then((buf) => ctx.decodeAudioData(buf))
            .then((decoded) => {
                decodedRef.current = decoded;
            })
            .catch(() => {});

        return () => {
            if (timerRef.current !== null) clearTimeout(timerRef.current);
            ctx.close();
        };
    }, []);

    // Start audio the first time departing or running becomes true
    useEffect(() => {
        if (!departing && !running) return;

        const ctx = audioCtxRef.current;
        const gain = gainRef.current;
        if (!ctx || !gain || startedRef.current) return;
        startedRef.current = true;

        // departing=true means takeoff animation just started (1.1s before running=true)
        const fadeInS = departing ? 1.1 : 0.2;

        const schedule = (
            buffer: AudioBuffer,
            when: number,
            fadeInDur: number,
        ) => {
            if (ctx.state === "closed") return;
            const source = ctx.createBufferSource();
            const segGain = ctx.createGain();
            source.buffer = buffer;
            source.connect(segGain);
            segGain.connect(gain);

            segGain.gain.setValueAtTime(0, when);
            segGain.gain.linearRampToValueAtTime(1, when + fadeInDur);
            segGain.gain.setValueAtTime(1, when + buffer.duration - CROSSFADE);
            segGain.gain.linearRampToValueAtTime(0, when + buffer.duration);

            source.start(when);
            source.stop(when + buffer.duration);

            const nextWhen = when + buffer.duration - CROSSFADE;
            const delayMs = (nextWhen - ctx.currentTime) * 1000 - 200;
            timerRef.current = setTimeout(
                () => schedule(buffer, nextWhen, CROSSFADE),
                Math.max(0, delayMs),
            );
        };

        const doStart = () => {
            const decoded = decodedRef.current;
            if (!decoded) return;
            gain.gain.cancelScheduledValues(ctx.currentTime);
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(
                volume * 0.4,
                ctx.currentTime + fadeInS,
            );
            schedule(decoded, ctx.currentTime, fadeInS);
        };

        if (ctx.state === "suspended") {
            ctx.resume().then(doStart);
        } else {
            doStart();
        }
    }, [departing, running]); // intentionally omits volume — only used for initial fade-in amplitude

    // Adjust gain on pause/resume/volume change after audio has started
    useEffect(() => {
        if (!startedRef.current) return;

        const ctx = audioCtxRef.current;
        const gain = gainRef.current;
        if (!ctx || !gain) return;

        gain.gain.cancelScheduledValues(ctx.currentTime);
        gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);

        if (!running) {
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
        } else {
            gain.gain.linearRampToValueAtTime(
                volume * 0.4,
                ctx.currentTime + 0.1,
            );
        }
    }, [running, volume]);
}
