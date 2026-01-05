
/**
 * Retro SFX Service
 * Synthesizes 8-bit sounds using Web Audio API
 */

class AudioService {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;

    private init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.15; // Global volume
            this.masterGain.connect(this.ctx.destination);
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    private createOscillator(type: OscillatorType, freq: number, duration: number, volume: number) {
        if (!this.ctx || !this.masterGain) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    // --- Retro Sound Presets ---

    public playPour() {
        this.init();
        if (!this.ctx) return;

        // High-pitched blips for liquid flow
        const now = this.ctx.currentTime;
        for (let i = 0; i < 3; i++) {
            const time = now + i * 0.1;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440 + Math.random() * 200, time);
            gain.gain.setValueAtTime(0.1, time);
            gain.gain.linearRampToValueAtTime(0, time + 0.1);
            osc.connect(gain);
            gain.connect(this.masterGain!);
            osc.start(time);
            osc.stop(time + 0.1);
        }
    }

    public playIce() {
        this.init();
        if (!this.ctx) return;

        // Low-frequency pulse followed by high-pitched clink
        this.createOscillator('square', 150, 0.1, 0.2); // Thud
        setTimeout(() => this.createOscillator('square', 1200, 0.05, 0.1), 50); // Clink
    }

    public playStir() {
        this.init();
        if (!this.ctx) return;

        // Rising/Falling frequency sweep
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.3);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.6);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.6);

        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start();
        osc.stop(now + 0.6);
    }

    public playShake() {
        this.init();
        if (!this.ctx) return;

        // Noise-like percussion (short bursts)
        const now = this.ctx.currentTime;
        for (let i = 0; i < 4; i++) {
            const time = now + i * 0.15;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(100 + Math.random() * 50, time);

            gain.gain.setValueAtTime(0.2, time);
            gain.gain.linearRampToValueAtTime(0, time + 0.1);

            osc.connect(gain);
            gain.connect(this.masterGain!);
            osc.start(time);
            osc.stop(time + 0.1);
        }
    }

    public playSuccess() {
        this.init();
        if (!this.ctx) return;

        // Arpeggio
        const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        const now = this.ctx.currentTime;

        frequencies.forEach((f, i) => {
            const time = now + i * 0.1;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(f, time);

            gain.gain.setValueAtTime(0.15, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);

            osc.connect(gain);
            gain.connect(this.masterGain!);
            osc.start(time);
            osc.stop(time + 0.3);
        });
    }
}

export const audioService = new AudioService();
