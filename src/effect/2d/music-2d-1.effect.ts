import { C2dEffectContainer } from "./c2d-effect-container";

export class Music2d1Effect extends C2dEffectContainer {

	private color?: CanvasGradient;

	private WIDTH_RATE = 0.425 * this.DPR;
	private HEIGHT_RATE = 0.515 * this.DPR;
	private dotDropSpeed: number = 0.375 * this.DPR;
	private RATE: number = 1.9;
	private num = (window.innerWidth / 10) * this.RATE;
	private dots: Array<{ cap: number, bottom: number, height: number }> = [];
	private addHeight: number = 0; // 补正高度
	private isEffectEnhance: boolean = true; // 效果增益
	private voiceHigh?: Uint8Array;

	private frameTime: number = 0;

	constructor(dom: HTMLDivElement) {
		super(dom, {
			resize: () => {
				this.WIDTH_RATE = 0.425 * this.DPR;
				this.HEIGHT_RATE = 0.515 * this.DPR;
				this.dotDropSpeed = 0.375 * this.DPR;
				this.num = (this.dom.clientWidth / 10) * this.RATE;
				this.setColor();
				this.setDots();
			},
		});
		this.init();
	}

	private init(): void {
		this.setColor();
		this.setDots();
		this.loop(0);
	}

	private loop(e: number) {
		if (e - this.frameTime >= 16) {
			this.frameTime = e;
			this.render();
		}
		requestAnimationFrame((e1: number) => {
			if (!this.isDestroyed) {
				this.loop(e1);
			}
		});
	}

	private setColor(): void {
		if (this.canvas == null || this.ctx == null) {
			return;
		}
		this.color = this.ctx.createLinearGradient(
			this.canvas.width * 0.5,
			this.canvas.height - 160 * this.HEIGHT_RATE,
			this.canvas.width * 0.5,
			this.canvas.height
		);
		this.color.addColorStop(0, '#0f0'); // 绿
		this.color.addColorStop(0.35, '#0f0') // 绿
		this.color.addColorStop(0.9, '#f00'); // 红
		this.color.addColorStop(1, '#f00'); // 红
		// this.color.addColorStop(0, '#0f0'); // 绿
		// this.color.addColorStop(0.2, '#0f0') // 绿
		// this.color.addColorStop(0.7, '#f00'); // 红
		// this.color.addColorStop(0.8, '#f00'); // 红
		// this.color.addColorStop(1, '#f0f'); // 粉
		this.ctx.fillStyle = this.color;
	}

	private setDots(): void {
		this.dots = [];
		for (let i = 0; i < this.num; i++) {
			this.dots.push({
				cap: 0, // 柱状上面小方块高度参数
				bottom: 10 * this.DPR,
				height: 2 * this.DPR,
			});
		}
	}

	private render(): void {
		if (this.voiceHigh == null || this.canvas == null || this.ctx == null) {
			return;
		}
		let step = Math.round(this.voiceHigh.length / this.num);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.beginPath();
		let rectWidth = 7 * this.WIDTH_RATE;
		for (let i = 1; i < this.num; i++) {
			let value = this.voiceHigh[step * i] + this.addHeight;
			if (this.isEffectEnhance) {
				value = Math.pow(value, 1.25);
				value = value / 3.75;
			}
			// 绘制矩形条（x, y, width, height）
			let leftX = this.canvas.width * 0.5 - i * 10 * this.WIDTH_RATE;
			let rightX = (i - 1) * 10 * this.WIDTH_RATE + this.canvas.width * 0.5;
			let rectHeight = (-value + 1) * this.HEIGHT_RATE;
			this.ctx.fillRect(
				leftX, this.canvas.height,
				rectWidth, rectHeight
			);
			this.ctx.fillRect(
				rightX, this.canvas.height,
				rectWidth, rectHeight
			);
			// 绘制柱状上面小方块
			if (value == 0 && this.dots[i].cap == 0) {
				continue;
			}
			let dotY = this.canvas.height - this.dots[i].cap;
			this.ctx.fillRect(
				leftX, dotY,
				rectWidth, this.dots[i].height
			);
			this.ctx.fillRect(
				rightX, dotY,
				rectWidth, this.dots[i].height
			);
			this.dots[i].cap = this.dots[i].cap - this.dotDropSpeed;
			if (value != 0 && this.dots[i].cap <= -rectHeight + this.dots[i].bottom) {
				this.dots[i].cap = -rectHeight + this.dots[i].bottom;
			}
			// this.ctx.fill();
		}
		this.ctx.stroke();
	}

	public update(voiceHigh: Uint8Array): void {
		this.voiceHigh = voiceHigh;
	}

}
