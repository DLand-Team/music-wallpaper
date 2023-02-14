import { C2dEffectContainer } from "./c2d-effect-container";

let DPR: number = window.devicePixelRatio;
let nozokuRate: number = 3.5;

export class Music2d3Effect extends C2dEffectContainer {

	private rt_array: Array<RetAngle> = [];
	private rt_length = 75;
	private voiceHigh?: Uint8Array;

	constructor(dom: HTMLDivElement) {
		super(dom, {
			resize: () => {
				if (this.containerHeight >= 200) {
					nozokuRate = 3.5;
				} else if (this.containerHeight >= 170 && this.containerHeight < 200) {
					nozokuRate = 4;
				} else {
					nozokuRate = 5;
				}
				if (this.ctx != null) {
					this.ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
				}
				for (let i = 0; i < this.rt_array.length; i++) {
					this.rt_array[i].resize(this.rt_length);
				}
				if (this.voiceHigh != null) {
					this.update(this.voiceHigh);
				}
			},
		});
		this.init();
	}

	private init(): void {
		this.setup();
	}

	private setup(): void {
		if (this.canvas == null || this.ctx == null) {
			return;
		}
		this.ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
		let aw = this.canvas.width / this.rt_length / 2;
		let w = aw - 3 * DPR;
		for (let i = 0; i < this.rt_length; i++) {
			this.rt_array.push(new RetAngle(
				this.canvas, this.ctx,
				w, // width
				5 * DPR, // height
				i * aw, // x
				this.canvas.height / 2, // y
				i,
			))
		}
	}

	public update(voiceHigh: Uint8Array): void {
		this.voiceHigh = voiceHigh;
		if (this.canvas == null || this.ctx == null) {
			return;
		}
		let step = Math.round(voiceHigh.length / this.rt_length);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for (let i = 0; i < this.rt_array.length; i++) {
			let rt = this.rt_array[i];
			rt.update(voiceHigh[step * i]);
		}
	}

}

class RetAngle {

	jg: number = 2 * DPR;
	power: number = 0;
	num: number = 0;

	constructor(
		private canvas: HTMLCanvasElement,
		private ctx: CanvasRenderingContext2D,
		public w: number,
		public h: number,
		public x: number,
		public y: number,
		public i: number,
	) {
	}

	resize(rt_length: number): void {
		this.jg = 2 * DPR;
		let aw = this.canvas.width / rt_length / 2;
		this.w = aw - 3 * DPR;
		this.h = 5 * DPR;
		this.x = this.i * aw;
		this.y = this.canvas.height / 2;
	}

	update(power: number): void {
		this.power = 5 * power * DPR / nozokuRate;
		this.num = ~~(this.power / this.h + 0.5 * DPR);
		this.draw();
	}

	draw(): void {
		let h = (~~(this.power / (this.h + this.jg))) * (this.h + this.jg);
		let rightX = this.canvas.width / 2 + this.x - this.w / 2;
		let leftX = this.canvas.width / 2 - this.x - this.w / 2;
		// 右上
		this.ctx.fillRect(rightX, this.y - h, this.w, h);
		for (let i = 0; i < this.num; i++) {
			let y = this.y - i * (this.h + this.jg);
			this.ctx.clearRect(rightX - DPR, y, this.w + 2 * DPR, this.jg);
		}
		// 左上
		this.ctx.fillRect(leftX, this.y - h, this.w, h);
		for (let i = 0; i < this.num; i++) {
			let y = this.y - i * (this.h + this.jg);
			this.ctx.clearRect(leftX - DPR, y, this.w + 2 * DPR, this.jg);
		}
		// 右下
		this.ctx.fillRect(rightX, this.canvas.height - this.y, this.w, h);
		for (let i = 0; i < this.num; i++) {
			let y = this.y - i * (this.h + this.jg);
			this.ctx.clearRect(rightX - DPR, this.canvas.height - y, this.w + 2 * DPR, this.jg);
		}
		// 左下
		this.ctx.fillRect(leftX, this.canvas.height - this.y, this.w, h);
		for (let i = 0; i < this.num; i++) {
			let y = this.y - i * (this.h + this.jg);
			this.ctx.clearRect(leftX - DPR, this.canvas.height - y, this.w + 2 * DPR, this.jg);
		}
	}

}
