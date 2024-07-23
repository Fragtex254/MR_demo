import { _decorator, Component, Node, Prefab, instantiate, Vec3, Button } from 'cc';
import { TowerBtn, TowerState } from './TowerBtn';
const { ccclass, property } = _decorator;



export enum TowerType {
    MACHINE_GUN_TYPE,
    OTHER_TYPE,
    WRONG_TYPE
}

@ccclass('PageView')
export class PageView extends Component {

    @property(Prefab) itemPre: Prefab;
    @property(Node) towerBtns: Node = null;
    @property(Prefab) towerBtnPre: Prefab = null;
    @property(Node) itemLayout:Node;
    callBtn: Node = null;

    isShowing: boolean = false;


    start() {
        this.initTowerBtns();
        this.node.active = false;       //wait for game start
        

        for (var i = 0; i < 4; i++)
        {
            let tempItem = instantiate(this.itemPre);
            this.itemLayout.addChild(tempItem);
            let tempItemBtn = tempItem.getChildByName("Button").getComponent(Button);
            tempItemBtn.node.on(Button.EventType.CLICK, this.onBtnClick, this);
        }
    }

    update(deltaTime: number) {
        if (this.isShowing) {
            //todo:stop the game
        }
    }

    showPage() {
        if (this.isShowing != true) {
            this.node.active = true;
            this.isShowing = true;
        }
        else {
            return;
        }
    }

    closePage() {
        this.isShowing = false;
        var tempBtnState = this.callBtn.getComponent(TowerBtn).m_towerState;
        if (tempBtnState == TowerState.SELECTED) {
            this.callBtn.getComponent(TowerBtn).m_towerState = TowerState.EMPTY;
        }
        this.callBtn = null;
        this.node.active = false;
    }

    onBtnClick(towerKey: TowerType | any) {
        this.callBtn.getComponent(TowerBtn).buildMachineGun();
        console.log("BUild Machine Gun tower success!");
    }

    initTowerBtns() {
        var len = this.towerBtns.children.length;
        for (var i = 0; i < len; i++) {

            let tempNode = this.towerBtns.children[i];
            let tempBtn = instantiate(this.towerBtnPre);
            tempBtn.setParent(tempNode);
            tempBtn.position = Vec3.ZERO;
            tempBtn.getComponent(TowerBtn).SecondPage = this.node;
        }
    }
}


