declare const elementResizeDetectorMaker: any;

let DPR: number = window.devicePixelRatio;
let nozokuRate: number = 3.5;

export class Music3Effect {

	private containerWidth = 0;
	private containerHeight = 0;
	private canvas?: HTMLCanvasElement;
	private ctx?: CanvasRenderingContext2D;

	private rt_array: Array<RetAngle> = [];
	private rt_length = 10;
	private voicehigh?: Uint8Array;

	private isDestroyed = false;

	constructor(
		private dom: HTMLDivElement,
	) {
		this.containerWidth = dom.clientWidth;
		this.containerHeight = dom.clientHeight;
		this.init();
	}

	private init(): void {
		this.canvas = document.createElement('canvas');
		this.canvas.style.position = 'absolute';
		this.canvas.style.pointerEvents = 'none';
		this.canvas.style.width = this.containerWidth + 'px';
		this.canvas.style.height = this.containerHeight + 'px';
		this.canvas.style.bottom = '0';
		this.canvas.style.left = '0';
		this.onResize();
		this.dom.appendChild(this.canvas);
		this.addResizeListener();
		let ctx = this.canvas.getContext('2d');
		ctx && (this.ctx = ctx);
		this.setup();
	}

	private setup(): void {
		if (this.canvas == null || this.ctx == null) {
			return;
		}
		this.ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
		let aw = this.canvas.width / this.rt_length / 2;
		let w = aw - 3 * DPR;
		for (let i = 0; i < this.rt_length; i++) {
			this.rt_array.push(new RetAngle(
				this.canvas, this.ctx,
				w, // width
				5 * DPR, // height
				i * aw, // x
				this.canvas.height / 2 // y
			))
		}
	}

	private onResize() {
		if (this.dom == null || this.canvas == null) {
			return;
		}
		DPR = window.devicePixelRatio;
		this.containerWidth = this.dom.clientWidth;
		this.containerHeight = this.dom.clientHeight;
		this.canvas.style.width = this.containerWidth + 'px';
		this.canvas.style.height = this.containerHeight + 'px';
		this.canvas.width = this.containerWidth * DPR;
		this.canvas.height = this.containerHeight * DPR;
		if (this.containerHeight >= 200) {
			nozokuRate = 3.5;
		} else if (this.containerHeight >= 170 && this.containerHeight < 200) {
			nozokuRate = 4;
		} else {
			nozokuRate = 5;
		}
		if (this.ctx != null) {
			this.ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
		}
		for (let i = 0; i < this.rt_array.length; i++) {
			this.rt_array[i].resize();
		}
		if (this.voicehigh != null) {
			this.update(this.voicehigh);
		}
	}

	private addResizeListener(): void {
		elementResizeDetectorMaker().listenTo(this.dom, (e: HTMLDivElement) => {
			setTimeout(() => {
				this.onResize();
			});
		});
	}

	private removeResizeListener(): void {
		elementResizeDetectorMaker().uninstall(this.dom);
	}

	public destroy(): void {
		this.isDestroyed = true;
		this.removeResizeListener();
		this.canvas?.remove();
	}

	public update(voicehigh: Uint8Array): void {
		this.voicehigh = voicehigh;
		if (this.canvas == null || this.ctx == null) {
			return;
		}
		let step = Math.round(voicehigh.length / this.rt_length);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for (let i = 0; i < this.rt_array.length; i++) {
			let rt = this.rt_array[i];
			rt.update(voicehigh[step * i]);
		}
	}

}

class RetAngle {

	jg: number = 2 * DPR;
	power: number = 0;
	num: number = 0;
	dy: number = this.y;
	// lastDPR: number = CommonUtil.cloneDeep<number>(DPR);
	// lastNozokuRate: number = CommonUtil.cloneDeep<number>(nozokuRate);
	lastDPR: number = DPR;
	lastNozokuRate: number = nozokuRate;

	constructor(
		private canvas: HTMLCanvasElement,
		private ctx: CanvasRenderingContext2D,
		public w: number,
		public h: number,
		public x: number,
		public y: number
	) {
	}

	resize(): void {
		this.jg = 2 * DPR;
		this.w = DPR * (this.w / this.lastDPR);
		this.h = DPR * (this.h / this.lastDPR);
		this.x = DPR * (this.x / this.lastDPR);
		this.y = this.canvas.height / 2;
		this.power = DPR * ((this.power * this.lastNozokuRate) / this.lastDPR);
		// this.lastDPR = CommonUtil.cloneDeep<number>(DPR);
		this.lastDPR = DPR;
	}

	update(power: number): void {
		this.power = power * DPR / nozokuRate;
		this.num = ~~(this.power / this.h + 0.5 * DPR);
		// 更新小红块的位置，如果音频条长度高于红块位置，则红块位置则为音频条高度，否则让小红块下降
		// let nh = this.dy + this.h; // 小红块当前位置
		// if (this.power >= this.y - nh) {
		//     this.dy = this.y - this.power - this.h - (this.power == 0 ? 0 : 1);
		// } else if (nh > this.y) {
		//     this.dy = this.y - this.h;
		// } else {
		//     this.dy += 1;
		// }
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
			this.ctx.clearRect(rightX - 1 * DPR, y, this.w + 2 * DPR, this.jg);
		}
		// this.ctx.fillRect(rightX, ~~this.dy, this.w, this.h);
		// 左上
		this.ctx.fillRect(leftX, this.y - h, this.w, h);
		for (let i = 0; i < this.num; i++) {
			let y = this.y - i * (this.h + this.jg);
			this.ctx.clearRect(leftX - 1 * DPR, y, this.w + 2 * DPR, this.jg);
		}
		// this.ctx.fillRect(leftX, ~~this.dy, this.w, this.h);
		// 右下
		this.ctx.fillRect(rightX, this.canvas.height - this.y, this.w, h);
		for (let i = 0; i < this.num; i++) {
			let y = this.y - i * (this.h + this.jg);
			this.ctx.clearRect(rightX - 1 * DPR, this.canvas.height - y, this.w + 2 * DPR, this.jg);
		}
		// 左下
		this.ctx.fillRect(leftX, this.canvas.height - this.y, this.w, h);
		for (let i = 0; i < this.num; i++) {
			let y = this.y - i * (this.h + this.jg);
			this.ctx.clearRect(leftX - 1 * DPR, this.canvas.height - y, this.w + 2 * DPR, this.jg);
		}
	}

}
