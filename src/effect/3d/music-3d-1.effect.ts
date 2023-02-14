import { WglEffectContainer } from "./wgl-effect-container";
import { ArcRotateCamera, Color4, Engine, HemisphericLight, MeshBuilder, Scene, StandardMaterial, Texture, Vector3 } from "babylonjs";
import { Mesh } from "babylonjs/Meshes/mesh";

export class Music3d1Effect extends WglEffectContainer {

	private engine!: Engine;
	private scene!: Scene;
	private voiceHigh?: Uint8Array;

	private num = 40;
	private boxes: Array<Array<Mesh>> = [];

	constructor(dom: HTMLDivElement) {
		super(dom, {
			resize: () => {

			},
		});
		this.init();
	}

	private init(): void {
		this.engine = new Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false });
		this.scene = new Scene(this.engine);
		this.scene.clearColor = new Color4(0, 0, 0, 0);
		let camera = new ArcRotateCamera('camera', 2.5 * Math.PI / 4, Math.PI / 4, 4, Vector3.Zero(), this.scene);
		camera.attachControl(this.canvas, true);
		new HemisphericLight('light', new Vector3(1, 1, 0), this.scene);
		// let ground = MeshBuilder.CreateGround('ground', { width: 3.5, height: 3.5 });
		// ground.position.x = 0;
		// ground.position.z = 0;
		// ground.position.y = 0;
		this.initGroundBlocks();
	}

	private initGroundBlocks(): void {
		for (let i = 0; i <= this.num; i++) {
			if (this.boxes[i] == null) {
				this.boxes[i] = [];
			}
			for (let j = 0; j <= this.num; j++) {
				let box = MeshBuilder.CreateBox(`box-${i}-${j}`, { height: 0.1, width: 0.05, depth: 0.05 }, this.scene);
				box.position.x = (i - this.num / 2) / 15 + 0.25;
				box.position.z = (j - this.num / 2) / 15 - 0.35;
				box.position.y = 0.05;
				this.boxes[i][j] = box;
			}
		}
	}

	public update(voiceHigh: Uint8Array): void {
		this.voiceHigh = voiceHigh;
		// 上行0
		let step = Math.round(this.voiceHigh.length / (this.num * 1.25));
		for (let i = this.boxes.length - 1; i >= 0; i--) {
			let value = this.voiceHigh[step * (this.boxes.length - 1 - i)]; // 左到右
			this.boxes[i][0].scaling.y = value / 15 + 1;
		}
		// 上行1
		for (let i = this.boxes.length - 1; i >= 0; i--) {
			let value = this.voiceHigh[step * i]; // 右到左
			this.boxes[i][1].scaling.y = value / 15 + 1;
		}
		// 上行2
		let start = Math.round(this.voiceHigh.length / 3);
		let end = Math.round(this.voiceHigh.length / 3) * 2;
		let middleVoiceHigh = [];
		for (let i = start; i <= end; i++) {
			middleVoiceHigh.push(this.voiceHigh[i]);
		}
		let middleStep = Math.round(middleVoiceHigh.length / (this.num * 1.25));
		for (let i = this.boxes.length - 1; i >= 0; i--) {
			let value = middleVoiceHigh[middleStep * (this.boxes.length - 1 - i)]; // 左到右
			this.boxes[i][2].scaling.y = value / 20 + 1;
		}
		// 左列0,1
		for (let i = this.boxes.length - 3 - 1; i >= 0; i--) {
			let value = this.voiceHigh[step * i]; // 上到下
			this.boxes[this.boxes.length - 1][i + 3].scaling.y = value / 15 + 1;
			this.boxes[this.boxes.length - 2][i + 3].scaling.y = value / 20 + 1;
		}
		this.scene.render();
	}

}
