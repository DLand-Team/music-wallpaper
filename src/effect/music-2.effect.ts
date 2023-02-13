declare const elementResizeDetectorMaker: any;

export class Music2Effect {

    private containerWidth = 0;
    private containerHeight = 0;
    private DPR = window.devicePixelRatio;
    private canvas?: HTMLCanvasElement;
    private ctx?: CanvasRenderingContext2D;
    private color?: CanvasGradient;

    private rate: number = 5;
    private all: number = 180;
    private du: number = 2;	//角度
    private r: number = 100; //半径
    private w: number = 2;	//宽（线条的粗细）
    private voiceHigh?: Uint8Array;

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
        this.setColor();
    }

    private onResize() {
        if (this.dom == null || this.canvas == null) {
            return;
        }
        this.DPR = window.devicePixelRatio;
        this.containerWidth = this.dom.clientWidth;
        this.containerHeight = this.dom.clientHeight;
        this.canvas.style.width = this.containerWidth + 'px';
        this.canvas.style.height = this.containerHeight + 'px';
        this.canvas.width = this.containerWidth * this.DPR;
        this.canvas.height = this.containerHeight * this.DPR;
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
        if (this.ctx != null) {
            this.setColor();
        }
        if (this.voiceHigh != null) {
            this.update(this.voiceHigh);
        }
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
            let rv1 = (this.r - value);
            let rv2 = (this.r + value);
            this.ctx.moveTo((Math.sin((i * this.du) / 180 * Math.PI) * rv1 + oW / 2), -Math.cos((i * this.du) / 180 * Math.PI) * rv1 + oH / 2);
            this.ctx.lineTo((Math.sin((i * this.du) / 180 * Math.PI) * rv2 + oW / 2), -Math.cos((i * this.du) / 180 * Math.PI) * rv2 + oH / 2);
        }
        this.ctx.stroke();
    }

}
