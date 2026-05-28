import { useEffect, useRef } from "react";

export function useAmbientAudio(running: boolean, volume: number) {
    const audioCtxRef = useRef<AudioContext | null>(null);
    const gainRef = useRef<GainNode | null>(null);

    useEffect(() => {
        const ctx = new AudioContext();
        const masterGain = ctx.createGain();
        masterGain.gain.value = 0.4;
        masterGain.connect(ctx.destination);
        audioCtxRef.current = ctx;
        gainRef.current = masterGain;

        const CROSSFADE = 3;
        let timerId: ReturnType<typeof setTimeout> | null = null;

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
            segGain.connect(masterGain);

            segGain.gain.setValueAtTime(0, when);
            segGain.gain.linearRampToValueAtTime(1, when + fadeInDur);
            segGain.gain.setValueAtTime(1, when + buffer.duration - CROSSFADE);
            segGain.gain.linearRampToValueAtTime(0, when + buffer.duration);

            source.start(when);
            source.stop(when + buffer.duration);

            const nextWhen = when + buffer.duration - CROSSFADE;
            const delayMs = (nextWhen - ctx.currentTime) * 1000 - 200;
            timerId = setTimeout(
                () => schedule(buffer, nextWhen, CROSSFADE),
                Math.max(0, delayMs),
            );
        };

        const startAudio = (decoded: AudioBuffer) =>
            schedule(decoded, ctx.currentTime, 2);

        fetch("/audios/cabin.mp3")
            .then((r) => r.arrayBuffer())
            .then((buf) => ctx.decodeAudioData(buf))
            .then((decoded) => {
                if (ctx.state === "suspended") {
                    const resume = () => {
                        ctx.resume().then(() => startAudio(decoded));
                        window.removeEventListener("pointerdown", resume);
                        window.removeEventListener("keydown", resume);
                    };
                    window.addEventListener("pointerdown", resume, {
                        once: true,
                    });
                    window.addEventListener("keydown", resume, { once: true });
                } else {
                    startAudio(decoded);
                }
            })
            .catch(() => {});

        return () => {
            if (timerId !== null) clearTimeout(timerId);
            ctx.close();
        };
    }, []);

    useEffect(() => {
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
