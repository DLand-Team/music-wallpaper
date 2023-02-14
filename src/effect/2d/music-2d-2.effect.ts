import { C2dEffectContainer } from "./c2d-effect-container";

export class Music2d2Effect extends C2dEffectContainer {

	private color?: CanvasGradient;

	private rate: number = 5;
	private all: number = 360;
	private du: number = 1;	// 角度
	private r: number = 100; // 半径（自动设置）
	private w: number = 2 * this.DPR; // 宽（自动设置）
	private isEffectEnhance: boolean = true; // 效果增益

	private voiceHigh?: Uint8Array;

	constructor(dom: HTMLDivElement) {
		super(dom, {
			resize: () => {
				let sa = this.canvas.width / this.canvas.height;
				if (sa > 1.25) {
					this.rate = 5.5;
				}
				if (sa > 1.125 && sa <= 1.25) {
					this.rate = 5.25;
				}
				if (sa > 0.875 && sa <= 1.125) {
					this.rate = 5;
				}
				if (sa > 0.75 && sa < 0.875) {
					this.rate = 5.25;
				}
				if (sa <= 0.75) {
					this.rate = 5.5;
				}
				if (this.canvas.width < this.canvas.height) {
					this.r = (this.canvas.width / 2) * 0.725;
				} else {
					this.r = (this.canvas.height / 2) * 0.725;
				}
				this.w = 2 * this.DPR;
				this.setColor();
				if (this.voiceHigh != null) {
					this.update(this.voiceHigh);
				}
			},
		});
		this.init();
	}

	private init(): void {
		this.setColor();
	}

	private setColor(): void {
		if (this.canvas == null || this.ctx == null) {
			return;
		}
		let oW = this.canvas.width;
		let oH = this.canvas.height;
		this.color = this.ctx.createLinearGradient(oW / 2, oH / 2 - 10, oW / 2, oH / 2 - 150);
		this.color.addColorStop(0, '#1E90FF');
		this.color.addColorStop(0.25, '#FF7F50');
		this.color.addColorStop(0.5, '#8A2BE2');
		this.color.addColorStop(0.75, '#4169E1');
		this.color.addColorStop(1, '#00FFFF');
		this.ctx.strokeStyle = this.color;
	}

	public update(voiceHigh: Uint8Array): void {
		this.voiceHigh = voiceHigh;
		if (this.canvas == null || this.ctx == null) {
			return;
		}
		let oW = this.canvas.width;
		let oH = this.canvas.height;
		this.ctx.clearRect(0, 0, oW, oH);
		this.ctx.beginPath();
		this.ctx.lineWidth = this.w;
		for (let i = 0; i < this.all; i++) {
			let v = voiceHigh[i];
			let r = this.rate;
			v = Math.pow(v, 1.75);
			r = r * 50;
			let value = (v / r) * this.DPR;
			if (this.isEffectEnhance) {
				value = value * 2;
			}
			let rv1 = (this.r - value);
			let rv2 = (this.r + value);
			this.ctx.moveTo((Math.sin((i * this.du) / 180 * Math.PI) * rv1 + oW / 2), -Math.cos((i * this.du) / 180 * Math.PI) * rv1 + oH / 2);
			this.ctx.lineTo((Math.sin((i * this.du) / 180 * Math.PI) * rv2 + oW / 2), -Math.cos((i * this.du) / 180 * Math.PI) * rv2 + oH / 2);
		}
		this.ctx.stroke();
	}

}
