import { EffectContainer } from "../effect-container";

export abstract class WglEffectContainer extends EffectContainer {

	protected constructor(
		dom: HTMLDivElement,
		callback: {
			resize: () => void,
		}
	) {
		super(dom, callback);
	}

}
