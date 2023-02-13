import {Component} from "./base/component";
import {Layout} from "../layout/base/layout";
import {FlexLayout} from "../layout/flex-layout";

export class Panel extends Component<HTMLDivElement> {

    constructor(
        option?: PanelOption,
    ) {
        super();
        this.dom = document.createElement('div');
        if (option) {
            option.position && (this.dom.style.position = option.position);
            if (option.width != null) {
                if (option.width == '100%') {
                    this.dom.style.width = '100%';
                } else {
                    this.dom.style.width = option.width + 'px';
                }
            }
            if (option.height != null) {
                if (option.height == '100%') {
                    this.dom.style.height = '100%';
                } else {
                    this.dom.style.height = option.height + 'px';
                }
            }
        }
    }

    add(component: Component<any>): void {
        this.dom.appendChild(component.getDom());
    }

    setLayout(layout: Layout): void {
        switch (layout.constructor) {
            case FlexLayout:
                this.dom.style.display = 'flex';
                let flexDirection = (<FlexLayout>layout).option.flexDirection;
                flexDirection && (this.dom.style.flexDirection = flexDirection);
                let flexWrap = (<FlexLayout>layout).option.flexWrap;
                flexWrap && (this.dom.style.flexWrap = flexWrap);
                let justifyContent = (<FlexLayout>layout).option.justifyContent;
                justifyContent && (this.dom.style.justifyContent = justifyContent);
                let alignItems = (<FlexLayout>layout).option.alignItems;
                alignItems && (this.dom.style.alignItems = alignItems);
                let alignContent = (<FlexLayout>layout).option.alignContent;
                alignContent && (this.dom.style.alignContent = alignContent);
                break;
            default:
                break;
        }
    }

}

export type PanelOption = {
    position?: 'absolute' | 'relative' | 'fixed',
    width?: number | '100%',
    height?: number | '100%',
}