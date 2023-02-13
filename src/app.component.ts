import { Panel } from "./wt/component/panel";
import { Engine } from "./core/engine";

export class AppComponent {

	private appPanel = new Panel({ position: 'absolute', width: '100%', height: '100%' });

	constructor() {
		let appContainer = document.createElement('div');
		appContainer.style.position = 'absolute';
		appContainer.style.width = '100%';
		appContainer.style.height = '100%';
		appContainer.appendChild(this.appPanel.getDom());
		document.body.appendChild(appContainer);
		this.init();
	}

	private init(): void {
		let effect1Panel = new Panel({ position: 'absolute', width: '100%', height: '100%' });
		this.appPanel.add(effect1Panel);
		new Engine({
			e1: effect1Panel.getDom(),
		});
	}

}
