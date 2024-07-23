import { _decorator, Component, instantiate, Node, Prefab, Sprite, Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('tabs')
export class tabs extends Component {
    @property(Prefab) tabBtnPre: Prefab;

    tabBtns: Array<Node> = new Array<Node>(4);
    tabStr: Array<string> = ["基础", "赚钱", "黑科技", "商店"];


    curTab: number = 0;
    oldTab: number = this.curTab;
    suffix: string = "-选中"

    start() {
        for (var i = 0; i < 4; i++) {
            let tempBtn = instantiate(this.tabBtnPre);
            this.node.addChild(tempBtn);
            this.tabBtns[i] = tempBtn;
            let tempAtlas = tempBtn.getComponent(Sprite).spriteAtlas;
            tempBtn.getComponent(Sprite).spriteFrame = tempAtlas.getSpriteFrame(this.tabStr[i] + (i == 0 ? this.suffix : ""));

        }
        this.addTabBtnEvent();
    }

    update(deltaTime: number) {
        if (this.oldTab != this.curTab) {
            let tempAtlas = this.tabBtns[this.oldTab].getComponent(Sprite).spriteAtlas;
            this.tabBtns[this.oldTab].getComponent(Sprite).spriteFrame = tempAtlas.getSpriteFrame(this.tabStr[this.oldTab]);
            this.oldTab = this.curTab;

            tempAtlas = this.tabBtns[this.curTab].getComponent(Sprite).spriteAtlas;
            this.tabBtns[this.curTab].getComponent(Sprite).spriteFrame = tempAtlas.getSpriteFrame(this.tabStr[this.curTab] + this.suffix);
        }
    }


    addTabBtnEvent() {
        this.tabBtns[0].on(Button.EventType.CLICK, this.onTab0Clicked, this);
        this.tabBtns[1].on(Button.EventType.CLICK, this.onTab1Clicked, this);
        this.tabBtns[2].on(Button.EventType.CLICK, this.onTab2Clicked, this);
        this.tabBtns[3].on(Button.EventType.CLICK, this.onTab3Clicked, this);

    }

    onTab0Clicked() {
        this.curTab = 0;
    }
    onTab1Clicked() {
        this.curTab = 1;
    }
    onTab2Clicked() {
        this.curTab = 2;
    }
    onTab3Clicked() {
        this.curTab = 3;
    }

}


