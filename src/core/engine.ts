import { Music2d1Effect } from "../effect/2d/music-2d-1.effect";
import { Music2d2Effect } from "../effect/2d/music-2d-2.effect";
import { Music2d3Effect } from "../effect/2d/music-2d-3.effect";
import { Music3d1Effect } from "../effect/3d/music-3d-1.effect";

declare const electronAPI: any;

export class Engine {

	private e1_2d?: Music2d1Effect;
	private e2_2d?: Music2d2Effect;
	private e3_2d?: Music2d3Effect;
	private e1_3d?: Music3d1Effect;

	private source!: MediaStreamAudioSourceNode;
	private analyser!: AnalyserNode;
	private voiceHigh!: Uint8Array;

	private eachState = {
		e1_2d: true, e2_2d: true, e3_2d: true,
		e1_3d: true,
	};
	private allState = true;
	private frameTime = 0;

	constructor(
		private option: {
			e1_2d?: HTMLDivElement,
			e2_2d?: HTMLDivElement,
			e3_2d?: HTMLDivElement,
			e1_3d?: HTMLDivElement,
		}
	) {
		this.open();
		electronAPI.handleEachEffectState((event: any, value: { name: string, state: boolean }) => {
			switch (value.name) {
				case '2d-1':
					value.state ? (this.e1_2d = this.option.e1_2d ? new Music2d1Effect(this.option.e1_2d) : undefined) : (this.e1_2d?.destroy());
					this.eachState.e1_2d = value.state;
					break;
				case '2d-2':
					value.state ? (this.e2_2d = this.option.e2_2d ? new Music2d2Effect(this.option.e2_2d) : undefined) : (this.e2_2d?.destroy());
					this.eachState.e2_2d = value.state;
					break;
				case '2d-3':
					value.state ? (this.e3_2d = this.option.e3_2d ? new Music2d3Effect(this.option.e3_2d) : undefined) : (this.e3_2d?.destroy());
					this.eachState.e3_2d = value.state;
					break;
				default:
					break;
			}
		});
		electronAPI.handleAllEffectState((event: any, value: boolean) => {
			if (this.allState != value) {
				this.allState = value;
				value ? this.open() : this.close();
			}
		});
	}

	// 打开效果
	private open(): void {
		this.eachState.e1_2d && (this.e1_2d = this.option.e1_2d ? new Music2d1Effect(this.option.e1_2d) : undefined);
		this.eachState.e2_2d && (this.e2_2d = this.option.e2_2d ? new Music2d2Effect(this.option.e2_2d) : undefined);
		this.eachState.e3_2d && (this.e3_2d = this.option.e3_2d ? new Music2d3Effect(this.option.e3_2d) : undefined);
		this.eachState.e1_3d && (this.e1_3d = this.option.e1_3d ? new Music3d1Effect(this.option.e1_3d) : undefined);
		this.hook();
	}

	// 关闭效果
	private close(): void {
		this.e1_2d?.destroy();
		this.e2_2d?.destroy();
		this.e3_2d?.destroy();
		this.e1_3d?.destroy();
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
			if (this.allState) {
				this.loop(e1);
			}
		});
	}

	private render(): void {
		this.analyser.getByteFrequencyData(this.voiceHigh);
		this.e1_2d?.update(this.voiceHigh);
		this.e2_2d?.update(this.voiceHigh);
		this.e3_2d?.update(this.voiceHigh);
		this.e1_3d?.update(this.voiceHigh);
	}

}
