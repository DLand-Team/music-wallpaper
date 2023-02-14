import { EffectContainer } from "../effect-container";

export abstract class C2dEffectContainer extends EffectContainer {

	protected ctx!: CanvasRenderingContext2D;

	protected constructor(
		dom: HTMLDivElement,
		callback: {
			resize: () => void,
		}
	) {
		super(dom, callback);
		let ctx = this.canvas.getContext('2d');
		ctx && (this.ctx = ctx);
	}

}
