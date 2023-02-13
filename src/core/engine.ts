import { Music1Effect } from "../effect/music-1.effect";
import { Music2Effect } from "../effect/music-2.effect";
import { Music3Effect } from "../effect/music-3.effect";

declare const electronAPI: any;

export class Engine {

	private e1?: Music1Effect;
	private e2?: Music2Effect;
	private e3?: Music3Effect;

	private source!: MediaStreamAudioSourceNode;
	private analyser!: AnalyserNode;
	private voiceHigh!: Uint8Array;

	private currentState = true;
	private frameTime = 0;

	constructor(
		private option: {
			e1?: HTMLDivElement,
			e2?: HTMLDivElement,
			e3?: HTMLDivElement,
		}
	) {
		this.open();
		electronAPI.handleEffectState((event: any, value: boolean) => {
			if (this.currentState != value) {
				this.currentState = value;
				value ? this.open() : this.close();
			}
		});
	}

	// 打开效果
	private open(): void {
		this.e1 = this.option.e1 ? new Music1Effect(this.option.e1) : undefined;
		this.e2 = this.option.e2 ? new Music2Effect(this.option.e2) : undefined;
		this.e3 = this.option.e3 ? new Music3Effect(this.option.e3) : undefined;
		this.hook();
	}

	// 关闭效果
	private close(): void {
		this.e1?.destroy();
		this.source.disconnect(this.analyser);
	}

	private hook(): void {
		navigator.mediaDevices.getUserMedia({
			audio: {
				// @ts-ignore
				mandatory: { chromeMediaSource: 'desktop' }
			},
			video: {
				// @ts-ignore
				mandatory: { chromeMediaSource: 'desktop' }
			}
		}).then(stream => {
			let context = new AudioContext();
			this.source = context.createMediaStreamSource(stream);
			this.analyser = context.createAnalyser();
			this.analyser.fftSize = 2048;
			this.source.connect(this.analyser);
			let bufferLength = this.analyser.frequencyBinCount;
			this.voiceHigh = new Uint8Array(bufferLength);
			this.loop(0);
		});
	}

	private loop(e: number) {
		if (e - this.frameTime >= 1000 / 60) {
			this.frameTime = e;
			this.render();
		}
		requestAnimationFrame((e1: number) => {
			if (this.currentState) {
				this.loop(e1);
			}
		});
	}

	private render(): void {
		this.analyser.getByteFrequencyData(this.voiceHigh);
		this.e1?.update(this.voiceHigh);
	}

}
