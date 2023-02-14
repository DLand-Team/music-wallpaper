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
		let effect2d1Panel = new Panel({ position: 'absolute', width: '100%', height: '100%' });
		let effect2d2Panel = new Panel({ position: 'absolute', width: '100%', height: '100%' });
		let effect2d3Panel = new Panel({ position: 'absolute', width: '100%', height: '100%' });
		let effect3d1Panel = new Panel({ position: 'absolute', width: '100%', height: '100%' });
		this.appPanel.add(effect3d1Panel);
		this.appPanel.add(effect2d3Panel);
		this.appPanel.add(effect2d2Panel);
		this.appPanel.add(effect2d1Panel);
		new Engine({
			e1_2d: effect2d1Panel.getDom(),
			e2_2d: effect2d2Panel.getDom(),
			e3_2d: effect2d3Panel.getDom(),
			// e1_3d: effect3d1Panel.getDom(),
		});
	}

}
