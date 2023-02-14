declare const elementResizeDetectorMaker: any;

export abstract class EffectContainer {

	protected containerWidth = 0;
	protected containerHeight = 0;
	protected DPR = window.devicePixelRatio;
	protected canvas: HTMLCanvasElement;
	protected isDestroyed = false;

	protected constructor(
		protected dom: HTMLDivElement,
		private callback: {
			resize: () => void,
		}
	) {
		this.containerWidth = dom.clientWidth;
		this.containerHeight = dom.clientHeight;
		this.canvas = document.createElement('canvas');
		this.canvas.style.position = 'absolute';
		this.canvas.style.pointerEvents = 'none';
		this.canvas.style.width = this.containerWidth + 'px';
		this.canvas.style.height = this.containerHeight + 'px';
		this.canvas.style.bottom = '0';
		this.canvas.style.left = '0';
		this.dom.appendChild(this.canvas);
		this.addResizeListener();
	}

	protected onResize() {
		if (this.canvas == null) {
			return;
		}
		this.DPR = window.devicePixelRatio;
		this.containerWidth = this.dom.clientWidth;
		this.containerHeight = this.dom.clientHeight;
		this.canvas.style.width = this.containerWidth + 'px';
		this.canvas.style.height = this.containerHeight + 'px';
		this.canvas.width = this.containerWidth * this.DPR;
		this.canvas.height = this.containerHeight * this.DPR;
		this.callback.resize();
	}

	protected addResizeListener(): void {
		elementResizeDetectorMaker().listenTo(this.dom, (e: HTMLDivElement) => {
			setTimeout(() => {
				this.onResize();
			});
		});
	}

	protected removeResizeListener(): void {
		elementResizeDetectorMaker().uninstall(this.dom);
	}

	public destroy(): void {
		this.isDestroyed = true;
		this.removeResizeListener();
		this.canvas?.remove();
	}

}
