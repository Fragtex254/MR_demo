import { _decorator, Component, Node, Prefab, instantiate, Vec3, Button, resources, SpriteFrame, Sprite, log, Label } from 'cc';
import { TowerBtn, TowerState } from '../TowerBtn';
import { TowerIndex, AllTowerConfigInfo, TowerConfigInfo, ResType } from '../Global';
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
    @property(Node) itemLayout: Node;
    @property(Node) tabs: Node;
    @property(Node) main:Node;
    callBtn: Node = null;

    isShowing: boolean = false;

    itemBtnBuyStateStrs: Array<string> = ["可购买", "未拥有", "已拥有"];


    //hard code here, should be changed to use a global array.
    items:Array<Node> = new Array<Node>(4)


    start() {
        this.initTowerBtns();
        this.node.active = false;       //wait for game start
        for (var i = 0; i < 4; i++) {

            let tempItem = instantiate(this.itemPre);
            this.itemLayout.addChild(tempItem);

            let tempTowerConfigInfo: TowerConfigInfo = AllTowerConfigInfo[i];
            let tempItemBtn = tempItem.getChildByName("Button").getComponent(Button);
            tempItemBtn.node.on(Button.EventType.CLICK, this.onBtnClick, this);

            //set item icon
            resources.load(tempTowerConfigInfo.iconPath + "/spriteFrame", SpriteFrame, (err, spriteFrame) => {
                tempItem.getChildByName("TowerIcon").getComponent(Sprite).spriteFrame = spriteFrame;
            });
            tempItem.getChildByName("towerDisc").getComponent(Label).string = tempTowerConfigInfo.towerDisc;
            tempItemBtn.getComponentInChildren(Label).string = tempTowerConfigInfo.buildCost.toString();

            //change buy btn bg sprite with buyState
            let tempSprite = tempItemBtn.node.getComponent(Sprite);
            let tempAtlas = tempSprite.spriteAtlas;
            tempSprite.spriteFrame = tempAtlas.getSpriteFrame(this.itemBtnBuyStateStrs[tempTowerConfigInfo.buyState]);

            this.items.push(tempItem);
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


